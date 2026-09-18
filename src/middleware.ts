import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import type { NextFetchEvent, NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { ADMIN_COOKIE_NAME, verifyAdminSession } from '@/libs/adminAuth';
import { clientIp, geo, limiters } from '@/libs/ratelimit';
import type { SecurityEvent, SecurityTag } from '@/libs/securityLog';
import { logSecurityEvent } from '@/libs/securityLog';

import { AppConfig } from './utils/AppConfig';

const intlMiddleware = createMiddleware({
  locales: AppConfig.locales,
  localePrefix: AppConfig.localePrefix,
  defaultLocale: AppConfig.defaultLocale,
  // Default-locale-first: never auto-pick from Accept-Language. Brazilian
  // visitors land in pt-BR even when their browser advertises en-US; English
  // is opt-in via the locale switcher (which sets the NEXT_LOCALE cookie
  // that takes over on subsequent visits — see localePreferredRedirect below).
  localeDetection: false,
});

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/:locale/dashboard(.*)',
]);

// Locale-prefix detection. With `localePrefix: 'as-needed'` only non-default
// locales appear in the URL.
const nonDefaultLocales = AppConfig.locales.filter(
  locale => locale !== AppConfig.defaultLocale,
);

const hasLocalePrefix = (pathname: string) =>
  nonDefaultLocales.some(
    locale => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

// The blog is intentionally pt-BR-only (editorial decision — local audience,
// no translation pipeline). The locale switcher is hidden there and any
// localized URL is canonicalized back to the default-locale path so search
// engines see a single canonical blog tree.
const isBlogPath = (pathname: string) =>
  pathname === '/blog' || pathname.startsWith('/blog/');

const localizedBlogRedirect = (request: NextRequest) => {
  const { pathname, search } = request.nextUrl;
  for (const locale of nonDefaultLocales) {
    const prefix = `/${locale}`;
    if (pathname === `${prefix}/blog` || pathname.startsWith(`${prefix}/blog/`)) {
      const url = request.nextUrl.clone();
      url.pathname = pathname.slice(prefix.length);
      url.search = search;
      return NextResponse.redirect(url, 308);
    }
  }
  return null;
};

// Cookie-based auth for /admin/*. The login page (/admin/login) and its API
// (/api/admin/login, /api/admin/logout) are public; every other /admin path
// requires a valid signed session cookie (see src/libs/adminAuth.ts). Rotating
// ADMIN_SESSION_SECRET invalidates every outstanding session.
const adminAuthGate = async (request: NextRequest): Promise<NextResponse | null> => {
  const { pathname, search } = request.nextUrl;
  const isAdminPage = pathname.startsWith('/admin');
  const isLoginApi = pathname === '/api/admin/login' || pathname === '/api/admin/logout';
  if (!isAdminPage && !isLoginApi) {
    return null;
  }
  if (pathname === '/admin/login' || isLoginApi) {
    return NextResponse.next();
  }
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!process.env.ADMIN_USER || !process.env.ADMIN_PASSWORD || !secret) {
    return new NextResponse(
      'Admin disabled — set ADMIN_USER, ADMIN_PASSWORD and ADMIN_SESSION_SECRET.',
      { status: 503 },
    );
  }
  const cookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (await verifyAdminSession(cookie, secret)) {
    return NextResponse.next();
  }
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = '/admin/login';
  loginUrl.search = `?next=${encodeURIComponent(pathname + search)}`;
  return NextResponse.redirect(loginUrl);
};

// If the visitor previously chose a non-default locale (stored in the
// NEXT_LOCALE cookie by the LocaleSwitcher), promote that choice to a real
// redirect so the rest of the pipeline — and search engines — see the locale.
const localePreferredRedirect = (request: NextRequest) => {
  const { pathname, search } = request.nextUrl;
  if (hasLocalePrefix(pathname)) {
    return null;
  }
  // Blog is locale-locked to pt-BR — never honor a cookie redirect into /en/blog.
  if (isBlogPath(pathname)) {
    return null;
  }
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (
    !cookieLocale
    || cookieLocale === AppConfig.defaultLocale
    || !(AppConfig.locales as readonly string[]).includes(cookieLocale)
  ) {
    return null;
  }
  const url = request.nextUrl.clone();
  url.pathname = `/${cookieLocale}${pathname === '/' ? '' : pathname}`;
  url.search = search;
  return NextResponse.redirect(url);
};

// Build a security event from the request plus a status + tag. Geo/IP come from
// Vercel's edge headers.
const toSecurityEvent = (
  request: NextRequest,
  status: number,
  tag: SecurityTag,
): SecurityEvent => {
  const location = geo(request);
  return {
    ts: new Date().toISOString(),
    ip: clientIp(request),
    country: location.country,
    city: location.city,
    method: request.method,
    path: request.nextUrl.pathname,
    status,
    ua: request.headers.get('user-agent') ?? undefined,
    referer: request.headers.get('referer') ?? undefined,
    tag,
  };
};

// Known vulnerability-scanner paths. Extension-ending probes (/wp-login.php,
// /.env, …) are excluded by the `matcher` below and are covered by a Vercel WAF
// deny rule instead; these are the extensionless paths that still reach here.
const PROBE_PATHS = [
  /^\/wp-admin/i,
  /^\/wp-login/i,
  /^\/wp-content/i,
  /^\/wp-includes/i,
  /^\/xmlrpc/i,
  /^\/phpmyadmin/i,
  /^\/administrator/i,
  /^\/vendor\//i,
  /^\/cgi-bin/i,
  /^\/actuator/i,
  /^\/\.git/i,
  /^\/\.env/i,
  /^\/\.aws/i,
  /^\/\.ssh/i,
];

const probeGate = (request: NextRequest, event: NextFetchEvent): NextResponse | null => {
  if (!PROBE_PATHS.some(pattern => pattern.test(request.nextUrl.pathname))) {
    return null;
  }
  event.waitUntil(logSecurityEvent(toSecurityEvent(request, 404, 'probe')));
  // 404 leaks less than 403 about what's actually here.
  return new NextResponse('Not Found', { status: 404 });
};

// Per-IP (and, for the admin login, global) rate limiting on API + admin
// surfaces. Fails open when Upstash is unconfigured.
const rateLimitGate = async (
  request: NextRequest,
  event: NextFetchEvent,
): Promise<NextResponse | null> => {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith('/api/') && !pathname.startsWith('/admin')) {
    return null;
  }
  const ip = clientIp(request);

  const tiers: Array<{ limiter: ReturnType<typeof limiters.apiGlobal>; key: string }> = [];
  if (pathname === '/api/admin/login') {
    tiers.push({ limiter: limiters.adminLogin(), key: ip });
    tiers.push({ limiter: limiters.adminGlobal(), key: 'global' });
  } else if (pathname === '/api/blog/subscribe') {
    tiers.push({ limiter: limiters.subscribe(), key: ip });
  } else if (pathname === '/api/ig-card') {
    tiers.push({ limiter: limiters.igCard(), key: ip });
  } else {
    tiers.push({ limiter: limiters.apiGlobal(), key: ip });
  }

  const results = await Promise.all(
    tiers.map(tier => (tier.limiter ? tier.limiter.limit(tier.key) : Promise.resolve(null))),
  );
  const blocked = results.find(result => result && !result.success);
  if (!blocked) {
    return null;
  }

  event.waitUntil(logSecurityEvent(toSecurityEvent(request, 429, 'rate_limited')));
  const retryAfter = Math.max(0, Math.ceil((blocked.reset - Date.now()) / 1000));
  return new NextResponse('Too Many Requests', {
    status: 429,
    headers: {
      'Retry-After': String(retryAfter),
      'X-RateLimit-Limit': String(blocked.limit),
      'X-RateLimit-Remaining': String(blocked.remaining),
    },
  });
};

export default async function middleware(
  request: NextRequest,
  event: NextFetchEvent,
) {
  const { pathname } = request.nextUrl;

  // The internal log-writer and CSP report collector must never be logged or
  // rate-limited — logging the internal writer would recurse infinitely.
  if (pathname.startsWith('/api/internal/') || pathname === '/api/csp-report') {
    return NextResponse.next();
  }

  // Fast-block known scanner paths and record the probe.
  const probe = probeGate(request, event);
  if (probe) {
    return probe;
  }

  // App-level rate limiting on API + admin surfaces (before the /api/
  // early-return below, so API routes are actually throttled).
  const limited = await rateLimitGate(request, event);
  if (limited) {
    return limited;
  }

  // Admin pages and their auth API are gated by a session cookie and not
  // localized — handle them before the intl middleware gets a chance to
  // rewrite the URL. Runs first so the /admin/login bypass works even before
  // the /api/ early-return below.
  const adminGate = await adminAuthGate(request);
  if (adminGate) {
    return adminGate;
  }

  // API routes carry their own auth (e.g. /api/blog uses bearer token).
  // Don't let next-intl rewrite them to a localized page path.
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return;
  }

  // /en/blog* (and any other non-default locale prefix on /blog) canonicalizes
  // to /blog* so search engines and users only ever see one blog URL tree.
  const blogCanonical = localizedBlogRedirect(request);
  if (blogCanonical) {
    return blogCanonical;
  }

  // Honor a stored locale preference before any locale-routing logic kicks in.
  const preferred = localePreferredRedirect(request);
  if (preferred) {
    return preferred;
  }

  // Run Clerk middleware only when it's necessary
  if (
    request.nextUrl.pathname.includes('/sign-in')
    || request.nextUrl.pathname.includes('/sign-up')
    || isProtectedRoute(request)
  ) {
    return clerkMiddleware(async (auth, req) => {
      if (isProtectedRoute(req)) {
        const locale
          = req.nextUrl.pathname.match(/(\/.*)\/dashboard/)?.at(1) ?? '';

        const signInUrl = new URL(`${locale}/sign-in`, req.url);

        await auth.protect({
          // `unauthenticatedUrl` is needed to avoid error: "Unable to find `next-intl` locale because the middleware didn't run on this request"
          unauthenticatedUrl: signInUrl.toString(),
        });
      }

      return intlMiddleware(req);
    })(request, event);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next|monitoring).*)', '/', '/(api|trpc)(.*)'], // Also exclude tunnelRoute used in Sentry from the matcher
};
