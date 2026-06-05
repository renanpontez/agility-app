import { Buffer } from 'node:buffer';
import fs from 'node:fs/promises';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { POST } from './route';

vi.mock('node:fs/promises', () => {
  const access = vi.fn();
  const mkdir = vi.fn();
  const writeFile = vi.fn();
  const rename = vi.fn();
  return {
    default: { access, mkdir, writeFile, rename },
    access,
    mkdir,
    writeFile,
    rename,
  };
});

const TOKEN = '22222222222222222222222222222222';

const buildRequest = (
  body: unknown,
  { token = TOKEN, raw }: { token?: string | null; raw?: string } = {},
) => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token !== null) {
    headers.Authorization = `Bearer ${token}`;
  }
  return new Request('http://localhost/api/blog/upload', {
    method: 'POST',
    headers,
    body: raw ?? JSON.stringify(body),
  });
};

const callPost = async (body: unknown, opts?: Parameters<typeof buildRequest>[1]) => {
  const res = await POST(buildRequest(body, opts));
  const json = await res.json();
  return { status: res.status, body: json };
};

// 1×1 transparent PNG — smallest valid image payload we can ship as a fixture.
const TINY_PNG_BASE64
  = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPj/HwAEOgF/qPCJxQAAAABJRU5ErkJggg==';

beforeEach(() => {
  vi.clearAllMocks();
  process.env.BLOG_API_TOKEN = TOKEN;
  vi.mocked(fs.mkdir).mockResolvedValue(undefined);
  vi.mocked(fs.writeFile).mockResolvedValue(undefined);
  vi.mocked(fs.rename).mockResolvedValue(undefined);
  // Default: file does not exist yet. Tests that need the "already there"
  // path override this with mockResolvedValueOnce(undefined).
  vi.mocked(fs.access).mockRejectedValue(new Error('ENOENT'));
});

describe('POST /api/blog/upload — authentication', () => {
  it('rejects requests without a token', async () => {
    const { status } = await callPost(
      { data: TINY_PNG_BASE64, extension: 'png' },
      { token: null },
    );
    expect(status).toBe(401);
  });

  it('rejects requests with the wrong token', async () => {
    const { status } = await callPost(
      { data: TINY_PNG_BASE64, extension: 'png' },
      { token: 'wrong' },
    );
    expect(status).toBe(401);
  });
});

describe('POST /api/blog/upload — validation', () => {
  it('returns invalid_json when the body is not JSON', async () => {
    const { status, body } = await callPost(undefined, { raw: 'not-json' });
    expect(status).toBe(400);
    expect(body.error).toBe('invalid_json');
  });

  it('returns invalid_request when the extension is not in the allowlist', async () => {
    const { status, body } = await callPost({ data: TINY_PNG_BASE64, extension: 'svg' });
    expect(status).toBe(400);
    expect(body.error).toBe('invalid_request');
  });

  it('returns invalid_base64 for garbage payloads', async () => {
    const { status, body } = await callPost({
      data: '@@@not-base64@@@',
      extension: 'png',
    });
    expect(status).toBe(400);
    expect(body.error).toBe('invalid_base64');
  });

  it('returns payload_too_large for over-budget uploads', async () => {
    // 6MB of zeros, base64-encoded → 8MB string. Trips the 5MB ceiling.
    const buffer = Buffer.alloc(6 * 1024 * 1024, 0);
    const { status, body } = await callPost({
      data: buffer.toString('base64'),
      extension: 'png',
    });
    expect(status).toBe(413);
    expect(body.error).toBe('payload_too_large');
  });
});

describe('POST /api/blog/upload — happy path', () => {
  it('writes a content-addressed file and returns a public URL', async () => {
    const { status, body } = await callPost({ data: TINY_PNG_BASE64, extension: 'png' });
    expect(status).toBe(201);
    expect(body.ok).toBe(true);
    expect(body.data.url).toMatch(/^\/blog\/uploads\/[a-f0-9]{16}\.png$/);
    expect(body.data.extension).toBe('png');
    expect(body.data.contentType).toBe('image/png');
    expect(body.data.existing).toBe(false);
    expect(fs.mkdir).toHaveBeenCalledWith(
      expect.stringContaining('public/blog/uploads'),
      { recursive: true },
    );
    expect(fs.writeFile).toHaveBeenCalledTimes(1);
    expect(fs.rename).toHaveBeenCalledTimes(1);
  });

  it('strips the data-URI prefix before decoding', async () => {
    const { status, body } = await callPost({
      data: `data:image/png;base64,${TINY_PNG_BASE64}`,
      extension: 'png',
    });
    expect(status).toBe(201);
    expect(body.data.url).toMatch(/\.png$/);
  });

  it('short-circuits when the same content already exists', async () => {
    vi.mocked(fs.access).mockResolvedValueOnce(undefined);
    const { status, body } = await callPost({ data: TINY_PNG_BASE64, extension: 'png' });
    expect(status).toBe(200);
    expect(body.data.existing).toBe(true);
    expect(fs.writeFile).not.toHaveBeenCalled();
    expect(fs.rename).not.toHaveBeenCalled();
  });

  it('produces the same URL for identical content (idempotent)', async () => {
    const first = await callPost({ data: TINY_PNG_BASE64, extension: 'png' });
    vi.mocked(fs.access).mockResolvedValueOnce(undefined);
    const second = await callPost({ data: TINY_PNG_BASE64, extension: 'png' });
    expect(first.body.data.url).toBe(second.body.data.url);
  });
});

describe('POST /api/blog/upload — storage errors', () => {
  it('returns 500 storage_write_failed when writeFile throws', async () => {
    vi.mocked(fs.writeFile).mockRejectedValueOnce(new Error('disk full'));
    const { status, body } = await callPost({ data: TINY_PNG_BASE64, extension: 'png' });
    expect(status).toBe(500);
    expect(body.error).toBe('storage_write_failed');
  });
});
