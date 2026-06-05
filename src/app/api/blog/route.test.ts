import fs from 'node:fs/promises';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { BlogPost } from '@/types/blog';

import { POST } from './route';

vi.mock('node:fs/promises', () => {
  const readFile = vi.fn();
  const writeFile = vi.fn();
  const rename = vi.fn();
  return {
    default: { readFile, writeFile, rename },
    readFile,
    writeFile,
    rename,
  };
});

const TOKEN = '11111111111111111111111111111111';

const samplePosts = (): BlogPost[] => [
  {
    slug: 'post-a',
    title: 'Post A',
    excerpt: 'Excerpt A long enough',
    publishedAt: '2026-05-01',
    category: 'Produto',
    body: [{ type: 'paragraph', text: 'paragraph a' }],
  },
  {
    slug: 'post-b',
    title: 'Post B',
    excerpt: 'Excerpt B long enough',
    publishedAt: '2026-04-01',
    category: 'Design',
    body: [{ type: 'paragraph', text: 'paragraph b' }],
  },
  {
    slug: 'post-c',
    title: 'Post C',
    excerpt: 'Excerpt C long enough',
    publishedAt: '2026-03-01',
    category: 'Inteligência Artificial',
    body: [{ type: 'paragraph', text: 'paragraph c' }],
  },
];

const buildRequest = (
  body: unknown,
  { token = TOKEN, raw }: { token?: string | null; raw?: string } = {},
) => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token !== null) {
    headers.Authorization = `Bearer ${token}`;
  }
  return new Request('http://localhost/api/blog', {
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

beforeEach(() => {
  vi.clearAllMocks();
  process.env.BLOG_API_TOKEN = TOKEN;
  vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(samplePosts()));
  vi.mocked(fs.writeFile).mockResolvedValue(undefined);
  vi.mocked(fs.rename).mockResolvedValue(undefined);
});

describe('POST /api/blog — authentication', () => {
  it('rejects requests without an Authorization header', async () => {
    const { status, body } = await callPost({ action: 'list' }, { token: null });
    expect(status).toBe(401);
    expect(body).toEqual({ ok: false, error: 'unauthorized' });
  });

  it('rejects requests with the wrong token', async () => {
    const { status, body } = await callPost({ action: 'list' }, { token: 'wrong' });
    expect(status).toBe(401);
    expect(body.error).toBe('unauthorized');
  });

  it('rejects requests when BLOG_API_TOKEN is unset on the server', async () => {
    delete process.env.BLOG_API_TOKEN;
    const { status } = await callPost({ action: 'list' });
    expect(status).toBe(401);
  });

  it('accepts the correct token', async () => {
    const { status } = await callPost({ action: 'list' });
    expect(status).toBe(200);
  });
});

describe('POST /api/blog — request validation', () => {
  it('returns invalid_json when the body is not JSON', async () => {
    const { status, body } = await callPost(undefined, { raw: 'not-json' });
    expect(status).toBe(400);
    expect(body.error).toBe('invalid_json');
  });

  it('returns invalid_request for an unknown action', async () => {
    const { status, body } = await callPost({ action: 'delete', slug: 'foo' });
    expect(status).toBe(400);
    expect(body.error).toBe('invalid_request');
    expect(body.details.fieldErrors.action).toBeDefined();
  });

  it('rejects a create payload that is missing required fields', async () => {
    const { status, body } = await callPost({ action: 'create', post: { title: 'oi' } });
    expect(status).toBe(400);
    expect(body.error).toBe('invalid_request');
    // Three issues: title too short, excerpt missing, body missing.
    expect(body.details.fieldErrors.post).toHaveLength(3);
    expect(body.details.fieldErrors.post).toEqual(
      expect.arrayContaining([
        expect.stringContaining('expected array'),
      ]),
    );
  });
});

describe('POST /api/blog — list', () => {
  it('returns posts sorted newest first', async () => {
    const { status, body } = await callPost({ action: 'list' });
    expect(status).toBe(200);
    expect(body.data.total).toBe(3);
    expect(body.data.posts.map((p: { slug: string }) => p.slug)).toEqual([
      'post-a',
      'post-b',
      'post-c',
    ]);
  });

  it('strips body blocks from the summary payload', async () => {
    const { body } = await callPost({ action: 'list' });
    expect(body.data.posts[0]).not.toHaveProperty('body');
  });

  it('filters by exact category label', async () => {
    const { body } = await callPost({ action: 'list', category: 'Design' });
    expect(body.data.posts).toHaveLength(1);
    expect(body.data.posts[0].slug).toBe('post-b');
  });

  it('filters by categorySlug (diacritic-insensitive)', async () => {
    const { body } = await callPost({
      action: 'list',
      categorySlug: 'inteligencia-artificial',
    });
    expect(body.data.posts).toHaveLength(1);
    expect(body.data.posts[0].slug).toBe('post-c');
  });

  it('paginates with limit and offset', async () => {
    const { body } = await callPost({ action: 'list', limit: 1, offset: 1 });
    expect(body.data.total).toBe(3);
    expect(body.data.count).toBe(1);
    expect(body.data.posts[0].slug).toBe('post-b');
  });
});

describe('POST /api/blog — read', () => {
  it('returns the full post for an existing slug', async () => {
    const { status, body } = await callPost({ action: 'read', slug: 'post-a' });
    expect(status).toBe(200);
    expect(body.data.post.slug).toBe('post-a');
    expect(body.data.post.body).toBeDefined();
  });

  it('returns 404 for an unknown slug', async () => {
    const { status, body } = await callPost({ action: 'read', slug: 'nope' });
    expect(status).toBe(404);
    expect(body.error).toBe('not_found');
    expect(body.details).toEqual({ slug: 'nope' });
  });
});

describe('POST /api/blog — create', () => {
  it('auto-generates slug from title and computes reading time', async () => {
    const longText = 'palavra '.repeat(400).trim();
    const { status, body } = await callPost({
      action: 'create',
      post: {
        title: 'Novo post sobre IA',
        excerpt: 'Resumo suficientemente longo para passar na validação.',
        body: [{ type: 'paragraph', text: longText }],
      },
    });
    expect(status).toBe(201);
    expect(body.data.post.slug).toBe('novo-post-sobre-ia');
    // 400 words / 200 wpm → 2 min
    expect(body.data.post.readingTimeMinutes).toBe(2);
    expect(body.data.post.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('writes the new post at the head of the array', async () => {
    await callPost({
      action: 'create',
      post: {
        title: 'Novo Post',
        excerpt: 'Excerpt long enough for the validator.',
        body: [{ type: 'paragraph', text: 'hi' }],
      },
    });
    expect(fs.writeFile).toHaveBeenCalledTimes(1);
    expect(fs.rename).toHaveBeenCalledTimes(1);
    const written = JSON.parse(vi.mocked(fs.writeFile).mock.calls[0]![1] as string);
    expect(written[0].slug).toBe('novo-post');
    expect(written).toHaveLength(4);
  });

  it('rejects a duplicate slug with 409', async () => {
    const { status, body } = await callPost({
      action: 'create',
      post: {
        slug: 'post-a',
        title: 'Already exists',
        excerpt: 'Excerpt long enough for the validator.',
        body: [{ type: 'paragraph', text: 'x' }],
      },
    });
    expect(status).toBe(409);
    expect(body.error).toBe('slug_conflict');
    expect(body.details).toEqual({ slug: 'post-a' });
    expect(fs.writeFile).not.toHaveBeenCalled();
  });

  it('returns invalid_slug when title slugifies to empty', async () => {
    const { status, body } = await callPost({
      action: 'create',
      post: {
        title: '!!!',
        excerpt: 'Excerpt long enough for the validator.',
        body: [{ type: 'paragraph', text: 'x' }],
      },
    });
    expect(status).toBe(400);
    expect(body.error).toBe('invalid_slug');
  });
});

describe('POST /api/blog — update', () => {
  it('merges patch, preserves slug, bumps updatedAt', async () => {
    const { status, body } = await callPost({
      action: 'update',
      slug: 'post-a',
      patch: { category: 'Inteligência Artificial' },
    });
    expect(status).toBe(200);
    expect(body.data.post.slug).toBe('post-a');
    expect(body.data.post.category).toBe('Inteligência Artificial');
    expect(body.data.post.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('recomputes reading time when body changes', async () => {
    const newBody = [{ type: 'paragraph' as const, text: 'word '.repeat(600).trim() }];
    const { body } = await callPost({
      action: 'update',
      slug: 'post-a',
      patch: { body: newBody },
    });
    // 600 words / 200 wpm → 3 min
    expect(body.data.post.readingTimeMinutes).toBe(3);
  });

  it('returns 404 for an unknown slug', async () => {
    const { status, body } = await callPost({
      action: 'update',
      slug: 'nope',
      patch: { category: 'Produto' },
    });
    expect(status).toBe(404);
    expect(body.error).toBe('not_found');
    expect(fs.writeFile).not.toHaveBeenCalled();
  });

  it('rejects slug-in-patch', async () => {
    const { status, body } = await callPost({
      action: 'update',
      slug: 'post-a',
      patch: { slug: 'renamed' },
    });
    expect(status).toBe(400);
    expect(body.error).toBe('invalid_request');
    expect(body.details.fieldErrors.patch).toBeDefined();
  });
});

describe('POST /api/blog — storage errors', () => {
  it('returns 500 storage_read_failed when readFile throws', async () => {
    vi.mocked(fs.readFile).mockRejectedValueOnce(new Error('disk gone'));
    const { status, body } = await callPost({ action: 'list' });
    expect(status).toBe(500);
    expect(body.error).toBe('storage_read_failed');
  });

  it('returns 500 storage_write_failed when create cannot persist', async () => {
    vi.mocked(fs.writeFile).mockRejectedValueOnce(new Error('read-only fs'));
    const { status, body } = await callPost({
      action: 'create',
      post: {
        title: 'Novo Post',
        excerpt: 'Excerpt long enough for the validator.',
        body: [{ type: 'paragraph', text: 'hi' }],
      },
    });
    expect(status).toBe(500);
    expect(body.error).toBe('storage_write_failed');
  });
});
