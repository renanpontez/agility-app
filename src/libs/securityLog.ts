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

/**
 * Record a security event. Fire-and-forget: the caller wraps this in
 * `event.waitUntil(...)` so it never blocks the response, and it never throws.
 *
 * Two sinks, both best-effort:
 *  (a) BetterStack HTTP ingest — searchable live tail.
 *  (b) the internal node route — a durable Postgres row for the weekly digest.
 * Only "interesting" events reach this function (normal page views are never
 * logged), so both sinks fire for every call.
 */
export const logSecurityEvent = async (event: SecurityEvent): Promise<void> => {
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
