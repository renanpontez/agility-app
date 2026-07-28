import { and, count, desc, eq, gte, lt, sql } from 'drizzle-orm';

import { db } from '@/libs/DB';
import { securityEventsSchema as events } from '@/models/Schema';

const DAY_MS = 24 * 60 * 60 * 1000;
const WINDOW_DAYS = 7;
const TOP_N = 10;
export const RETENTION_DAYS = 60;

export type DigestCount = { label: string; count: number };

export type SecurityDigest = {
  since: string;
  until: string;
  total: number;
  priorTotal: number;
  byTag: DigestCount[];
  topIps: DigestCount[];
  topCountries: DigestCount[];
  topProbePaths: DigestCount[];
  authFailByDay: DigestCount[];
};

type Row = { label: string | null; c: number | string };

const toCounts = (rows: Row[]): DigestCount[] =>
  rows.map(row => ({ label: row.label ?? 'unknown', count: Number(row.c) }));

/**
 * Aggregate the last 7 days of `security_events` into a digest. Postgres is the
 * source of truth (independent of BetterStack retention). Uses a single pg
 * connection, so queries run sequentially — fine for a weekly cron.
 *
 * `now` is injectable for tests (Date.now() by default).
 */
export const buildWeeklyDigest = async (now: number = Date.now()): Promise<SecurityDigest> => {
  const since = new Date(now - WINDOW_DAYS * DAY_MS);
  const priorStart = new Date(now - 2 * WINDOW_DAYS * DAY_MS);
  const day = sql<string>`to_char(${events.ts}, 'YYYY-MM-DD')`;

  const totalRows = await db.select({ c: count() }).from(events).where(gte(events.ts, since));
  const priorRows = await db.select({ c: count() }).from(events).where(and(gte(events.ts, priorStart), lt(events.ts, since)));
  const byTagRows = await db.select({ label: events.tag, c: count() }).from(events).where(gte(events.ts, since)).groupBy(events.tag).orderBy(desc(count()));
  const ipRows = await db.select({ label: events.ip, c: count() }).from(events).where(gte(events.ts, since)).groupBy(events.ip).orderBy(desc(count())).limit(TOP_N);
  const countryRows = await db.select({ label: events.country, c: count() }).from(events).where(gte(events.ts, since)).groupBy(events.country).orderBy(desc(count())).limit(TOP_N);
  const probeRows = await db.select({ label: events.path, c: count() }).from(events).where(and(gte(events.ts, since), eq(events.tag, 'probe'))).groupBy(events.path).orderBy(desc(count())).limit(TOP_N);
  const authFailRows = await db.select({ label: day, c: count() }).from(events).where(and(gte(events.ts, since), eq(events.tag, 'auth_fail'))).groupBy(day).orderBy(day);

  return {
    since: since.toISOString(),
    until: new Date(now).toISOString(),
    total: Number(totalRows[0]?.c ?? 0),
    priorTotal: Number(priorRows[0]?.c ?? 0),
    byTag: toCounts(byTagRows),
    topIps: toCounts(ipRows),
    topCountries: toCounts(countryRows),
    topProbePaths: toCounts(probeRows),
    authFailByDay: toCounts(authFailRows),
  };
};

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const summarize = (rows: DigestCount[], empty = 'none'): string =>
  rows.length ? rows.map(row => `${row.label}: ${row.count}`).join(', ') : empty;

export const renderDigestEmail = (digest: SecurityDigest): { subject: string; html: string; text: string } => {
  const delta = digest.total - digest.priorTotal;
  const trend = digest.priorTotal === 0 ? '' : ` (${delta >= 0 ? '+' : ''}${delta} vs prior week)`;
  const range = `${digest.since.slice(0, 10)} → ${digest.until.slice(0, 10)}`;
  const subject = `Agility security digest — ${digest.total} events${trend}`;

  const text = [
    `Security digest for ${range}`,
    '',
    `Total interesting events: ${digest.total}${trend}`,
    `By type: ${summarize(digest.byTag)}`,
    '',
    `Top IPs: ${summarize(digest.topIps)}`,
    `Top countries: ${summarize(digest.topCountries)}`,
    `Top probed paths: ${summarize(digest.topProbePaths)}`,
    `Auth failures by day: ${summarize(digest.authFailByDay)}`,
    '',
    'Decide on WAF / geo / IP actions using docs/security-runbook.md.',
  ].join('\n');

  // Paths, IPs and countries come from untrusted requests — escape them so the
  // digest email itself can't become an HTML-injection vector.
  const list = (title: string, rows: DigestCount[]): string =>
    `<h3 style="margin:16px 0 4px;font-size:15px">${title}</h3>${
      rows.length
        ? `<ul style="margin:0;padding-left:18px">${rows
          .map(row => `<li>${escapeHtml(row.label)} — <strong>${row.count}</strong></li>`)
          .join('')}</ul>`
        : '<p style="margin:0;color:#888">none</p>'
    }`;

  const html = `<div style="font-family:system-ui,-apple-system,sans-serif;max-width:640px;color:#111">
    <h2 style="margin:0 0 4px">Agility security digest</h2>
    <p style="margin:0 0 12px;color:#666">${range}</p>
    <p><strong>${digest.total}</strong> interesting events${trend}. By type: ${escapeHtml(summarize(digest.byTag))}.</p>
    ${list('Top IPs', digest.topIps)}
    ${list('Top countries', digest.topCountries)}
    ${list('Top probed paths', digest.topProbePaths)}
    ${list('Auth failures by day', digest.authFailByDay)}
    <p style="margin-top:16px;color:#666">Decide on WAF / geo / IP actions using <code>docs/security-runbook.md</code>.</p>
  </div>`;

  return { subject, html, text };
};
