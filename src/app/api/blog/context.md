# Agility Blog API — agent reference

Two authenticated HTTP endpoints that let AI agents manage blog articles published on `agilitycreative.com/blog`:

| Endpoint | Purpose |
|----------|---------|
| `POST /api/blog`        | CRUD on posts — `list`, `read`, `create`, `update`, `publish`, `unpublish`, `delete` |
| `POST /api/blog/upload` | Upload an image and get back a public URL you can drop into `coverImage` or body `image` blocks |

- **Content-Type**: `application/json`
- **Auth (both routes)**: `Authorization: Bearer <BLOG_API_TOKEN>` (32-char MD5 hex)
- **Runtime**: Node.js
- **Storage**:
  - Posts: **Postgres via Drizzle** (`src/libs/blogStore.ts`, one JSONB row in `blog_store`). Seeded from `src/data/blog.json` on the first read; that JSON also serves as a graceful fallback if the DB is unreachable.
  - Images: `public/blog/uploads/<sha256-16>.<ext>` — content-addressed, served from `/blog/uploads/`. Idempotent: uploading the same bytes twice yields the same URL and short-circuits the write. ⚠️ Still filesystem-backed — won't persist on serverless. Migrate to Blob/S3/R2 before relying on uploads in prod.

---

## 1. Authentication

Every request must include:

```
Authorization: Bearer <token>
```

Where `<token>` matches the `BLOG_API_TOKEN` environment variable on the server (32-char MD5 hex, e.g. `82b5ddb63bdd02041caaf642fac11d01`).

Comparison is constant-time. Anything else returns:

```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{ "ok": false, "error": "unauthorized" }
```

### Rotating the token

1. Generate a fresh MD5:
   ```bash
   node -e "console.log(require('crypto').createHash('md5').update(require('crypto').randomBytes(32)).digest('hex'))"
   ```
2. Replace `BLOG_API_TOKEN` in `.env.local` (dev) or your hosting env (prod).
3. Restart the server. Distribute the new token to every agent.

---

## 2. Common response envelope

```ts
type Ok<T> = { ok: true; data: T };
type Err = { ok: false; error: string; details?: unknown };
```

| HTTP | When it happens |
|------|-----------------|
| 200  | `list`, `read`, `update`, `publish`, `unpublish`, `delete`, image already exists |
| 201  | `create` and new image upload |
| 400  | `invalid_json` (body wasn't JSON), `invalid_request` (zod validation — see `details.fieldErrors`), `invalid_slug`, `invalid_base64` |
| 401  | Missing/wrong bearer token |
| 404  | `not_found` (read/update/publish/unpublish/delete with unknown slug) |
| 409  | `slug_conflict` on create |
| 413  | `payload_too_large` (image > 5 MB after decode) |
| 500  | `storage_read_failed` / `storage_write_failed` |

---

## 3. Draft & publish lifecycle

Every post has a `status` of either `'draft'` or `'published'` (legacy posts without the field are treated as `'published'`).

| Surface                                | Draft visible? |
|----------------------------------------|----------------|
| `/blog` listing page                   | no             |
| `/blog/[slug]` detail page             | no — returns 404 |
| `/blog/category/[slug]` page           | no             |
| Sitemap (`/sitemap.xml`)               | no             |
| `generateStaticParams`                 | no (no pre-render) |
| `POST /api/blog list` default          | no             |
| `POST /api/blog list` with `includeDrafts: true` | yes  |
| `POST /api/blog list` with `status: 'draft'` | only drafts |
| `POST /api/blog read`                  | yes (so the agent can fetch the draft to edit) |

Three ways to flip a post's status:
- `create` accepts `status: 'draft' | 'published'` (defaults to `'published'` — opt-in to drafts).
- `update` accepts `status` in the patch.
- Dedicated `publish` / `unpublish` actions take just `{ action, slug }` — convenient when you don't want to think about the patch shape. They're idempotent (`changed: false` if status already matches).

---

## 4. Actions on `POST /api/blog`

The request body is always `{ "action": "...", ...payload }`. The `action` field discriminates which payload is expected.

### 4.1 `list` — paginate posts

Returns a paginated, newest-first summary list. Bodies are **not** included to keep responses small.

**Request fields**

| Field           | Type                  | Notes |
|-----------------|-----------------------|-------|
| `status`        | `'draft' \| 'published'?` | Filter by status. Omit → only `published`. |
| `includeDrafts` | `boolean?`            | When `true`, returns both drafts and published. Ignored if `status` is set. |
| `categorySlug`  | `string?`             | Filter by category slug (e.g. `inteligencia-artificial`). |
| `category`      | `string?`             | Filter by exact category label (e.g. `"Inteligência Artificial"`). Ignored if `categorySlug` is set. |
| `limit`         | `number?` (1–100)     | Default = all matching posts. |
| `offset`        | `number?` (≥0)        | Default = 0. |

**Response data**

```ts
{
  total: number; // total posts matching the filter (pre-paging)
  count: number; // posts returned in this page
  offset: number;
  limit: number;
  posts: Array<{
    slug: string;
    title: string;
    excerpt: string;
    category?: string;
    status: 'draft' | 'published'; // always present, even on legacy posts
    publishedAt: string; // YYYY-MM-DD
    updatedAt?: string;
    readingTimeMinutes?: number;
    coverImage?: string;
  }>;
}
```

**Examples**

```bash
# Newest 10 published AI posts
curl -s -X POST https://agilitycreative.com/api/blog \
  -H "Authorization: Bearer $BLOG_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"action":"list","categorySlug":"inteligencia-artificial","limit":10}'

# Just my drafts
curl -s -X POST https://agilitycreative.com/api/blog \
  -H "Authorization: Bearer $BLOG_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"action":"list","status":"draft"}'
```

---

### 4.2 `read` — fetch one post (full body)

Returns drafts too. Use this to load a draft into your editor before sending an `update`.

**Request fields**

| Field  | Type     | Notes |
|--------|----------|-------|
| `slug` | `string` | Required. Matches `^[a-z0-9]+(?:-[a-z0-9]+)*$`. |

**Response data**

```ts
{ post: BlogPost; } // full post including `status` and the body block array
```

**Errors**: `404 not_found` if no post matches.

---

### 4.3 `create` — author a new article

**Request fields**

```ts
{
  action: 'create';
  post: BlogPostInput;
}
```

`BlogPostInput`:

| Field                | Type                                        | Required | Notes |
|----------------------|---------------------------------------------|----------|-------|
| `slug`               | `string` `(^[a-z0-9]+(?:-[a-z0-9]+)*$)`     | ❌       | Auto-derived from `title` if omitted. Must be globally unique — 409 otherwise. |
| `title`              | `string` (3–200)                            | ✅       | |
| `excerpt`            | `string` (10–500)                           | ✅       | Used in cards + meta description + OG description. Standalone marketing copy. |
| `coverImage`         | `string` (absolute URL or `/…` path)        | ❌       | 1600×900 recommended. Upload via `POST /api/blog/upload` and paste the returned URL. |
| `coverAlt`           | `string`                                    | ❌       | Image alt — recommended whenever `coverImage` is set. |
| `publishedAt`        | `YYYY-MM-DD` or ISO 8601                    | ❌       | Defaults to today (UTC). |
| `updatedAt`          | `YYYY-MM-DD` or ISO 8601                    | ❌       | |
| `readingTimeMinutes` | `number` (1–120)                            | ❌       | Auto-computed from `body` (~200 wpm) if omitted. |
| `category`           | `string` (1–60)                             | ❌       | Free-form label. Reuse existing labels exactly — slug auto-derived for `/blog/category/<slug>`. |
| `tags`               | `string[]` (max 20, each 1–40 chars)        | ❌       | Plain words — no `#`. |
| `author`             | `{ name, role?, avatar? }`                  | ❌       | `avatar` accepts absolute URL or `/…` path. |
| `status`             | `'draft' \| 'published'`                    | ❌       | **Defaults to `'published'`** for backward compatibility. Send `'draft'` to stage without going live. |
| `body`               | `BlogBodyBlock[]` (min 1)                   | ✅       | See §6. |

**Response**: `201 Created` with the canonical stored post under `data.post`.

**Errors**:
- `400 invalid_request` — zod validation issues, `details.fieldErrors` per field.
- `400 invalid_slug` — title slugified to empty (e.g. emoji-only title).
- `409 slug_conflict` — a post with that slug already exists. Use `update` instead.

---

### 4.4 `update` — edit an existing article

```ts
{
  action: 'update';
  slug: string; // identifies the post; cannot be changed
  patch: Partial<BlogPostInput>;
}
```

Rules:

- `slug` inside `patch` is **rejected** — slugs are URLs and must stay stable for SEO.
- `updatedAt` is **always** overwritten with today's date, even if the caller sends one.
- If `body` is in the patch, `readingTimeMinutes` is recomputed unless explicitly provided.
- `status` in the patch is honored; omitting it preserves the current status (a tag/category edit won't accidentally unpublish a post).

**Response data**: `{ post: BlogPost }` — the merged record.

**Errors**: `404 not_found` if no post matches the slug.

---

### 4.5 `publish` / `unpublish` — toggle status (idempotent)

```ts
type PublishRequest = { action: 'publish'; slug: string };
type UnpublishRequest = { action: 'unpublish'; slug: string };
```

Equivalent to `update` with `patch: { status: 'published' | 'draft' }` but shorter to type and idempotent (already-in-target-state → no write performed).

**Response data**

```ts
type PublishResponse = { post: BlogPost; changed: boolean };
```

`changed: false` means the post was already in the requested state and no write was performed (zero side effects). `updatedAt` is only bumped when `changed: true`.

**Errors**: `404 not_found`.

---

### 4.6 `delete` — remove a post permanently

```ts
type DeleteRequest = { action: 'delete'; slug: string };
```

Physically removes the row from the store. The post disappears from the listing, sitemap, and detail page on the very next request. **There is no undo** — snapshot the table before bulk deletes.

**Response data**

```ts
type DeleteResponse = { slug: string; deleted: true };
```

**Errors**: `404 not_found`.

⚠️ Search engines may still hold the old URL in cache for a while. If a public post had real traffic, consider `unpublish` (returns 404, lets crawlers de-index naturally) before doing a hard `delete`.

---

## 5. `POST /api/blog/upload` — image upload

Upload an image as base64 and get back a public URL you can paste into `coverImage`, an `image` body block, or `author.avatar`.

**Request body**

```ts
{
  data: string; // base64; data-URI prefix optional
  extension: 'png' | 'jpg' | 'jpeg' | 'webp' | 'avif' | 'gif';
}
```

- `data` can be either bare base64 (`iVBORw0KG…`) or a full data URI (`data:image/png;base64,iVBORw0KG…`) — the data-URI prefix is stripped automatically.
- SVG is **intentionally excluded** because it can execute inline scripts when served from the same origin.
- Max size: **5 MB after decode**. Larger uploads → `413 payload_too_large`.

**Response data**

```ts
{
  url: string; // e.g. "/blog/uploads/39cd3061a8674673.png"
  bytes: number; // decoded size
  extension: string;
  contentType: string; // "image/png", etc.
  existing: boolean; // true if the same bytes were already on disk (no write performed)
}
```

- Status is `201` when a new file is written, `200` when content was already present (idempotent).
- The filename is `<sha256-of-bytes>[0..16].<ext>` — same bytes always resolve to the same URL.

**Errors**

| `error`                | HTTP | Meaning |
|------------------------|------|---------|
| `unauthorized`         | 401  | Missing/wrong bearer token. |
| `invalid_json`         | 400  | Request body wasn't JSON. |
| `invalid_request`      | 400  | Zod validation failure (e.g. disallowed extension). |
| `invalid_base64`       | 400  | `data` didn't decode cleanly. |
| `payload_too_large`    | 413  | Decoded image is > 5 MB. |
| `storage_write_failed` | 500  | Couldn't write to `public/blog/uploads/`. |

**Example**

```bash
B64=$(base64 -i my-cover.webp)
curl -s -X POST https://agilitycreative.com/api/blog/upload \
  -H "Authorization: Bearer $BLOG_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"data\":\"$B64\",\"extension\":\"webp\"}"
```

---

## 6. Body block format

`body` is an ordered list of typed blocks. Each block renders to a specific element on `/blog/<slug>`. The renderer lives in `src/components/blog/BlogArticleBody.tsx` — keep that file as the source of truth for visual output.

| `type`      | Required fields                                  | Optional                  | Renders as |
|-------------|--------------------------------------------------|---------------------------|------------|
| `paragraph` | `text: string`                                   | —                         | `<p>` |
| `heading`   | `level: 2 \| 3`, `text: string`                  | —                         | `<h2>` / `<h3>` |
| `list`      | `items: string[]` (min 1)                        | `ordered?: boolean`       | `<ul>` or `<ol>` |
| `quote`     | `text: string`                                   | `cite?: string`           | Stylized `<blockquote>` |
| `image`     | `src: string` (URL or `/…`), `alt: string`       | `caption?: string`        | `<figure>` with `<Image>` |
| `code`      | `code: string`                                   | `language?: string`       | Monospaced `<pre><code>` block. Language is metadata only — no syntax highlighting yet. |

Block ordering rules of thumb:

1. Open with one `paragraph` (the lede). The `excerpt` is shown separately above — don't repeat it verbatim.
2. Group content under `heading` level 2; reserve level 3 for sub-sections.
3. Lists work best after a short setup paragraph.

### Minimal example (draft → review → publish)

```bash
# 1. Upload a cover
COVER_URL=$(curl -s -X POST $BASE/upload -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"data\":\"$(base64 -i cover.webp)\",\"extension\":\"webp\"}" | jq -r .data.url)

# 2. Create as DRAFT
curl -s -X POST $BASE -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" -d "$(cat <<JSON
{
  "action": "create",
  "post": {
    "title": "O que mudou com Claude 4.7 para devs",
    "excerpt": "Resumo prático: contexto de 1M, melhor uso de ferramentas...",
    "category": "Inteligência Artificial",
    "coverImage": "$COVER_URL",
    "coverAlt": "Logo do Claude",
    "status": "draft",
    "body": [
      { "type": "paragraph", "text": "A nova geração trouxe contexto de 1 milhão de tokens..." },
      { "type": "heading", "level": 2, "text": "Contexto longo" }
    ]
  }
}
JSON
)"

# 3. Review the draft via the API (or stage it however you want)
curl -s -X POST $BASE -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"action":"read","slug":"o-que-mudou-com-claude-4-7-para-devs"}'

# 4. Ship it
curl -s -X POST $BASE -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"action":"publish","slug":"o-que-mudou-com-claude-4-7-para-devs"}'
```

---

## 7. Categories & SEO knock-on effects

- **`category` becomes a tab on `/blog`** and an SEO page at `/blog/category/<slug>`. The first time a new label appears (e.g. `"Inteligência Artificial"`), it instantly spawns `/blog/category/inteligencia-artificial`, gets listed in the sitemap on the next request, and shows up in the navbar tabs.
- Categories are derived from **published posts only** — a draft sitting in a brand-new category does not surface the tab until you publish.
- Reuse **existing labels verbatim** to avoid creating near-duplicate categories. List the current labels with `list` (the response's `posts[].category` field).
- **Slug stability is sacred**: once a post exists, its URL is `/blog/<slug>` (often indexed). The API refuses to change `slug` on update for that reason. If you genuinely need to rename, ask a human — they'll add an HTTP redirect.
- **Locale alternates** (`hreflang`) are emitted automatically for every post — the same record serves both `/blog/<slug>` and `/en/blog/<slug>`. Write the post in the language that matches your audience; the platform doesn't translate.

---

## 8. Error reference

| `error` value            | HTTP | Meaning |
|--------------------------|------|---------|
| `unauthorized`           | 401  | Missing or wrong bearer token. |
| `invalid_json`           | 400  | Request body wasn't valid JSON. |
| `invalid_request`        | 400  | Zod validation failed. Inspect `details.fieldErrors` for per-field issues. |
| `invalid_slug`           | 400  | Auto-generated slug came out empty. Provide an explicit `slug`. |
| `invalid_base64`         | 400  | (upload) `data` didn't decode cleanly. |
| `not_found`              | 404  | No post matches the requested slug. `details.slug` echoes the input. |
| `slug_conflict`          | 409  | Tried to create a post whose slug already exists. Switch to `update`. |
| `payload_too_large`      | 413  | (upload) Decoded image is > 5 MB. |
| `storage_read_failed`    | 500  | Couldn't read `blog.json`. Check file permissions / disk. |
| `storage_write_failed`   | 500  | Couldn't write to disk. Same. |

---

## 9. Worked end-to-end example (Node)

```js
const TOKEN = process.env.BLOG_API_TOKEN;
const BASE = 'https://agilitycreative.com/api/blog';

const call = async (path, payload) => {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!json.ok) {
    throw new Error(`${res.status} ${json.error}: ${JSON.stringify(json.details ?? {})}`);
  }
  return json.data;
};

// 1. Upload a cover image
const fs = await import('node:fs/promises');
const file = await fs.readFile('./cover.webp');
const { url: coverUrl } = await call('/upload', {
  data: file.toString('base64'),
  extension: 'webp',
});

// 2. Create as a draft
const { post } = await call('', {
  action: 'create',
  post: {
    title: 'Tutorial: rodando Claude na sua CLI em 5 minutos',
    excerpt: 'Passo-a-passo curto para começar a usar a Claude API no terminal.',
    category: 'Inteligência Artificial',
    coverImage: coverUrl,
    coverAlt: 'Terminal com a Claude CLI',
    status: 'draft',
    tags: ['ia', 'cli', 'tutorial'],
    body: [
      { type: 'paragraph', text: '...' },
      { type: 'heading', level: 2, text: 'Instalar a CLI' },
      { type: 'code', language: 'bash', code: 'npm i -g @anthropic-ai/sdk' },
    ],
  },
});

// 3. Read it back, decide it's good, publish.
await call('', { action: 'read', slug: post.slug });
await call('', { action: 'publish', slug: post.slug });

// 4. Later, take it down if needed.
await call('', { action: 'unpublish', slug: post.slug });

// 5. Or remove entirely.
await call('', { action: 'delete', slug: post.slug });
```

---

## 10. Operational caveats

- **Filesystem backing**: post edits land in `src/data/blog.json` and uploads land in `public/blog/uploads/` in the running server's working directory. On Vercel / AWS Lambda / Cloudflare Workers this won't persist across deploys or invocations. Plan to swap `readPosts` / `writePosts` and the upload writer for a real datastore (Postgres + Blob/R2/S3) before scaling.
- **No revision history**: updates overwrite in place. If you need rollback, snapshot `blog.json` before bulk operations.
- **`delete` is destructive and immediate**. There's no recycle bin and no soft-delete tombstone. Prefer `unpublish` for posts that have been live.
- **No scheduling**: setting `publishedAt` to a future date does not delay publishing — the post is live the moment `status` is `'published'`. Use `status: 'draft'` to stage and `publish` later (a cron call from your agent works fine).
- **Single-writer**: each write rewrites the whole file. Concurrent writes from two agents will race and the last writer wins (other changes lost). Serialize agent calls if you batch.
- **Upload idempotency**: identical bytes → identical URL, no rewrite. You can safely retry uploads without orphaning files.

---

## 11. Quick local test

```bash
# in repo root
TOKEN=$(grep BLOG_API_TOKEN .env.local | cut -d= -f2)

# Sanity check: list published posts.
curl -s -X POST http://localhost:3000/api/blog \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"action":"list","limit":1}' | jq .

# Upload a 1x1 PNG.
curl -s -X POST http://localhost:3000/api/blog/upload \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"data":"iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPj/HwAEOgF/qPCJxQAAAABJRU5ErkJggg==","extension":"png"}' | jq .
```

Expected: `{ "ok": true, "data": { ... } }` from both.
