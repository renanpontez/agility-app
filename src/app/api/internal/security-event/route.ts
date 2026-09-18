import { NextResponse } from 'next/server';
import { z } from 'zod';

import { db } from '@/libs/DB';
import { securityEventsSchema } from '@/models/Schema';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Internal server-to-server writer. The edge middleware can't touch Postgres,
// so it POSTs request-log events here. Guarded by a shared secret; the
// middleware bypasses this path so logging never recurses. Unauthorized callers
// get a 404 so the endpoint's existence isn't advertised.

const eventSchema = z.object({
  ts: z.string(),
  ip: z.string().max(45),
  country: z.string().max(2).optional(),
  city: z.string().max(128).optional(),
  asn: z.string().max(32).optional(),
  method: z.string().max(10),
  path: z.string().max(512),
  status: z.number().int(),
  ua: z.string().max(2000).optional(),
  referer: z.string().max(2000).optional(),
  tag: z.enum(['probe', 'auth_fail', 'rate_limited']),
});

export async function POST(request: Request) {
  const secret = process.env.SECURITY_INGEST_TOKEN;
  if (!secret || request.headers.get('x-ingest-token') !== secret) {
    return new NextResponse('Not Found', { status: 404 });
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const parsed = eventSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  try {
    const { ts, ua, referer, ...rest } = parsed.data;
    await db.insert(securityEventsSchema).values({
      ...rest,
      ts: new Date(ts),
      ua: ua ?? null,
      referer: referer ?? null,
    });
  } catch (err) {
    console.error('[security-event] insert failed', err);
    // Best-effort logging: don't turn a logging hiccup into a caller error.
    return NextResponse.json({ ok: false }, { status: 200 });
  }
  return NextResponse.json({ ok: true });
}
