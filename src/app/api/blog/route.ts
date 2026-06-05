import { Buffer } from 'node:buffer';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

import { NextResponse } from 'next/server';
import { z } from 'zod';

import { slugifyCategory } from '@/components/blog/categories';
import type { BlogBodyBlock, BlogPost } from '@/types/blog';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const BLOG_PATH = path.resolve(process.cwd(), 'src/data/blog.json');

const dateOrIso = z
  .string()
  .regex(
    /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?)?$/,
    'must be YYYY-MM-DD or ISO 8601 datetime',
  );

const slugSchema = z
  .string()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'must be lowercase letters, digits and hyphens');

const imageSrcSchema = z
  .string()
  .min(1)
  .refine(s => s.startsWith('http://') || s.startsWith('https://') || s.startsWith('/'), {
    message: 'must be an absolute URL or a path starting with /',
  });

const bodyBlockSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('paragraph'), text: z.string().min(1) }),
  z.object({
    type: z.literal('heading'),
    level: z.union([z.literal(2), z.literal(3)]),
    text: z.string().min(1),
  }),
  z.object({
    type: z.literal('list'),
    ordered: z.boolean().optional(),
    items: z.array(z.string().min(1)).min(1),
  }),
  z.object({
    type: z.literal('quote'),
    text: z.string().min(1),
    cite: z.string().optional(),
  }),
  z.object({
    type: z.literal('image'),
    src: imageSrcSchema,
    alt: z.string().min(1),
    caption: z.string().optional(),
  }),
  z.object({
    type: z.literal('code'),
    language: z.string().optional(),
    code: z.string().min(1),
  }),
]);

const authorSchema = z.object({
  name: z.string().min(1),
  avatar: imageSrcSchema.optional(),
  role: z.string().optional(),
});

const postCreateSchema = z.object({
  slug: slugSchema.optional(),
  title: z.string().min(3).max(200),
  excerpt: z.string().min(10).max(500),
  coverImage: imageSrcSchema.optional(),
  coverAlt: z.string().optional(),
  publishedAt: dateOrIso.optional(),
  updatedAt: dateOrIso.optional(),
  readingTimeMinutes: z.number().int().positive().max(120).optional(),
  category: z.string().min(1).max(60).optional(),
  tags: z.array(z.string().min(1).max(40)).max(20).optional(),
  author: authorSchema.optional(),
  body: z.array(bodyBlockSchema).min(1),
});

const postPatchSchema = postCreateSchema.partial().extend({
  slug: z.never().optional(),
});

const requestSchema = z.discriminatedUnion('action', [
  z.object({
    action: z.literal('list'),
    category: z.string().optional(),
    categorySlug: z.string().optional(),
    limit: z.number().int().positive().max(100).optional(),
    offset: z.number().int().nonnegative().optional(),
  }),
  z.object({ action: z.literal('read'), slug: slugSchema }),
  z.object({ action: z.literal('create'), post: postCreateSchema }),
  z.object({ action: z.literal('update'), slug: slugSchema, patch: postPatchSchema }),
]);

const slugifyTitle = (title: string) =>
  title
    .normalize('NFD')
    .replace(/\p{Mn}/gu, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 120);

const extractText = (block: BlogBodyBlock): string => {
  switch (block.type) {
    case 'paragraph':
    case 'heading':
    case 'quote':
      return block.text;
    case 'list':
      return block.items.join(' ');
    case 'code':
      return block.code;
    case 'image':
      return `${block.alt} ${block.caption ?? ''}`;
    default:
      return '';
  }
};

const estimateReadingTime = (blocks: BlogBodyBlock[]) => {
  const text = blocks.map(extractText).join(' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};

const today = () => new Date().toISOString().slice(0, 10);

const summarize = (post: BlogPost) => ({
  slug: post.slug,
  title: post.title,
  excerpt: post.excerpt,
  category: post.category,
  publishedAt: post.publishedAt,
  updatedAt: post.updatedAt,
  readingTimeMinutes: post.readingTimeMinutes,
  coverImage: post.coverImage,
});

const isAuthorized = (req: Request) => {
  const expected = process.env.BLOG_API_TOKEN;
  if (!expected) {
    return false;
  }
  const header = req.headers.get('authorization') ?? '';
  // Anchored single-space separator avoids super-linear backtracking on \s+(.+).
  const match = /^Bearer (\S.*)$/i.exec(header);
  if (!match || !match[1]) {
    return false;
  }
  const provided = match[1].trim();
  const expectedBuf = Buffer.from(expected);
  const providedBuf = Buffer.from(provided);
  if (expectedBuf.length !== providedBuf.length) {
    return false;
  }
  try {
    return crypto.timingSafeEqual(expectedBuf, providedBuf);
  } catch {
    return false;
  }
};

const readPosts = async (): Promise<BlogPost[]> => {
  const raw = await fs.readFile(BLOG_PATH, 'utf8');
  return JSON.parse(raw) as BlogPost[];
};

const writePosts = async (posts: BlogPost[]) => {
  const tmp = `${BLOG_PATH}.tmp`;
  await fs.writeFile(tmp, `${JSON.stringify(posts, null, 2)}\n`, 'utf8');
  await fs.rename(tmp, BLOG_PATH);
};

const errorResponse = (status: number, error: string, details?: unknown) =>
  NextResponse.json({ ok: false, error, ...(details === undefined ? {} : { details }) }, { status });

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

  const command = parsed.data;

  let posts: BlogPost[];
  try {
    posts = await readPosts();
  } catch {
    return errorResponse(500, 'storage_read_failed');
  }

  switch (command.action) {
    case 'list': {
      const filtered = posts.filter((post) => {
        if (command.categorySlug) {
          return post.category ? slugifyCategory(post.category) === command.categorySlug : false;
        }
        if (command.category) {
          return post.category === command.category;
        }
        return true;
      });
      const sorted = [...filtered].sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
      );
      const offset = command.offset ?? 0;
      const limit = command.limit ?? sorted.length;
      const items = sorted.slice(offset, offset + limit).map(summarize);
      return NextResponse.json({
        ok: true,
        data: {
          total: filtered.length,
          count: items.length,
          offset,
          limit,
          posts: items,
        },
      });
    }

    case 'read': {
      const post = posts.find(p => p.slug === command.slug);
      if (!post) {
        return errorResponse(404, 'not_found', { slug: command.slug });
      }
      return NextResponse.json({ ok: true, data: { post } });
    }

    case 'create': {
      const input = command.post;
      const slug = input.slug ?? slugifyTitle(input.title);
      if (!slug) {
        return errorResponse(400, 'invalid_slug', { reason: 'title produced empty slug' });
      }
      if (posts.some(p => p.slug === slug)) {
        return errorResponse(409, 'slug_conflict', { slug });
      }
      const newPost: BlogPost = {
        slug,
        title: input.title,
        excerpt: input.excerpt,
        coverImage: input.coverImage,
        coverAlt: input.coverAlt,
        publishedAt: input.publishedAt ?? today(),
        updatedAt: input.updatedAt,
        readingTimeMinutes: input.readingTimeMinutes ?? estimateReadingTime(input.body),
        category: input.category,
        tags: input.tags,
        author: input.author,
        body: input.body,
      };
      const next = [newPost, ...posts];
      try {
        await writePosts(next);
      } catch {
        return errorResponse(500, 'storage_write_failed');
      }
      return NextResponse.json({ ok: true, data: { post: newPost } }, { status: 201 });
    }

    case 'update': {
      const index = posts.findIndex(p => p.slug === command.slug);
      if (index === -1) {
        return errorResponse(404, 'not_found', { slug: command.slug });
      }
      const current = posts[index]!;
      const patch = command.patch;
      const merged: BlogPost = {
        ...current,
        ...patch,
        slug: current.slug,
        updatedAt: today(),
        body: patch.body ?? current.body,
      };
      if (patch.body) {
        merged.readingTimeMinutes = patch.readingTimeMinutes ?? estimateReadingTime(patch.body);
      }
      const next = [...posts];
      next[index] = merged;
      try {
        await writePosts(next);
      } catch {
        return errorResponse(500, 'storage_write_failed');
      }
      return NextResponse.json({ ok: true, data: { post: merged } });
    }
  }
}
