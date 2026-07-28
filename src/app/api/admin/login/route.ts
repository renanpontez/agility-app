import { NextResponse } from 'next/server';

import {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_TTL_SECONDS,
  constantTimeEquals,
  createAdminSession,
} from '@/libs/adminAuth';

export const runtime = 'nodejs';

const SAFE_NEXT = /^\/admin(?:\/|$)/;

// Hash to a fixed-length (64-char hex) digest before comparing so the
// constant-time compare runs over equal-length inputs regardless of the guess.
const sha256Hex = async (value: string): Promise<string> => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
};

export async function POST(request: Request) {
  const user = process.env.ADMIN_USER;
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;
  // Admin is disabled unless all three are configured (the session secret signs
  // the cookie — without it we can't mint a valid session).
  if (!user || !password || !secret) {
    return NextResponse.json({ error: 'disabled' }, { status: 503 });
  }

  let body: { user?: string; password?: string; next?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }

  // Compute both comparisons unconditionally (no early-out on the username) so
  // response timing can't reveal whether just the username was correct.
  const [providedUser, providedPassword, expectedUser, expectedPassword] = await Promise.all([
    sha256Hex(body.user ?? ''),
    sha256Hex(body.password ?? ''),
    sha256Hex(user),
    sha256Hex(password),
  ]);
  const userOk = constantTimeEquals(providedUser, expectedUser);
  const passwordOk = constantTimeEquals(providedPassword, expectedPassword);
  if (!(userOk && passwordOk)) {
    return NextResponse.json({ error: 'invalid_credentials' }, { status: 401 });
  }

  const token = await createAdminSession(secret);
  // Open-redirect guard — never honor a `next` outside `/admin/*`.
  const next = body.next && SAFE_NEXT.test(body.next) ? body.next : '/admin/subscribers';

  const res = NextResponse.json({ ok: true, next });
  res.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ADMIN_SESSION_TTL_SECONDS,
  });
  return res;
}
