import { NextResponse } from 'next/server';
import { z } from 'zod';

import { slugifyCategory } from '@/components/blog/categories';
import { getPosts, savePosts } from '@/libs/blogStore';
import { fireNewPostNotification } from '@/libs/email/notifyNewPost';
import type { BlogBodyBlock, BlogPost, BlogStatus } from '@/types/blog';

import { isAuthorized } from './auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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

const statusSchema = z.enum(['draft', 'published']);

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
  status: statusSchema.optional(),
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
    status: statusSchema.optional(),
    includeDrafts: z.boolean().optional(),
    limit: z.number().int().positive().max(100).optional(),
    offset: z.number().int().nonnegative().optional(),
  }),
  z.object({ action: z.literal('read'), slug: slugSchema }),
  z.object({ action: z.literal('create'), post: postCreateSchema }),
  z.object({ action: z.literal('update'), slug: slugSchema, patch: postPatchSchema }),
  z.object({ action: z.literal('publish'), slug: slugSchema }),
  z.object({ action: z.literal('unpublish'), slug: slugSchema }),
  z.object({ action: z.literal('delete'), slug: slugSchema }),
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

// Normalize a stored post's status — legacy posts without the field are
// "published" by grandfather rule. Surface it explicitly in API responses
// so callers don't have to interpret undefined.
const effectiveStatus = (post: BlogPost): BlogStatus =>
  post.status ?? 'published';

const summarize = (post: BlogPost) => ({
  slug: post.slug,
  title: post.title,
  excerpt: post.excerpt,
  category: post.category,
  status: effectiveStatus(post),
  publishedAt: post.publishedAt,
  updatedAt: post.updatedAt,
  readingTimeMinutes: post.readingTimeMinutes,
  coverImage: post.coverImage,
});

// Armazenamento agora é Postgres (ver src/libs/blogStore). Mantemos os mesmos
// nomes readPosts/writePosts para não tocar no resto do handler.
const readPosts = getPosts;
const writePosts = savePosts;

const errorResponse = (status: number, error: string, details?: unknown) =>
  NextResponse.json({ ok: false, error, ...(details === undefined ? {} : { details }) }, { status });

const setStatusAndPersist = async (
  posts: BlogPost[],
  slug: string,
  nextStatus: BlogStatus,
) => {
  const index = posts.findIndex(p => p.slug === slug);
  if (index === -1) {
    return { ok: false as const, error: 'not_found' as const };
  }
  const current = posts[index]!;
  if (effectiveStatus(current) === nextStatus) {
    // Idempotent — no write, return current post.
    return { ok: true as const, post: current, changed: false };
  }
  const merged: BlogPost = {
    ...current,
    status: nextStatus,
    updatedAt: today(),
  };
  const next = [...posts];
  next[index] = merged;
  try {
    await writePosts(next);
  } catch {
    return { ok: false as const, error: 'storage_write_failed' as const };
  }
  return { ok: true as const, post: merged, changed: true };
};

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
      const wantsDrafts = command.includeDrafts === true || command.status === 'draft';
      const filtered = posts.filter((post) => {
        // Status filter: by default, only published. Caller can request drafts
        // explicitly with includeDrafts=true (returns both) or status='draft'
        // (returns only drafts).
        if (command.status) {
          if (effectiveStatus(post) !== command.status) {
            return false;
          }
        } else if (!wantsDrafts && effectiveStatus(post) === 'draft') {
          return false;
        }
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
      return NextResponse.json({
        ok: true,
        data: { post: { ...post, status: effectiveStatus(post) } },
      });
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
      // Backward-compatible default: status omitted means 'published'. The
      // agent opts into drafts explicitly by sending status: 'draft'.
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
        status: input.status ?? 'published',
        body: input.body,
      };
      const next = [newPost, ...posts];
      try {
        await writePosts(next);
      } catch {
        return errorResponse(500, 'storage_write_failed');
      }
      // Notify confirmed subscribers when a post is born as published.
      // Drafts never trigger this — the agent gets a chance to review first.
      fireNewPostNotification(newPost);
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
        // Preserve current status unless patch explicitly sets it.
        status: patch.status ?? effectiveStatus(current),
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
      // Fire-on-transition: notify only when the patch actually moves the
      // post from draft → published (a status-less patch or a published →
      // published edit is intentionally silent so updates don't spam).
      const wasDraft = effectiveStatus(current) === 'draft';
      const isNowPublished = effectiveStatus(merged) === 'published';
      if (wasDraft && isNowPublished) {
        fireNewPostNotification(merged);
      }
      return NextResponse.json({ ok: true, data: { post: merged } });
    }

    case 'publish':
    case 'unpublish': {
      const target: BlogStatus = command.action === 'publish' ? 'published' : 'draft';
      const result = await setStatusAndPersist(posts, command.slug, target);
      if (!result.ok) {
        if (result.error === 'not_found') {
          return errorResponse(404, 'not_found', { slug: command.slug });
        }
        return errorResponse(500, result.error);
      }
      // Only notify on a real transition draft → published; an idempotent
      // re-publish (changed=false) is silent.
      if (command.action === 'publish' && result.changed) {
        fireNewPostNotification(result.post);
      }
      return NextResponse.json({
        ok: true,
        data: { post: result.post, changed: result.changed },
      });
    }

    case 'delete': {
      const index = posts.findIndex(p => p.slug === command.slug);
      if (index === -1) {
        return errorResponse(404, 'not_found', { slug: command.slug });
      }
      const removed = posts[index]!;
      const next = posts.filter((_, i) => i !== index);
      try {
        await writePosts(next);
      } catch {
        return errorResponse(500, 'storage_write_failed');
      }
      return NextResponse.json({
        ok: true,
        data: { slug: removed.slug, deleted: true },
      });
    }
  }
}
