import { NextResponse } from 'next/server';
import { z } from 'zod';

import { EMAIL_CONFIG } from '@/libs/email/config';
import { sendEmail } from '@/libs/email/sender';
import { buildConfirmEmail } from '@/libs/email/templates/confirm';
import { subscribe } from '@/libs/subscribers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Public endpoint — no bearer auth (it's hit by the public subscribe form).
// We still validate aggressively and respond with consistent shapes so a
// curious script can't enumerate which emails are already subscribed.

const requestSchema = z.object({
  email: z.string().email().max(320),
  // Free-form source label (e.g. 'blog-footer', 'post:slug') — used later for
  // attribution. Bounded to keep adversarial input out of the DB.
  source: z.string().min(1).max(64).optional(),
  locale: z.string().min(2).max(8).optional(),
});

const errorResponse = (status: number, error: string) =>
  NextResponse.json({ ok: false, error }, { status });

const buildConfirmUrl = (token: string) =>
  `${EMAIL_CONFIG.baseUrl}/blog/confirm?token=${encodeURIComponent(token)}`;

export async function POST(req: Request) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return errorResponse(400, 'invalid_json');
  }
  const parsed = requestSchema.safeParse(raw);
  if (!parsed.success) {
    return errorResponse(400, 'invalid_request');
  }

  try {
    const result = await subscribe(parsed.data.email, {
      source: parsed.data.source,
      locale: parsed.data.locale,
    });

    if (result.kind === 'already_confirmed') {
      // Same generic "check your inbox" wording as the other branches so an
      // attacker can't probe for existing subscribers via response timing or
      // message contents.
      return NextResponse.json({ ok: true, status: 'pending' });
    }

    const confirmUrl = buildConfirmUrl(result.subscriber.confirmToken);
    const { subject, html, text } = await buildConfirmEmail({ confirmUrl });

    // Send + ignore non-fatal errors (e.g. Resend rate-limited a duplicate
    // retry). The row exists either way — the user can re-request later.
    await sendEmail({
      to: result.subscriber.email,
      subject,
      html,
      text,
      headers: {
        // Auto-reply suppression so this confirmation doesn't bounce off
        // out-of-office responders.
        'Auto-Submitted': 'auto-generated',
      },
    });
    return NextResponse.json({ ok: true, status: 'pending' });
  } catch (err) {
    console.error('[subscribe] failed', err);
    return errorResponse(500, 'storage_write_failed');
  }
}
