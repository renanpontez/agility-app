import { fileURLToPath } from 'node:url';

import withBundleAnalyzer from '@next/bundle-analyzer';
import { withSentryConfig } from '@sentry/nextjs';
import createJiti from 'jiti';
import withNextIntl from 'next-intl/plugin';

const jiti = createJiti(fileURLToPath(import.meta.url));

jiti('./src/libs/Env');

const withNextIntlConfig = withNextIntl('./src/libs/i18n.ts');

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

// Content-Security-Policy. Allowlist-based (not nonce-based — disproportionate
// here given Clerk + next-intl hydration + tsparticles inline styles). Origins
// are derived from the code: Umami analytics (cloud.umami.is), Clerk auth, the
// Cloudflare Turnstile frame Clerk uses, the FIPE lookup the car app fetches,
// and the Unsplash/placehold image CDNs. Sentry is same-origin via the
// /monitoring tunnel, so no *.sentry.io origin is needed.
//
// SHIPPED IN REPORT-ONLY FIRST: violations are collected at /api/csp-report;
// once they're clean (check Clerk sign-in, tsparticles, and three.js pages),
// flip the header name below to 'Content-Security-Policy' to enforce. Add
// 'unsafe-eval' or the Clerk production origin only if reports show they're needed.
const contentSecurityPolicy = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline' https://cloud.umami.is https://challenges.cloudflare.com https://*.clerk.accounts.dev https://*.clerk.com`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: blob: https://images.unsplash.com https://placehold.co https://img.clerk.com https://cloud.umami.is`,
  `font-src 'self' data:`,
  `connect-src 'self' https://cloud.umami.is https://busca-fipe.onrender.com https://*.clerk.accounts.dev https://*.clerk.com`,
  `frame-src 'self' https://challenges.cloudflare.com https://*.clerk.accounts.dev https://*.clerk.com`,
  `worker-src 'self' blob:`,
  `frame-ancestors 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `object-src 'none'`,
  `upgrade-insecure-requests`,
  `report-uri /api/csp-report`,
].join('; ');

const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
  { key: 'Content-Security-Policy-Report-Only', value: contentSecurityPolicy },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  serverExternalPackages: ['@electric-sql/pglite'],
  turbopack: {
    // Disambiguate the workspace root for Next 16 turbopack when a stray
    // package-lock.json exists in a parent directory.
    root: fileURLToPath(new URL('.', import.meta.url)),
  },
  // Route /sitemap.xml through our custom route handler so we can inject the
  // <?xml-stylesheet ?> directive Next.js's MetadataRoute.Sitemap convention
  // doesn't allow. Crawlers see canonical XML; humans get the styled view via
  // public/sitemap.xsl. `beforeFiles` runs before Next.js's special-file
  // detection so we sidestep any collision with the metadata convention.
  async headers() {
    return [
      {
        // Apply the security headers to every route.
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        // /sitemap.xml → custom route (lets us inject the XSL stylesheet
        // directive; the MetadataRoute.Sitemap convention doesn't support it).
        { source: '/sitemap.xml', destination: '/sitemap-feed' },
        // /feed.xml + /rss.xml → the RSS route. Same rewrite reason as above
        // and gives subscribers two URLs that work (some readers default to
        // /rss.xml, others to /feed.xml).
        { source: '/feed.xml', destination: '/feed-rss' },
        { source: '/rss.xml', destination: '/feed-rss' },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
  images: {
    // Allow external image sources
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
      // Unsplash — default blog cover provider when no custom image is uploaded.
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/, // Apply this rule to .svg files
      use: [
        {
          loader: '@svgr/webpack', // Use SVGR loader
          options: {
            icon: true, // Optional: removes width and height from the SVG
          },
        },
      ],
    });

    return config;
  },
};

export default withSentryConfig(
  bundleAnalyzer(
    withNextIntlConfig(nextConfig),
  ),
  {
    org: 'nextjs-boilerplate-org',
    project: 'nextjs-boilerplate',
    silent: !process.env.CI,
    widenClientFileUpload: true,
    tunnelRoute: '/monitoring',
    hideSourceMaps: true,
    telemetry: false,
    webpack: {
      // Sentry v10 moved these out of the top level into webpack.*
      automaticVercelMonitors: true,
      treeshake: { removeDebugLogging: true },
    },
  },
);
