# Correção: `storage_write_failed` no blog (filesystem → Postgres)

## O problema
A API `/api/blog` gravava os posts em `src/data/blog.json` (filesystem). Em runtime
serverless (Vercel/Lambda) o filesystem é **read-only**, então todo `create`/`update`
falhava com **HTTP 500 `storage_write_failed`**. Leitura funcionava porque o JSON vinha
embutido no build. As páginas do blog também liam o JSON **estático** (congelado no build),
então posts novos nem apareceriam.

## O que mudou (já implementado)
A fonte de verdade agora é **Postgres via Drizzle** (a infra que o projeto já tinha em
`src/libs/DB.ts`, com fallback PGlite em dev):

- **Novo:** `src/libs/blogStore.ts` — `getPosts` / `getPostsSafe` / `savePosts`.
- **Schema:** `src/models/Schema.ts` — tabela `blog_store` (uma linha JSONB com o array de posts).
- **API:** `src/app/api/blog/route.ts` — usa o store em vez de `fs`.
- **Páginas + sitemap:** leem do store (`getPostsSafe`) e viraram `dynamic = 'force-dynamic'`.
- **Testes:** `route.test.ts` agora mocka o store (não o `fs`).
- `src/data/blog.json` continua como **seed**: popula a tabela na primeira leitura e serve de
  fallback se o banco cair. (Os 3 posts atuais são preservados.)

Validado aqui: `tsc --noEmit` ✅ e ESLint ✅. (Os testes não rodam neste ambiente Linux por
causa dos binários nativos do `node_modules` compilados no macOS — rode no seu Mac.)

## Passos finais (no seu Mac) — você precisa fazer

1. **Provisione um Postgres** (ex.: Neon free tier ou Vercel Postgres). Copie a connection
   string. Para Neon, use a string com `?sslmode=require`.

2. **Configure `DATABASE_URL`:**
   - Produção: nas variáveis de ambiente do host (Vercel → Project → Settings → Environment Variables).
   - Local (opcional): em `.env.local`. Sem ela, o dev usa PGlite em memória (dados resetam a cada restart — ok para testar).

3. **Gere a migration** (cria a tabela `blog_store`):
   ```bash
   npm run db:generate    # cria migrations/0001_*.sql
   ```
   Faça commit do arquivo gerado. No deploy, `src/libs/DB.ts` aplica as migrations
   automaticamente (`migratePg`). Alternativa manual: `npm run db:migrate`.

4. **Rode os checks** no Mac:
   ```bash
   npm run check-types   # já passou aqui
   npm run test          # roda os testes da rota (atualizados)
   ```

5. **Deploy.** Na primeira leitura, `blog_store` é semeada com o `blog.json` atual.
   A partir daí o Postgres é a fonte de verdade.

6. **Re-teste o bot:** "Run now" na tarefa agendada (Chrome aberto). O artigo
   *Microsoft Build 2026* que está na fila será publicado e aparecerá em `/blog`.

## Observações
- As páginas do blog agora são renderizadas por request (force-dynamic). Se quiser cache,
  dá para trocar por `revalidate` + `revalidatePath` no futuro.
- **Upload de imagem** (`/api/blog/upload` → `public/blog/uploads/`) ainda grava em filesystem
  e teria o mesmo problema no serverless. Hoje não é usado (capas usam URLs do placehold.co).
  Se um dia for usar upload real, migrar para Blob/S3/R2.
