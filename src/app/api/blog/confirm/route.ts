import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Legacy shim: confirmation flow moved to /blog/confirm so it can use the
// blog's BlogTemplate shell instead of inline HTML. Older confirmation
// emails point at this URL — redirect to the new page, preserving the token.
// The token query param survives the 308 unchanged.
export function GET(req: Request) {
  const url = new URL(req.url);
  const target = new URL('/blog/confirm', url.origin);
  target.search = url.search;
  return NextResponse.redirect(target, 308);
}
