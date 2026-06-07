import crypto from 'node:crypto';

import { and, eq } from 'drizzle-orm';

import { db } from '@/libs/DB';
import type { BlogSubscriber } from '@/models/Schema';
import { blogSubscribersSchema } from '@/models/Schema';

export type SubscriberStatus = 'pending' | 'confirmed' | 'unsubscribed';

const TOKEN_BYTES = 32;

const newToken = () => crypto.randomBytes(TOKEN_BYTES).toString('hex');

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export type SubscribeResult
  = | { kind: 'created'; subscriber: BlogSubscriber }
    | { kind: 'resent'; subscriber: BlogSubscriber }
    | { kind: 'already_confirmed'; subscriber: BlogSubscriber };

/**
 * Add a new subscriber or rotate the confirm-token for an existing pending one.
 * - new address → `created` (status 'pending', new tokens)
 * - already pending → `resent` (fresh confirm token so the link in the previous
 *   email stops working — prevents stale-link confusion)
 * - already confirmed → `already_confirmed` (don't change anything; the caller
 *   should respond with a friendly "you're already in" message)
 * - previously unsubscribed → resurrected as pending (counts as a fresh consent)
 */
export const subscribe = async (
  emailInput: string,
  options: { locale?: string; source?: string } = {},
): Promise<SubscribeResult> => {
  const email = normalizeEmail(emailInput);
  const existing = await db
    .select()
    .from(blogSubscribersSchema)
    .where(eq(blogSubscribersSchema.email, email))
    .limit(1);

  const current = existing[0];

  if (current && current.status === 'confirmed') {
    return { kind: 'already_confirmed', subscriber: current };
  }

  const confirmToken = newToken();
  const unsubscribeToken = current?.unsubscribeToken ?? newToken();
  const locale = options.locale ?? 'pt-BR';
  const source = options.source;

  if (!current) {
    const inserted = await db
      .insert(blogSubscribersSchema)
      .values({
        email,
        status: 'pending',
        confirmToken,
        unsubscribeToken,
        locale,
        source,
      })
      .returning();
    return { kind: 'created', subscriber: inserted[0]! };
  }

  // Pending or previously unsubscribed → bring back to pending with a fresh
  // confirm token. Unsubscribed reactivation counts as a new consent (LGPD).
  const updated = await db
    .update(blogSubscribersSchema)
    .set({
      status: 'pending',
      confirmToken,
      locale,
      source,
      unsubscribedAt: null,
      confirmedAt: null,
    })
    .where(eq(blogSubscribersSchema.id, current.id))
    .returning();
  return { kind: 'resent', subscriber: updated[0]! };
};

export type ConfirmResult
  = | { ok: true; subscriber: BlogSubscriber; alreadyConfirmed: boolean }
    | { ok: false; reason: 'invalid_token' };

export const confirmByToken = async (token: string): Promise<ConfirmResult> => {
  if (!token || token.length !== TOKEN_BYTES * 2) {
    return { ok: false, reason: 'invalid_token' };
  }
  const rows = await db
    .select()
    .from(blogSubscribersSchema)
    .where(eq(blogSubscribersSchema.confirmToken, token))
    .limit(1);
  const subscriber = rows[0];
  if (!subscriber) {
    return { ok: false, reason: 'invalid_token' };
  }
  if (subscriber.status === 'confirmed') {
    return { ok: true, subscriber, alreadyConfirmed: true };
  }
  const updated = await db
    .update(blogSubscribersSchema)
    .set({ status: 'confirmed', confirmedAt: new Date() })
    .where(eq(blogSubscribersSchema.id, subscriber.id))
    .returning();
  return { ok: true, subscriber: updated[0]!, alreadyConfirmed: false };
};

export type UnsubscribeResult
  = | { ok: true; subscriber: BlogSubscriber; alreadyUnsubscribed: boolean }
    | { ok: false; reason: 'invalid_token' };

export const unsubscribeByToken = async (token: string): Promise<UnsubscribeResult> => {
  if (!token || token.length !== TOKEN_BYTES * 2) {
    return { ok: false, reason: 'invalid_token' };
  }
  const rows = await db
    .select()
    .from(blogSubscribersSchema)
    .where(eq(blogSubscribersSchema.unsubscribeToken, token))
    .limit(1);
  const subscriber = rows[0];
  if (!subscriber) {
    return { ok: false, reason: 'invalid_token' };
  }
  if (subscriber.status === 'unsubscribed') {
    return { ok: true, subscriber, alreadyUnsubscribed: true };
  }
  const updated = await db
    .update(blogSubscribersSchema)
    .set({ status: 'unsubscribed', unsubscribedAt: new Date() })
    .where(eq(blogSubscribersSchema.id, subscriber.id))
    .returning();
  return { ok: true, subscriber: updated[0]!, alreadyUnsubscribed: false };
};

/**
 * Confirmed subscribers — the audience for new-post notifications. Returns
 * `{ email, unsubscribeToken }` only since that's all the fan-out needs.
 */
export const listConfirmedSubscribers = async (): Promise<
  Pick<BlogSubscriber, 'email' | 'unsubscribeToken'>[]
> => {
  return db
    .select({
      email: blogSubscribersSchema.email,
      unsubscribeToken: blogSubscribersSchema.unsubscribeToken,
    })
    .from(blogSubscribersSchema)
    .where(
      and(
        eq(blogSubscribersSchema.status, 'confirmed'),
      ),
    );
};
