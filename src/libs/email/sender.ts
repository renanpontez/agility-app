import { Resend } from 'resend';

import { EMAIL_CONFIG, formatSender } from './config';

let cachedClient: Resend | null = null;

const getClient = (): Resend | null => {
  if (cachedClient) {
    return cachedClient;
  }
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return null;
  }
  cachedClient = new Resend(apiKey);
  return cachedClient;
};

export type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text: string;
  // Extra headers — used for List-Unsubscribe (Gmail/Apple Mail bonus) and
  // anything else the caller needs.
  headers?: Record<string, string>;
};

export type SendEmailResult
  = | { ok: true; id: string }
    | { ok: false; error: string; skipped?: boolean };

/**
 * Send a transactional email via Resend. Returns a structured result instead
 * of throwing so callers can fan out and decide what to do per-recipient.
 *
 * In environments without `RESEND_API_KEY` (CI, local without an account), the
 * send is **skipped** rather than failing — this lets the rest of the publish
 * flow keep working in dev. The skipped flag surfaces that to logs.
 */
export const sendEmail = async (input: SendEmailInput): Promise<SendEmailResult> => {
  const client = getClient();
  if (!client) {
    return {
      ok: false,
      error: 'resend_not_configured',
      skipped: true,
    };
  }

  try {
    const response = await client.emails.send({
      from: formatSender(),
      to: input.to,
      replyTo: EMAIL_CONFIG.replyTo,
      subject: input.subject,
      html: input.html,
      text: input.text,
      headers: input.headers,
    });
    if (response.error) {
      return { ok: false, error: response.error.message };
    }
    return { ok: true, id: response.data?.id ?? '' };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'unknown_error',
    };
  }
};
