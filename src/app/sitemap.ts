import type { MetadataRoute } from 'next';

import { getAllCategorySlugs } from '@/components/blog/categories';
import portfolioData from '@/data/portfolio.json';
import { getPostsSafe } from '@/libs/blogStore';
import { isPublished } from '@/types/blog';
import type { Project } from '@/types/portfolio';
import { AppConfig } from '@/utils/AppConfig';
import { localizedUrl } from '@/utils/seo';

type StaticRoute = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority: number;
};

const STATIC_ROUTES: StaticRoute[] = [
  { path: '/', changeFrequency: 'weekly', priority: 1 },
  { path: '/sobre-nos', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/portfolio', changeFrequency: 'weekly', priority: 0.9 },
];

// Pages that have localized variants — both pt-BR and /en URLs exist.
const buildLanguageAlternates = (path: string) => {
  const languages: Record<string, string> = {};
  for (const locale of AppConfig.locales) {
    languages[locale] = localizedUrl(locale, path);
  }
  languages['x-default'] = localizedUrl(AppConfig.defaultLocale, path);
  return languages;
};

// Pages that only exist in the default locale (blog, etc.) — every hreflang
// points at the same URL so search engines don't go looking for translations.
const buildDefaultOnlyAlternates = (path: string) => {
  const url = localizedUrl(AppConfig.defaultLocale, path);
  return {
    [AppConfig.defaultLocale]: url,
    'x-default': url,
  };
};

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // Emit a row per static route, anchored to the default-locale URL with
  // hreflang alternates so search engines pick the right localized variant.
  for (const route of STATIC_ROUTES) {
    entries.push({
      url: localizedUrl(AppConfig.defaultLocale, route.path),
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: { languages: buildLanguageAlternates(route.path) },
    });
    // Also list the non-default localized URLs so they appear in the sitemap
    // even if a crawler only follows direct URLs and ignores alternates.
    for (const locale of AppConfig.locales) {
      if (locale === AppConfig.defaultLocale) {
        continue;
      }
      entries.push({
        url: localizedUrl(locale, route.path),
        lastModified: now,
        changeFrequency: route.changeFrequency,
        priority: Math.max(0, route.priority - 0.1),
        alternates: { languages: buildLanguageAlternates(route.path) },
      });
    }
  }

  // Portfolio project detail pages, one row per locale.
  for (const project of portfolioData as Project[]) {
    const portfolioPath = `/portfolio/${project.slug}`;
    for (const locale of AppConfig.locales) {
      entries.push({
        url: localizedUrl(locale, portfolioPath),
        lastModified: now,
        changeFrequency: 'monthly',
        priority: locale === AppConfig.defaultLocale ? 0.7 : 0.6,
        alternates: { languages: buildLanguageAlternates(portfolioPath) },
      });
    }
  }

  // Blog is pt-BR only — emit a single canonical row per published post and
  // mark hreflang pt-BR + x-default at the same URL so /en/blog* doesn't get
  // crawled (middleware redirects it back here anyway).
  const blogPosts = (await getPostsSafe()).filter(isPublished);
  entries.push({
    url: localizedUrl(AppConfig.defaultLocale, '/blog'),
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.8,
    alternates: { languages: buildDefaultOnlyAlternates('/blog') },
  });
  for (const post of blogPosts) {
    const blogPath = `/blog/${post.slug}`;
    entries.push({
      url: localizedUrl(AppConfig.defaultLocale, blogPath),
      lastModified: new Date(post.updatedAt ?? post.publishedAt),
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: { languages: buildDefaultOnlyAlternates(blogPath) },
    });
  }
  for (const categorySlug of getAllCategorySlugs(blogPosts)) {
    const categoryPath = `/blog/category/${categorySlug}`;
    entries.push({
      url: localizedUrl(AppConfig.defaultLocale, categoryPath),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
      alternates: { languages: buildDefaultOnlyAlternates(categoryPath) },
    });
  }

  return entries;
}
