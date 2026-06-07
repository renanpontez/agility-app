import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound, permanentRedirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import {
  BlogArticleBody,
  blogArticlePath,
  blogCategoryPath,
  BlogHero,
  postCategorySlug,
  SubscribeForm,
} from '@/components/blog';
import { getPostsSafe } from '@/libs/blogStore';
import { Link } from '@/libs/i18nNavigation';
import { isPublished } from '@/types/blog';
import { AppConfig } from '@/utils/AppConfig';
import { getBaseUrl } from '@/utils/Helpers';
import { buildDefaultLocaleAlternates, localizedUrl, ogLocale } from '@/utils/seo';

export const dynamic = 'force-dynamic';

type Params = {
  category: string;
  slug: string;
  locale: string;
};

export async function generateMetadata(props: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { category, slug } = await props.params;
  const posts = await getPostsSafe();
  const post = posts.find(item => item.slug === slug);
  // Canonical URL always uses the post's true category slug, even if the
  // request came in under a stale or wrong category (we redirect those — see
  // page body — but metadata must still point at the canonical path).
  const canonicalCategory = post ? postCategorySlug(post) : category;
  const canonicalPath = `/blog/${canonicalCategory}/${slug}`;
  const alternates = buildDefaultLocaleAlternates(canonicalPath, { withRssFeed: true });
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
      locale: ogLocale(AppConfig.defaultLocale),
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
  const { category, slug } = await props.params;
  // Blog is pt-BR only — pin locale regardless of `[locale]` segment.
  const safeLocale = AppConfig.defaultLocale;
  const t = await getTranslations({ locale: safeLocale, namespace: 'BlogDetail' });
  const posts = await getPostsSafe();
  const existing = posts.find(item => item.slug === slug);

  // Real 404 (not a soft 200 with a "not found" message) for both missing
  // slugs and drafts — keeps unpublished URLs out of search indexes.
  if (!existing || !isPublished(existing)) {
    notFound();
  }
  const post = existing;

  // The category segment is part of the URL but only the slug uniquely
  // identifies the post. If the visitor arrived under a stale category
  // (renamed, typo, old share), permanent-redirect them to the canonical
  // URL so SEO equity consolidates on one path.
  const canonicalCategorySlug = postCategorySlug(post);
  if (canonicalCategorySlug !== category) {
    permanentRedirect(blogArticlePath(post));
  }

  const dateLabel = new Intl.DateTimeFormat(safeLocale === 'pt-BR' ? 'pt-BR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(post.publishedAt));

  const articleUrl = localizedUrl(safeLocale, blogArticlePath(post));
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
    'articleSection': post.category,
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
  };

  const heroMeta = (
    <>
      {post.author?.avatar && (
        <span className="relative inline-flex size-8 overflow-hidden rounded-full border border-stone-200/70 bg-stone-100">
          <Image
            src={post.author.avatar}
            alt={post.author.name}
            fill
            sizes="32px"
            className="object-contain p-1.5"
          />
        </span>
      )}
      {post.author && (
        <span className="font-medium text-stone-700">{post.author.name}</span>
      )}
      <span aria-hidden className="size-1 rounded-full bg-stone-300" />
      <time dateTime={post.publishedAt}>{dateLabel}</time>
      {post.readingTimeMinutes && (
        <>
          <span aria-hidden className="size-1 rounded-full bg-stone-300" />
          <span>
            {post.readingTimeMinutes}
            {' '}
            {t('readingTimeSuffix')}
          </span>
        </>
      )}
    </>
  );

  // Breadcrumb: Blog → Category → Article. The category crumb is the new
  // navigation surface — readers can click it to see siblings.
  const breadcrumbs = [
    { label: t('breadcrumbBlog'), href: '/blog' },
    ...(post.category
      ? [{ label: post.category, href: blogCategoryPath(canonicalCategorySlug) }]
      : []),
    { label: post.title },
  ];

  return (
    <>
      <BlogHero
        eyebrow={post.category}
        title={post.title}
        subtitle={post.excerpt}
        meta={heroMeta}
        breadcrumbs={breadcrumbs}
      />

      <article className="mx-auto max-w-[720px] px-5 py-20 sm:px-8 md:py-28">
        {post.coverImage && (
          <figure className="mb-16 overflow-hidden rounded-2xl ring-1 ring-stone-200/70">
            <Image
              src={post.coverImage}
              alt={post.coverAlt ?? post.title}
              width={1600}
              height={900}
              sizes="(max-width: 768px) 100vw, 720px"
              priority
              className="h-auto w-full"
            />
          </figure>
        )}

        <BlogArticleBody blocks={post.body} />

        {post.tags && post.tags.length > 0 && (
          <div className="mt-20 flex flex-wrap gap-2 border-t border-stone-200/70 pt-10">
            {post.tags.map(tag => (
              <span
                key={tag}
                className="rounded-full border border-stone-200/70 bg-white px-3 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-stone-500"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-14 border-t border-stone-200/70 pt-10">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500 transition-colors hover:text-stone-900"
          >
            <span aria-hidden className="transition-transform group-hover:-translate-x-0.5">←</span>
            {t('backToBlog')}
          </Link>
        </div>
      </article>

      {/* Newsletter CTA inside the article column so it reads as a natural
          end-of-piece prompt, not a separate site-wide footer block. */}
      <div className="mx-auto max-w-3xl px-5 pb-8 sm:px-8">
        <SubscribeForm source={`blog-article:${post.slug}`} />
      </div>

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/dom-no-dangerously-set-innerhtml
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
};

export default BlogArticlePage;
