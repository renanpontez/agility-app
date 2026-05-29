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
  images: {
    // Allow external image sources
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co', // Replace with the actual domain
        pathname: '/**', // Adjust path as needed, or use '/**' to allow all paths
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io', // Replace with the actual domain
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
