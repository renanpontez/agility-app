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
  { path: '/blog', changeFrequency: 'daily', priority: 0.8 },
];

const buildLanguageAlternates = (path: string) => {
  const languages: Record<string, string> = {};
  for (const locale of AppConfig.locales) {
    languages[locale] = localizedUrl(locale, path);
  }
  languages['x-default'] = localizedUrl(AppConfig.defaultLocale, path);
  return languages;
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

  // Blog article pages, one row per locale, lastModified from the post itself.
  // Drafts (status: 'draft') stay out of the sitemap.
  const blogPosts = (await getPostsSafe()).filter(isPublished);
  for (const post of blogPosts) {
    const blogPath = `/blog/${post.slug}`;
    const lastModified = new Date(post.updatedAt ?? post.publishedAt);
    for (const locale of AppConfig.locales) {
      entries.push({
        url: localizedUrl(locale, blogPath),
        lastModified,
        changeFrequency: 'monthly',
        priority: locale === AppConfig.defaultLocale ? 0.7 : 0.6,
        alternates: { languages: buildLanguageAlternates(blogPath) },
      });
    }
  }

  // Blog category index pages, one row per locale per category.
  for (const categorySlug of getAllCategorySlugs(blogPosts)) {
    const categoryPath = `/blog/category/${categorySlug}`;
    for (const locale of AppConfig.locales) {
      entries.push({
        url: localizedUrl(locale, categoryPath),
        lastModified: now,
        changeFrequency: 'weekly',
        priority: locale === AppConfig.defaultLocale ? 0.6 : 0.5,
        alternates: { languages: buildLanguageAlternates(categoryPath) },
      });
    }
  }

  return entries;
}
