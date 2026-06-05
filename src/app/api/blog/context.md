# Agility Blog API — agent reference

A single authenticated HTTP endpoint that lets AI agents manage blog articles published on `agilitycreative.com/blog`. Every operation goes through one POST request whose `action` field picks the verb.

- **Endpoint**: `POST /api/blog`
- **Content-Type**: `application/json`
- **Auth**: `Authorization: Bearer <BLOG_API_TOKEN>` (32-char MD5 hex)
- **Runtime**: Node.js (the route writes to the local filesystem — do not deploy to a read-only serverless runtime without swapping the storage layer)
- **Storage**: `src/data/blog.json` — flat JSON array, newest first. Reads and writes are atomic (`write → rename`), but there is **no concurrent-write locking**. Treat the API as single-writer.

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
| 200  | `list`, `read`, `update` success |
| 201  | `create` success |
| 400  | `invalid_json` (body wasn't JSON) or `invalid_request` (zod validation failed — see `details.fieldErrors`) |
| 401  | Missing/wrong bearer token |
| 404  | `not_found` (read/update with unknown slug) |
| 409  | `slug_conflict` on create (a post with the same slug already exists) |
| 500  | `storage_read_failed` / `storage_write_failed` — the JSON file couldn't be read/written |

---

## 3. Actions

The request body is always `{ "action": "...", ...payload }`. The `action` field discriminates which payload is expected.

### 3.1 `list` — paginate posts

Returns a paginated, newest-first summary list. Bodies are **not** included to keep responses small.

**Request fields**

| Field          | Type                  | Notes |
|----------------|-----------------------|-------|
| `categorySlug` | `string?`             | Filter by category slug (e.g. `inteligencia-artificial`). Slugs come from `slugifyCategory(category)`. |
| `category`     | `string?`             | Filter by exact category label (e.g. `"Inteligência Artificial"`). Ignored if `categorySlug` is set. |
| `limit`        | `number?` (1–100)     | Default = all matching posts. |
| `offset`       | `number?` (≥0)        | Default = 0. |

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
    publishedAt: string; // YYYY-MM-DD
    updatedAt?: string;
    readingTimeMinutes?: number;
    coverImage?: string;
  }>;
}
```

**Example**

```bash
curl -s -X POST https://agilitycreative.com/api/blog \
  -H "Authorization: Bearer $BLOG_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"action":"list","categorySlug":"inteligencia-artificial","limit":10}'
```

---

### 3.2 `read` — fetch one post (full body)

**Request fields**

| Field  | Type     | Notes |
|--------|----------|-------|
| `slug` | `string` | Required. Matches the regex `^[a-z0-9]+(?:-[a-z0-9]+)*$`. |

**Response data**

```ts
{ post: BlogPost; } // full post including the body block array
```

**Errors**: `404 not_found` if no post matches.

**Example**

```bash
curl -s -X POST https://agilitycreative.com/api/blog \
  -H "Authorization: Bearer $BLOG_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"action":"read","slug":"mvp-em-30-dias-o-que-cabe-e-o-que-nao-cabe"}'
```

---

### 3.3 `create` — publish a new article

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
| `excerpt`            | `string` (10–500)                           | ✅       | Shown in the card grid + meta description + OG description. Write it as standalone marketing copy. |
| `coverImage`         | `string` (absolute URL or `/…` path)        | ❌       | 1600×900 recommended for the featured-card hero. |
| `coverAlt`           | `string`                                    | ❌       | Image alt — required for accessibility if `coverImage` is set in a real post. |
| `publishedAt`        | `YYYY-MM-DD` or ISO 8601                    | ❌       | Defaults to today (UTC). |
| `updatedAt`          | `YYYY-MM-DD` or ISO 8601                    | ❌       | |
| `readingTimeMinutes` | `number` (1–120)                            | ❌       | Auto-computed from `body` (~200 wpm) if omitted. |
| `category`           | `string` (1–60)                             | ❌       | Free-form label. The slug used in `/blog/category/<slug>` URLs is derived automatically via `slugifyCategory()`. Reuse existing labels exactly to land posts under the same tab. |
| `tags`               | `string[]` (max 20, each 1–40 chars)        | ❌       | Plain words — no `#`. |
| `author`             | `{ name, role?, avatar? }`                  | ❌       | `avatar` can be an absolute URL or `/…` path. |
| `body`               | `BlogBodyBlock[]` (min 1)                   | ✅       | See §4. |

**Response**: `201 Created` with the canonical stored post (slug, defaults, computed reading time) under `data.post`.

**Errors**:
- `400 invalid_request` — zod validation failures, `details.fieldErrors` says what's wrong per field.
- `400 invalid_slug` — title slugified to empty (e.g. emoji-only title).
- `409 slug_conflict` — a post with that slug already exists. Use `update` instead.

---

### 3.4 `update` — edit an existing article

**Request fields**

```ts
{
  action: 'update';
  slug: string; // identifies the post; cannot be changed
  patch: Partial<BlogPostInput>;
}
```

Notes:

- **`slug` inside `patch` is rejected** — slugs are URLs and must stay stable for SEO.
- `updatedAt` is **always** overwritten with today's date, even if the caller sets it.
- If `body` is included in the patch, `readingTimeMinutes` is recomputed unless explicitly provided.
- Fields not present in `patch` are left untouched.

**Response data**: `{ post: BlogPost }` — the merged record.

**Errors**: `404 not_found` if no post matches the slug.

---

## 4. Body block format

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

### Minimal example

```json
{
  "action": "create",
  "post": {
    "title": "O que mudou com Claude 4.7 para devs",
    "excerpt": "Resumo prático: contexto de 1M, melhor uso de ferramentas, e o que isso muda no fluxo de quem programa todo dia.",
    "category": "Inteligência Artificial",
    "coverImage": "https://placehold.co/1600x900/0a0a0a/4F46E5/png?text=Claude+4.7",
    "coverAlt": "Logo do Claude com fundo gradiente",
    "tags": ["ia", "claude", "ferramentas"],
    "author": { "name": "Equipe Agility", "role": "Editorial" },
    "body": [
      { "type": "paragraph", "text": "A nova geração trouxe contexto de 1 milhão de tokens..." },
      { "type": "heading", "level": 2, "text": "Contexto longo" },
      { "type": "paragraph", "text": "Você agora pode despejar um repositório inteiro..." },
      {
        "type": "list",
        "ordered": true,
        "items": [
          "Quando o contexto longo paga",
          "Quando RAG ainda é a resposta certa",
          "O que muda no custo por requisição"
        ]
      }
    ]
  }
}
```

---

## 5. Categories & SEO knock-on effects

Creating or updating a post can have ripple effects you should be aware of:

- **`category` becomes a tab on `/blog`** and an SEO page at `/blog/category/<slug>`. The first time a new label appears (e.g. `"Inteligência Artificial"`), it instantly spawns `/blog/category/inteligencia-artificial`, gets listed in the sitemap on the next request, and shows up in the navbar tabs.
- Reuse **existing labels verbatim** to avoid creating near-duplicate categories. List the current labels with `list` (the response's `posts[].category` field).
- **Slug stability is sacred**: once a post exists, its URL is `/blog/<slug>` (often indexed). The API refuses to change `slug` on update for that reason. If you genuinely need to rename, ask a human — they'll need to add an HTTP redirect.
- **Locale alternates** (`hreflang`) are emitted automatically for every post — the same record serves both `/blog/<slug>` and `/en/blog/<slug>`. Write the post in the language that matches your audience; the platform doesn't translate.

---

## 6. Error reference

| `error` value            | HTTP | Meaning |
|--------------------------|------|---------|
| `unauthorized`           | 401  | Missing or wrong bearer token. |
| `invalid_json`           | 400  | Request body wasn't valid JSON. |
| `invalid_request`        | 400  | Zod validation failed. Inspect `details.fieldErrors` for per-field issues. |
| `invalid_slug`           | 400  | Auto-generated slug came out empty (e.g. title was emoji-only). Provide an explicit `slug`. |
| `not_found`              | 404  | No post matches the requested slug. `details.slug` echoes the input. |
| `slug_conflict`          | 409  | Tried to create a post whose slug already exists. Switch to `update`. |
| `storage_read_failed`    | 500  | Couldn't read `blog.json`. Check file permissions / disk. |
| `storage_write_failed`   | 500  | Couldn't write `blog.json`. Same. |

---

## 7. Worked end-to-end example (Node)

```js
const TOKEN = process.env.BLOG_API_TOKEN;
const BASE = 'https://agilitycreative.com/api/blog';

const call = async (payload) => {
  const res = await fetch(BASE, {
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

// 1. List current AI posts to avoid title overlap
const { posts } = await call({ action: 'list', categorySlug: 'inteligencia-artificial' });

// 2. Publish
const { post } = await call({
  action: 'create',
  post: {
    title: 'Tutorial: rodando Claude na sua CLI em 5 minutos',
    excerpt: 'Passo-a-passo curto para começar a usar a Claude API no terminal, sem framework.',
    category: 'Inteligência Artificial',
    tags: ['ia', 'cli', 'tutorial'],
    body: [
      { type: 'paragraph', text: '...' },
      { type: 'heading', level: 2, text: 'Instalar a CLI' },
      { type: 'code', language: 'bash', code: 'npm i -g @anthropic-ai/sdk' },
    ],
  },
});

// 3. Later: add a follow-up paragraph
await call({
  action: 'update',
  slug: post.slug,
  patch: {
    body: [
      ...post.body,
      { type: 'paragraph', text: 'Atualização (junho/2026): suporte oficial ao modelo Haiku 4.5.' },
    ],
  },
});
```

---

## 8. Operational caveats

- **Filesystem backing**: edits land in `src/data/blog.json` in the running server's working directory. On Vercel / AWS Lambda / Cloudflare Workers this won't persist across deploys or invocations. Plan to swap `readPosts` / `writePosts` for a real datastore (Postgres, Sanity, KV) before scaling.
- **No revision history**: updates overwrite in place. If you need rollback, snapshot `blog.json` before bulk operations.
- **No drafts / scheduling**: the moment `create` returns 201, the post is live at `/blog/<slug>` and listed in the sitemap.
- **No delete**: by design. To pull a post you have to edit `blog.json` by hand and add a 410 (or rewrite) at the server level so search engines de-index.
- **Single-writer**: the route writes the whole file. Concurrent writes from two agents will race and the last writer wins (other changes lost). Serialize agent calls if you batch.

---

## 9. Quick local test

```bash
# in repo root
TOKEN=$(grep BLOG_API_TOKEN .env.local | cut -d= -f2)
curl -s -X POST http://localhost:3000/api/blog \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"action":"list","limit":1}' | jq .
```

Expected: `{ "ok": true, "data": { "total": N, ... } }`.
