import { blogArticlePath } from '@/components/blog/blogUrls';
import { EMAIL_CONFIG } from '@/libs/email/config';
import { sendEmail } from '@/libs/email/sender';
import { buildNewPostEmail } from '@/libs/email/templates/new-post';
import { listConfirmedSubscribers } from '@/libs/subscribers';
import type { BlogPost } from '@/types/blog';

const PER_SEND_DELAY_MS = 110; // 9 sends/sec → safely under Resend's 10/sec ceiling.

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// The user-facing unsubscribe page. RFC 8058 one-click POSTs to the API
// route directly (see the List-Unsubscribe-Post header below); only this URL
// is what's rendered when the link is clicked normally.
const buildUnsubscribePageUrl = (token: string) =>
  `${EMAIL_CONFIG.baseUrl}/blog/unsubscribe?token=${encodeURIComponent(token)}`;

// The RFC 8058 one-click endpoint Gmail/Apple Mail POST to from inbox UI.
const buildUnsubscribePostUrl = (token: string) =>
  `${EMAIL_CONFIG.baseUrl}/api/blog/unsubscribe?token=${encodeURIComponent(token)}`;

const buildPostUrl = (post: BlogPost) => `${EMAIL_CONFIG.baseUrl}${blogArticlePath(post)}`;

export type NotifyResult = {
  attempted: number;
  sent: number;
  skipped: number;
  failed: number;
};

/**
 * Fan out a "new post" email to every confirmed subscriber. Called after a
 * successful publish (status going to `published` for the first time).
 *
 * Errors are swallowed per-recipient — we never want a single bad address to
 * block the publish, and `listConfirmedSubscribers` is the source of truth so
 * a transient failure can be retried later without producing duplicates
 * (Phase 3 if we ever need it; for now Resend's own retries are enough).
 */
export const notifyNewPost = async (post: BlogPost): Promise<NotifyResult> => {
  // Drafts shouldn't reach here, but the cheap check makes the function safe
  // for callers that re-run the publish action.
  if (post.status === 'draft') {
    return { attempted: 0, sent: 0, skipped: 0, failed: 0 };
  }

  const subscribers = await listConfirmedSubscribers();
  const result: NotifyResult = {
    attempted: subscribers.length,
    sent: 0,
    skipped: 0,
    failed: 0,
  };

  for (const sub of subscribers) {
    const unsubscribePageUrl = buildUnsubscribePageUrl(sub.unsubscribeToken);
    const unsubscribePostUrl = buildUnsubscribePostUrl(sub.unsubscribeToken);

    const { subject, html, text } = await buildNewPostEmail({
      title: post.title,
      excerpt: post.excerpt,
      category: post.category,
      coverImage: post.coverImage,
      coverAlt: post.coverAlt,
      postUrl: buildPostUrl(post),
      unsubscribeUrl: unsubscribePageUrl,
    });

    const send = await sendEmail({
      to: sub.email,
      subject,
      html,
      text,
      headers: {
        // List-Unsubscribe carries BOTH the human-facing page URL (clicked
        // from the email footer) and the one-click POST endpoint Gmail/Apple
        // Mail invoke from the inbox UI. mailto: is the legacy fallback for
        // ancient clients.
        'List-Unsubscribe': `<${unsubscribePostUrl}>, <${unsubscribePageUrl}>, <mailto:${EMAIL_CONFIG.replyTo}?subject=unsubscribe>`,
        // RFC 8058 — Gmail's "Unsubscribe" button needs this to one-click.
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
    });

    if (send.ok) {
      result.sent += 1;
    } else if (send.skipped) {
      result.skipped += 1;
    } else {
      result.failed += 1;

      console.error('[notifyNewPost] send failed', sub.email, send.error);
    }

    // Polite throttle so we don't trip Resend's rate limiter on bigger lists.

    await sleep(PER_SEND_DELAY_MS);
  }

  return result;
};

/**
 * Trigger the fan-out without awaiting it from the request handler. We rely
 * on Vercel's behavior of running pending work after the response is sent
 * (limited to ~10s on the Hobby plan, ~60s on Pro) — for blog volume that's
 * comfortably more than enough.
 *
 * If the runtime cuts the work short, the worst case is some subscribers
 * miss this post — they still get the next one, and the original publish
 * action succeeded either way.
 */
export const fireNewPostNotification = (post: BlogPost): void => {
  if (post.status !== 'published') {
    return;
  }

  notifyNewPost(post).catch(err => console.error('[notifyNewPost] failed', err));
};
