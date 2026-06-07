import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import {
  blogCategoriesPath,
  blogCategoryPath,
  BlogHero,
  getOrderedCategories,
  slugifyCategory,
} from '@/components/blog';
import { getPostsSafe } from '@/libs/blogStore';
import { Link } from '@/libs/i18nNavigation';
import { isPublished } from '@/types/blog';
import { AppConfig } from '@/utils/AppConfig';
import { getBaseUrl } from '@/utils/Helpers';
import { buildDefaultLocaleAlternates, localizedUrl, ogLocale } from '@/utils/seo';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const safeLocale = AppConfig.defaultLocale;
  const t = await getTranslations({ locale: safeLocale, namespace: 'BlogCategories' });
  const alternates = buildDefaultLocaleAlternates(blogCategoriesPath(), { withRssFeed: true });

  return {
    metadataBase: new URL(getBaseUrl()),
    title: t('metaTitle'),
    description: t('metaDescription'),
    keywords: ['blog', 'categorias', 'agility creative'],
    alternates,
    openGraph: {
      title: t('metaTitle'),
      description: t('metaDescription'),
      url: alternates.canonical,
      siteName: AppConfig.name,
      locale: ogLocale(safeLocale),
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('metaTitle'),
      description: t('metaDescription'),
    },
  };
}

const BlogCategoriesPage = async () => {
  const safeLocale = AppConfig.defaultLocale;
  const t = await getTranslations({ locale: safeLocale, namespace: 'BlogCategories' });
  const tCat = await getTranslations({ locale: safeLocale, namespace: 'BlogCategory' });
  const tNav = await getTranslations({ locale: safeLocale, namespace: 'BlogCategory' });

  const posts = (await getPostsSafe()).filter(isPublished);
  // Same ordering rule as the index — first-seen wins, dedup by slug.
  const categories = getOrderedCategories(posts);
  const postsByCategory = new Map<string, number>();
  for (const post of posts) {
    if (!post.category) {
      continue;
    }
    const key = slugifyCategory(post.category);
    postsByCategory.set(key, (postsByCategory.get(key) ?? 0) + 1);
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': t('metaTitle'),
    'description': t('metaDescription'),
    'url': localizedUrl(safeLocale, blogCategoriesPath()),
    'inLanguage': safeLocale,
    'mainEntity': {
      '@type': 'ItemList',
      'itemListElement': categories.map((category, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': category.label,
        'url': localizedUrl(safeLocale, blogCategoryPath(category)),
      })),
    },
  };

  return (
    <>
      <BlogHero
        eyebrow={t('eyebrow')}
        title={t('title')}
        subtitle={t('subtitle')}
        breadcrumbs={[
          { label: tNav('breadcrumbBlog'), href: '/blog' },
          { label: t('eyebrow') },
        ]}
      />

      <section className="mx-auto max-w-6xl px-5 pb-28 pt-12 sm:px-8 md:pb-36 md:pt-16">
        <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const count = postsByCategory.get(category.slug) ?? 0;
            const countLabel
              = count === 1
                ? t('postCountOne', { count })
                : t('postCountOther', { count });
            return (
              <li key={category.slug}>
                <Link
                  href={blogCategoryPath(category)}
                  className="group flex h-full flex-col gap-5 rounded-2xl border border-stone-200/70 bg-white p-7 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-0.5 hover:border-stone-300/70 hover:shadow-[0_12px_28px_-12px_rgba(0,0,0,0.12),0_4px_10px_-6px_rgba(0,0,0,0.06)]"
                >
                  <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                    <span>{t('eyebrow')}</span>
                    <span className="text-stone-400">{countLabel}</span>
                  </div>
                  <h2 className="text-[22px] font-semibold leading-tight tracking-[-0.01em] text-stone-900 transition-colors group-hover:text-primary">
                    {category.label}
                  </h2>
                  <p className="mt-auto text-[13px] leading-relaxed text-stone-500">
                    {tCat('subtitle', { category: category.label })}
                  </p>
                  <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-900">
                    {t('exploreLink')}
                    <span
                      aria-hidden
                      className="inline-flex size-7 items-center justify-center rounded-full bg-stone-900 text-stone-50 transition-transform duration-300 group-hover:translate-x-1"
                    >
                      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/dom-no-dangerously-set-innerhtml
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
};

export default BlogCategoriesPage;
