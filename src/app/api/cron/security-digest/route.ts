import * as Sentry from '@sentry/nextjs';
import { lt } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { EMAIL_CONFIG } from '@/libs/email/config';
import { sendEmail } from '@/libs/email/sender';
import { buildWeeklyDigest, renderDigestEmail, RETENTION_DAYS } from '@/libs/security/digest';
import { securityEventsSchema } from '@/models/Schema';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Weekly security digest. Triggered by Vercel Cron (see vercel.json), which
// sends `Authorization: Bearer $CRON_SECRET`. Aggregates the last 7 days of
// security_events, emails a summary + records it in Sentry, then prunes old rows.

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const digest = await buildWeeklyDigest();
  const { subject, html, text } = renderDigestEmail(digest);

  const recipient = process.env.SECURITY_DIGEST_RECIPIENT || EMAIL_CONFIG.replyTo;
  const sent = await sendEmail({ to: recipient, subject, html, text });
  Sentry.captureMessage('weekly-security-digest', { level: 'info', extra: { digest } });

  // Retention prune — keep the (free-tier) Postgres small.
  const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000);
  await db.delete(securityEventsSchema).where(lt(securityEventsSchema.ts, cutoff));

  return NextResponse.json({ ok: true, total: digest.total, emailed: sent.ok });
}
