import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

import { BlogArticleBody, BlogHero } from '@/components/blog';
import blogData from '@/data/blog.json';
import { Link } from '@/libs/i18nNavigation';
import type { BlogPost } from '@/types/blog';
import { AppConfig } from '@/utils/AppConfig';
import { getBaseUrl } from '@/utils/Helpers';
import { buildAlternates, localizedUrl, ogAlternateLocales, ogLocale } from '@/utils/seo';

type Params = {
  slug: string;
  locale: string;
};

const posts = blogData as BlogPost[];

export async function generateStaticParams() {
  return posts.map(post => ({ slug: post.slug }));
}

export async function generateMetadata(props: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug, locale } = await props.params;
  const safeLocale = (AppConfig.locales as readonly string[]).includes(locale)
    ? (locale as (typeof AppConfig.locales)[number])
    : AppConfig.defaultLocale;
  const post = posts.find(item => item.slug === slug);
  const alternates = buildAlternates(safeLocale, `/blog/${slug}`);
  const title = post?.title ?? slug;
  const description = post?.excerpt ?? '';
  const ogImage = post?.coverImage;

  return {
    metadataBase: new URL(getBaseUrl()),
    title,
    description,
    keywords: post?.tags,
    authors: post?.author?.name ? [{ name: post.author.name }] : undefined,
    alternates,
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      siteName: AppConfig.name,
      locale: ogLocale(safeLocale),
      alternateLocale: ogAlternateLocales(safeLocale),
      type: 'article',
      publishedTime: post?.publishedAt,
      modifiedTime: post?.updatedAt ?? post?.publishedAt,
      authors: post?.author?.name ? [post.author.name] : undefined,
      tags: post?.tags,
      images: ogImage ? [{ url: ogImage, alt: post?.coverAlt ?? title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

const BlogArticlePage = async (props: { params: Promise<Params> }) => {
  const { slug, locale } = await props.params;
  const safeLocale = (AppConfig.locales as readonly string[]).includes(locale)
    ? (locale as (typeof AppConfig.locales)[number])
    : AppConfig.defaultLocale;
  const t = await getTranslations('BlogDetail');
  const post = posts.find(item => item.slug === slug);

  if (!post) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-base text-neutral-500">{t('notFound')}</p>
      </div>
    );
  }

  const dateLabel = new Intl.DateTimeFormat(safeLocale === 'pt-BR' ? 'pt-BR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(post.publishedAt));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': post.title,
    'description': post.excerpt,
    'image': post.coverImage,
    'datePublished': post.publishedAt,
    'dateModified': post.updatedAt ?? post.publishedAt,
    'author': post.author
      ? { '@type': 'Person', 'name': post.author.name }
      : undefined,
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': localizedUrl(safeLocale, `/blog/${slug}`),
    },
  };

  const heroMeta = (
    <>
      {post.author?.avatar && (
        <span className="relative inline-flex size-7 overflow-hidden rounded-full border border-neutral-200 bg-neutral-50">
          <Image
            src={post.author.avatar}
            alt={post.author.name}
            fill
            sizes="28px"
            className="object-contain p-1.5"
          />
        </span>
      )}
      {post.author && (
        <span className="font-medium text-neutral-700">{post.author.name}</span>
      )}
      <span aria-hidden className="text-neutral-300">·</span>
      <time dateTime={post.publishedAt}>{dateLabel}</time>
      {post.readingTimeMinutes && (
        <>
          <span aria-hidden className="text-neutral-300">·</span>
          <span>
            {post.readingTimeMinutes}
            {' '}
            {t('readingTimeSuffix')}
          </span>
        </>
      )}
    </>
  );

  return (
    <>
      <BlogHero
        eyebrow={post.category}
        title={post.title}
        subtitle={post.excerpt}
        meta={heroMeta}
        breadcrumbs={[
          { label: t('breadcrumbBlog'), href: '/blog' },
          { label: post.title },
        ]}
      />

      <article className="mx-auto max-w-[680px] px-4 py-16 sm:px-6 md:py-20">
        {post.coverImage && (
          <figure className="mb-12 overflow-hidden rounded-xl border border-neutral-200">
            <Image
              src={post.coverImage}
              alt={post.coverAlt ?? post.title}
              width={1600}
              height={900}
              sizes="(max-width: 768px) 100vw, 680px"
              priority
              className="h-auto w-full"
            />
          </figure>
        )}

        <BlogArticleBody blocks={post.body} />

        {post.tags && post.tags.length > 0 && (
          <div className="mt-16 flex flex-wrap gap-2 border-t border-neutral-200 pt-8">
            {post.tags.map(tag => (
              <span
                key={tag}
                className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs text-neutral-500"
              >
                #
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-12 border-t border-neutral-200 pt-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
          >
            <span aria-hidden>←</span>
            {' '}
            {t('backToBlog')}
          </Link>
        </div>
      </article>

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/dom-no-dangerously-set-innerhtml
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
};

export default BlogArticlePage;
