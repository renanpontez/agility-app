import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Collects CSP violation reports while the policy runs in Report-Only mode.
// Browsers POST either the legacy `application/csp-report` shape
// ({ "csp-report": {...} }) or the newer reporting-API array. We size-cap the
// body, forward a compact summary to Sentry, and 204. The middleware bypasses
// this path so it isn't rate-limited. Once the CSP is enforced, this can stay
// (still useful) or be removed with the `report-uri` directive.

const MAX_BODY = 16 * 1024; // reports are tiny; ignore anything oversized

export async function POST(request: Request) {
  let text: string;
  try {
    text = await request.text();
  } catch {
    return new NextResponse(null, { status: 204 });
  }
  if (!text || text.length > MAX_BODY) {
    return new NextResponse(null, { status: 204 });
  }

  try {
    const parsed = JSON.parse(text);
    const report = parsed['csp-report'] ?? parsed;
    const directive = report?.['violated-directive'] ?? report?.effectiveDirective;
    const blocked = report?.['blocked-uri'] ?? report?.blockedURL;
    Sentry.captureMessage('csp-violation', {
      level: 'warning',
      tags: { directive: typeof directive === 'string' ? directive.slice(0, 100) : 'unknown' },
      extra: { blocked, report },
    });
  } catch {
    // Malformed report body — ignore.
  }
  return new NextResponse(null, { status: 204 });
}
