import { Buffer } from 'node:buffer';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

import { NextResponse } from 'next/server';
import { z } from 'zod';

import { isAuthorized } from '../auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// 5MB after base64 decode — covers full-bleed blog covers, blocks reckless uploads.
const MAX_BYTES = 5 * 1024 * 1024;

// SVG is intentionally excluded: it can carry inline scripts and would
// execute when served from /public on the same origin as the app.
const ALLOWED_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp', 'avif', 'gif'] as const;

type Extension = (typeof ALLOWED_EXTENSIONS)[number];

const EXTENSION_TO_CONTENT_TYPE: Record<Extension, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  avif: 'image/avif',
  gif: 'image/gif',
};

const requestSchema = z.object({
  // Base64-encoded image. The data-URI prefix ("data:image/png;base64,") is
  // optional — it's stripped if present so callers can paste either form.
  data: z.string().min(1),
  extension: z.enum(ALLOWED_EXTENSIONS),
});

const errorResponse = (status: number, error: string, details?: unknown) =>
  NextResponse.json({ ok: false, error, ...(details === undefined ? {} : { details }) }, { status });

const stripDataUri = (data: string) => {
  const match = /^data:[^;]+;base64,(.+)$/.exec(data);
  return match?.[1] ?? data;
};

const UPLOAD_DIR = path.resolve(process.cwd(), 'public', 'blog', 'uploads');
const PUBLIC_URL_PREFIX = '/blog/uploads';

export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return errorResponse(401, 'unauthorized');
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return errorResponse(400, 'invalid_json');
  }

  const parsed = requestSchema.safeParse(raw);
  if (!parsed.success) {
    return errorResponse(400, 'invalid_request', parsed.error.flatten());
  }

  const { extension } = parsed.data;
  const base64 = stripDataUri(parsed.data.data);

  let buffer: Buffer;
  try {
    buffer = Buffer.from(base64, 'base64');
  } catch {
    return errorResponse(400, 'invalid_base64');
  }

  // Buffer.from with an invalid base64 input silently produces a short buffer
  // instead of throwing — re-encode and compare to catch garbage payloads.
  if (buffer.length === 0 || buffer.toString('base64').replace(/=+$/, '') !== base64.replace(/=+$/, '')) {
    return errorResponse(400, 'invalid_base64');
  }

  if (buffer.length > MAX_BYTES) {
    return errorResponse(413, 'payload_too_large', { bytes: buffer.length, maxBytes: MAX_BYTES });
  }

  // Content-addressed filename — uploading the same image twice yields the
  // same URL. 16 hex chars of sha256 = 64 bits of entropy, ample for blog use.
  const hash = crypto.createHash('sha256').update(buffer).digest('hex').slice(0, 16);
  const filename = `${hash}.${extension}`;
  const targetPath = path.join(UPLOAD_DIR, filename);
  const publicUrl = `${PUBLIC_URL_PREFIX}/${filename}`;

  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  } catch {
    return errorResponse(500, 'storage_write_failed');
  }

  // Short-circuit if the same content already exists — avoid a redundant write.
  try {
    await fs.access(targetPath);
    return NextResponse.json(
      {
        ok: true,
        data: {
          url: publicUrl,
          bytes: buffer.length,
          extension,
          contentType: EXTENSION_TO_CONTENT_TYPE[extension],
          existing: true,
        },
      },
    );
  } catch {
    // file doesn't exist — fall through to write.
  }

  // Atomic write: temp file → rename. Avoids serving a half-written image
  // if the request is interrupted mid-flight.
  const tmpPath = `${targetPath}.tmp`;
  try {
    await fs.writeFile(tmpPath, buffer);
    await fs.rename(tmpPath, targetPath);
  } catch {
    return errorResponse(500, 'storage_write_failed');
  }

  return NextResponse.json(
    {
      ok: true,
      data: {
        url: publicUrl,
        bytes: buffer.length,
        extension,
        contentType: EXTENSION_TO_CONTENT_TYPE[extension],
        existing: false,
      },
    },
    { status: 201 },
  );
}
