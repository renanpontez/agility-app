#!/usr/bin/env node
/**
 * Publicador local do Blog Agility.
 *
 * Roda no SEU Mac (via launchd), fora do sandbox do Cowork — por isso tem rede
 * real para chamar a API. Fluxo:
 *   1. Lê todos os artigos prontos em bot/queue/*.json
 *   2. Faz POST na API (action=create) com o token de bot/.secret-token
 *   3. Em sucesso: registra em historico.json (publicados), move o arquivo para
 *      bot/published/ e (se houver webhook) avisa no Slack #agility-creative
 *   4. Em falha: move para bot/failed/ e loga o motivo
 *
 * Uso:
 *   node publish.mjs            # publica de verdade
 *   node publish.mjs --dry-run  # valida tudo SEM chamar a API nem mover arquivos
 *
 * Idempotente: se a fila estiver vazia, não faz nada. Pode rodar a cada X minutos.
 */

import { readFile, writeFile, readdir, mkdir, rename } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DRY = process.argv.includes('--dry-run');
const HERE = path.dirname(fileURLToPath(import.meta.url));      // .../agility-app/bot
const QUEUE = path.join(HERE, 'queue');
const PUBLISHED = path.join(HERE, 'published');
const FAILED = path.join(HERE, 'failed');
const HISTORICO = path.join(HERE, 'historico.json');
const TOKEN_FILE = path.join(HERE, '.secret-token');
const WEBHOOK_FILE = path.join(HERE, '.slack-webhook');        // opcional
const API = 'https://www.agilitycreative.com/api/blog';
const SITE_BASE = 'https://www.agilitycreative.com/blog';

const log = (...a) => console.log(new Date().toISOString(), ...a);

async function readJson(file, fallback) {
  try { return JSON.parse(await readFile(file, 'utf8')); }
  catch (e) { if (fallback !== undefined) return fallback; throw e; }
}

// Monta o payload aceito pela API a partir do arquivo da fila.
// Remove chaves auxiliares (começam com "_") e garante { action: 'create', post }.
function buildPayload(raw) {
  const clean = {};
  for (const [k, v] of Object.entries(raw)) if (!k.startsWith('_')) clean[k] = v;
  if (clean.post) return { action: 'create', post: clean.post };
  if (clean.action === 'create' && clean.post) return clean;
  // arquivo é o próprio "post" cru
  return { action: 'create', post: clean };
}

async function notifySlack(webhook, tema, url) {
  if (!webhook) { log('Slack: sem webhook configurado, pulando aviso.'); return; }
  const text = `📝 Novo artigo publicado no blog:\n*${tema}*\n${url}`;
  if (DRY) { log('[dry-run] Slack ->', text.replace(/\n/g, ' | ')); return; }
  try {
    const r = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    log('Slack:', r.status);
  } catch (e) { log('Slack ERRO:', e.message); }
}

async function main() {
  if (!existsSync(QUEUE)) { log('Sem pasta queue/. Nada a fazer.'); return; }

  const files = (await readdir(QUEUE)).filter(f => f.endsWith('.json')).sort();
  if (files.length === 0) { log('Fila vazia. Nada a publicar.'); return; }

  const token = (await readFile(TOKEN_FILE, 'utf8')).replace(/[\n\r]/g, '').trim();
  if (!token) { log('ERRO: token vazio em .secret-token. Abortando.'); process.exit(1); }
  const webhook = existsSync(WEBHOOK_FILE)
    ? (await readFile(WEBHOOK_FILE, 'utf8')).trim() : null;

  if (!DRY) { await mkdir(PUBLISHED, { recursive: true }); await mkdir(FAILED, { recursive: true }); }

  const historico = await readJson(HISTORICO, { publicados: [], links_lidos: [] });
  if (!Array.isArray(historico.publicados)) historico.publicados = [];

  for (const f of files) {
    const src = path.join(QUEUE, f);
    let payload;
    try { payload = buildPayload(await readJson(src)); }
    catch (e) { log(`PARSE FALHOU ${f}: ${e.message}`); if (!DRY) await rename(src, path.join(FAILED, f)); continue; }

    const tema = payload.post?.title || '(sem título)';
    log(`Processando ${f} -> "${tema}"`);

    if (DRY) {
      log(`  [dry-run] POST ${API} | campos: ${Object.keys(payload.post || {}).join(', ')}`);
      log(`  [dry-run] body blocks: ${Array.isArray(payload.post?.body) ? payload.post.body.length : 'AUSENTE!'}`);
      continue;
    }

    let res, json;
    try {
      res = await fetch(API, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        redirect: 'follow',
      });
      json = await res.json().catch(() => ({}));
    } catch (e) {
      log(`  REDE FALHOU: ${e.message}. Mantendo na fila para retry.`);
      continue; // não move: tenta de novo no próximo ciclo
    }

    if (res.status === 201 && json.ok) {
      const slug = json.data?.post?.slug || payload.post?.slug;
      const url = `${SITE_BASE}/${slug}`;
      historico.publicados.unshift({
        data: new Date().toISOString().slice(0, 10),
        tema, slug, categoria: payload.post?.category || null,
      });
      await writeFile(HISTORICO, JSON.stringify(historico, null, 2) + '\n');
      await rename(src, path.join(PUBLISHED, f));
      log(`  OK 201 -> ${url}`);
      await notifySlack(webhook, tema, url);
    } else if (res.status === 409) {
      log(`  409 slug_conflict (já existe). Movendo para failed/.`);
      await rename(src, path.join(FAILED, f));
    } else {
      log(`  ERRO ${res.status} ${json.error || ''} ${JSON.stringify(json.details || {})}`);
      await rename(src, path.join(FAILED, f));
    }
  }
  log('Concluído.');
}

main().catch(e => { console.error('FATAL', e); process.exit(1); });
