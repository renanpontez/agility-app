import { NextResponse } from 'next/server';

import { getAllCategorySlugs } from '@/components/blog/categories';
import portfolioData from '@/data/portfolio.json';
import { getPostsSafe } from '@/libs/blogStore';
import { isPublished } from '@/types/blog';
import type { Project } from '@/types/portfolio';
import { AppConfig } from '@/utils/AppConfig';
import { localizedUrl } from '@/utils/seo';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type ChangeFreq = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

type AlternateMap = Record<string, string>;

type Entry = {
  url: string;
  lastModified: Date;
  changeFrequency: ChangeFreq;
  priority: number;
  alternates: AlternateMap;
};

const STATIC_ROUTES: { path: string; changeFrequency: ChangeFreq; priority: number }[] = [
  { path: '/', changeFrequency: 'weekly', priority: 1 },
  { path: '/sobre-nos', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/portfolio', changeFrequency: 'weekly', priority: 0.9 },
];

const localizedAlternates = (path: string): AlternateMap => {
  const languages: AlternateMap = {};
  for (const locale of AppConfig.locales) {
    languages[locale] = localizedUrl(locale, path);
  }
  languages['x-default'] = localizedUrl(AppConfig.defaultLocale, path);
  return languages;
};

const defaultOnlyAlternates = (path: string): AlternateMap => {
  const url = localizedUrl(AppConfig.defaultLocale, path);
  return {
    [AppConfig.defaultLocale]: url,
    'x-default': url,
  };
};

// XML entities — keep tight (we only emit URLs and ISO dates, so the surface
// is small but we still escape defensively).
const xmlEscape = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const renderEntry = (entry: Entry): string => {
  const alternates = Object.entries(entry.alternates)
    .map(
      ([hreflang, href]) =>
        `    <xhtml:link rel="alternate" hreflang="${xmlEscape(hreflang)}" href="${xmlEscape(href)}" />`,
    )
    .join('\n');
  return [
    '  <url>',
    `    <loc>${xmlEscape(entry.url)}</loc>`,
    `    <lastmod>${entry.lastModified.toISOString()}</lastmod>`,
    `    <changefreq>${entry.changeFrequency}</changefreq>`,
    `    <priority>${entry.priority.toFixed(1)}</priority>`,
    alternates,
    '  </url>',
  ].join('\n');
};

const buildEntries = async (): Promise<Entry[]> => {
  const now = new Date();
  const entries: Entry[] = [];

  // Localized static routes — one row per locale, all sharing the same
  // hreflang alternate map.
  for (const route of STATIC_ROUTES) {
    entries.push({
      url: localizedUrl(AppConfig.defaultLocale, route.path),
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: localizedAlternates(route.path),
    });
    for (const locale of AppConfig.locales) {
      if (locale === AppConfig.defaultLocale) {
        continue;
      }
      entries.push({
        url: localizedUrl(locale, route.path),
        lastModified: now,
        changeFrequency: route.changeFrequency,
        priority: Math.max(0, route.priority - 0.1),
        alternates: localizedAlternates(route.path),
      });
    }
  }

  // Portfolio detail pages — localized too.
  for (const project of portfolioData as Project[]) {
    const portfolioPath = `/portfolio/${project.slug}`;
    for (const locale of AppConfig.locales) {
      entries.push({
        url: localizedUrl(locale, portfolioPath),
        lastModified: now,
        changeFrequency: 'monthly',
        priority: locale === AppConfig.defaultLocale ? 0.7 : 0.6,
        alternates: localizedAlternates(portfolioPath),
      });
    }
  }

  // Blog is pt-BR only — one row per published post, hreflang locked to the
  // default locale so /en/blog* doesn't get crawled (middleware 308s it back).
  const blogPosts = (await getPostsSafe()).filter(isPublished);
  entries.push({
    url: localizedUrl(AppConfig.defaultLocale, '/blog'),
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.8,
    alternates: defaultOnlyAlternates('/blog'),
  });
  for (const post of blogPosts) {
    const blogPath = `/blog/${post.slug}`;
    entries.push({
      url: localizedUrl(AppConfig.defaultLocale, blogPath),
      lastModified: new Date(post.updatedAt ?? post.publishedAt),
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: defaultOnlyAlternates(blogPath),
    });
  }
  for (const categorySlug of getAllCategorySlugs(blogPosts)) {
    const categoryPath = `/blog/category/${categorySlug}`;
    entries.push({
      url: localizedUrl(AppConfig.defaultLocale, categoryPath),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
      alternates: defaultOnlyAlternates(categoryPath),
    });
  }

  return entries;
};

export async function GET() {
  const entries = await buildEntries();
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    // Stylesheet directive: browsers transform the sitemap into a styled HTML
    // table; crawlers ignore the line entirely.
    '<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    entries.map(renderEntry).join('\n'),
    '</urlset>',
    '',
  ].join('\n');

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      // 5 min at edge, 1 h at origin — sitemap doesn't need to be real-time.
      'Cache-Control': 'public, max-age=300, s-maxage=3600',
    },
  });
}
