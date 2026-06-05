import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import type { NextFetchEvent, NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

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

export default function middleware(
  request: NextRequest,
  event: NextFetchEvent,
) {
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
