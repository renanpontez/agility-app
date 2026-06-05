'use client';

import Image from 'next/image';

import { Link } from '@/libs/i18nNavigation';

import type { BlogCardItem } from './BlogCard';
import { formatShortDate } from './formatDate';

type BlogFeaturedCardProps = {
  item: BlogCardItem;
  locale: string;
  readArticleLabel: string;
};

const BlogFeaturedCard = ({ item, locale, readArticleLabel }: BlogFeaturedCardProps) => {
  const dateLabel = formatShortDate(item.publishedAt, locale);

  return (
    <Link
      href={`/blog/${item.slug}`}
      className="group grid grid-cols-1 overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-colors hover:border-neutral-300 lg:grid-cols-[1.6fr_1fr]"
    >
      {item.coverImage
        ? (
            <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-neutral-50 to-neutral-100 lg:aspect-auto">
              <Image
                src={item.coverImage}
                alt={item.coverAlt ?? item.title}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                priority
              />
            </div>
          )
        : (
            <div className="aspect-[16/10] bg-gradient-to-br from-neutral-100 to-neutral-50 lg:aspect-auto" />
          )}

      <div className="flex flex-col justify-center gap-5 p-8 md:p-10 lg:p-12">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.12em] text-neutral-500">
          <span>{dateLabel}</span>
          {item.category && (
            <>
              <span aria-hidden className="text-neutral-300">/</span>
              <span className="uppercase text-primary">{item.category}</span>
            </>
          )}
        </div>

        <h2 className="text-3xl font-bold leading-[1.15] tracking-tight text-neutral-900 transition-colors group-hover:text-primary md:text-4xl">
          {item.title}
        </h2>

        <p className="line-clamp-3 text-base leading-relaxed text-neutral-600">
          {item.excerpt}
        </p>

        <span className="mt-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-neutral-900">
          {readArticleLabel}
          <span className="inline-flex size-7 items-center justify-center rounded-full bg-neutral-900 text-white transition-transform group-hover:translate-x-1">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </span>
        </span>
      </div>
    </Link>
  );
};

export default BlogFeaturedCard;
