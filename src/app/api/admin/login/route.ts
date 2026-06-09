import { NextResponse } from 'next/server';

import { ADMIN_COOKIE_NAME, deriveAdminToken } from '@/libs/adminAuth';

export const runtime = 'nodejs';

const SAFE_NEXT = /^\/admin(?:\/|$)/;

export async function POST(request: Request) {
  const user = process.env.ADMIN_USER;
  const password = process.env.ADMIN_PASSWORD;
  if (!user || !password) {
    return NextResponse.json({ error: 'disabled' }, { status: 503 });
  }

  let body: { user?: string; password?: string; next?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }

  if (body.user !== user || body.password !== password) {
    return NextResponse.json({ error: 'invalid_credentials' }, { status: 401 });
  }

  const token = await deriveAdminToken(password);
  // Open-redirect guard — never honor a `next` outside `/admin/*`.
  const next = body.next && SAFE_NEXT.test(body.next) ? body.next : '/admin/subscribers';

  const res = NextResponse.json({ ok: true, next });
  res.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    // 30 days — long enough to be useful, short enough that a stolen device
    // can't keep the session forever without re-entering the password.
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
