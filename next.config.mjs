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
  async rewrites() {
    return {
      beforeFiles: [
        { source: '/sitemap.xml', destination: '/sitemap-feed' },
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
