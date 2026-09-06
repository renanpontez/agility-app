import { getBaseUrl } from '@/utils/Helpers';

// Edge-safe security logging. Called from the middleware, so it uses only
// `fetch` — no pino (src/libs/Logger.ts is node-only) and no DB client.

export type SecurityTag = 'probe' | 'auth_fail' | 'rate_limited';

export type SecurityEvent = {
  ts: string; // ISO timestamp
  ip: string;
  country?: string;
  city?: string;
  asn?: string;
  method: string;
  path: string;
  status: number;
  ua?: string;
  referer?: string;
  tag: SecurityTag;
};

// Collapse high-frequency, low-information repeats. A scanner hammering a single
// probe path — or an IP stuck over a rate limit — would otherwise write one row
// (and two HTTP hops) per request, blowing the free-tier Postgres/function
// budget under exactly the flood this file exists to record. We log the first
// hit per (ip, tag, path) and suppress repeats for a short window. Best-effort
// and per-isolate (module-scoped Map, same as the ratelimit cache) — enough to
// blunt the flood without new infra, while still surfacing the offending IP +
// path in the digest. `auth_fail` is exempt: the admin-login limiter already
// caps it, and the digest needs the true count.
const DEDUP_TTL_MS = 10 * 60 * 1000;
const DEDUP_MAX_KEYS = 5000;
const recentlyLogged = new Map<string, number>();

const shouldLog = (event: SecurityEvent): boolean => {
  if (event.tag === 'auth_fail') {
    return true;
  }
  const key = `${event.ip}:${event.tag}:${event.path}`;
  const now = Date.now();
  const seenAt = recentlyLogged.get(key);
  if (seenAt !== undefined && now - seenAt < DEDUP_TTL_MS) {
    return false;
  }
  // Crude bound so a high-cardinality flood can't grow the Map without limit;
  // clearing wholesale is fine for a best-effort dedup (it just re-logs once).
  if (recentlyLogged.size >= DEDUP_MAX_KEYS) {
    recentlyLogged.clear();
  }
  recentlyLogged.set(key, now);
  return true;
};

/**
 * Record a security event. Fire-and-forget: the caller wraps this in
 * `event.waitUntil(...)` so it never blocks the response, and it never throws.
 *
 * Two sinks, both best-effort:
 *  (a) BetterStack HTTP ingest — searchable live tail.
 *  (b) the internal node route — a durable Postgres row for the weekly digest.
 * Only "interesting" events reach this function (normal page views are never
 * logged), and repeats are deduped (see `shouldLog`), so both sinks fire once
 * per distinct event.
 */
export const logSecurityEvent = async (event: SecurityEvent): Promise<void> => {
  if (!shouldLog(event)) {
    return;
  }

  const jobs: Promise<unknown>[] = [];

  const logtailToken = process.env.LOGTAIL_SOURCE_TOKEN;
  const logtailUrl = process.env.LOGTAIL_INGEST_URL;
  if (logtailToken && logtailUrl) {
    jobs.push(
      fetch(logtailUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${logtailToken}`,
        },
        body: JSON.stringify({ dt: event.ts, level: 'warn', ...event }),
      }).catch(() => {}),
    );
  }

  const ingestToken = process.env.SECURITY_INGEST_TOKEN;
  if (ingestToken) {
    jobs.push(
      fetch(`${getBaseUrl()}/api/internal/security-event`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Ingest-Token': ingestToken,
        },
        body: JSON.stringify(event),
      }).catch(() => {}),
    );
  }

  await Promise.allSettled(jobs);
};
