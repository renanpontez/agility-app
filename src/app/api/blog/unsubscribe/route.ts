import { NextResponse } from 'next/server';

import { unsubscribeByToken } from '@/libs/subscribers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Two-way unsubscribe.
//
// GET → 308 redirect to /blog/unsubscribe (so users get the styled page in
// the BlogTemplate shell, not an inline HTML stub). The token survives the
// redirect untouched.
//
// POST → RFC 8058 one-click. Gmail and Apple Mail call this from inbox UI
// when the user hits the "Unsubscribe" button next to the sender name. We
// honor it immediately and reply with 200; no body or HTML needed.

export function GET(req: Request) {
  const url = new URL(req.url);
  const target = new URL('/blog/unsubscribe', url.origin);
  target.search = url.search;
  return NextResponse.redirect(target, 308);
}

export async function POST(req: Request) {
  const token = new URL(req.url).searchParams.get('token') ?? '';
  const result = await unsubscribeByToken(token);
  if (!result.ok) {
    return new NextResponse('invalid_token', { status: 400 });
  }
  return new NextResponse(null, { status: 200 });
}
