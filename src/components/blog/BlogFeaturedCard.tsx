'use client';

import Image from 'next/image';

import { Link } from '@/libs/i18nNavigation';

import type { BlogCardItem } from './BlogCard';
import { blogArticlePath } from './blogUrls';
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
      href={blogArticlePath(item)}
      className="group relative grid grid-cols-1 overflow-hidden rounded-3xl border border-stone-200/70 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all duration-500 hover:-translate-y-0.5 hover:border-stone-300/70 hover:shadow-[0_24px_60px_-20px_rgba(0,0,0,0.18),0_8px_20px_-12px_rgba(0,0,0,0.08)] lg:grid-cols-[1.55fr_1fr]"
    >
      {item.coverImage
        ? (
            <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-stone-100 to-stone-50 lg:aspect-auto">
              <Image
                src={item.coverImage}
                alt={item.coverAlt ?? item.title}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                priority
              />
              {/* Subtle inner vignette — gives the image more depth without darkening it. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/[0.04]"
              />
            </div>
          )
        : (
            <div className="aspect-[16/10] bg-gradient-to-br from-stone-100 to-stone-50 lg:aspect-auto" />
          )}

      <div className="flex flex-col justify-center gap-6 p-8 md:p-12 lg:p-14">
        <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">
          <span>{dateLabel}</span>
          {item.category && (
            <>
              <span aria-hidden className="size-1 rounded-full bg-stone-300" />
              <span className="text-primary">{item.category}</span>
            </>
          )}
        </div>

        <h2 className="text-[1.875rem] font-semibold leading-[1.1] tracking-[-0.02em] text-stone-900 transition-colors duration-300 md:text-[2.25rem] lg:text-[2.5rem]">
          {item.title}
        </h2>

        <p className="line-clamp-3 text-[15px] leading-relaxed text-stone-500">
          {item.excerpt}
        </p>

        <span className="mt-2 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-900">
          {readArticleLabel}
          <span className="inline-flex size-8 items-center justify-center rounded-full bg-stone-900 text-stone-50 shadow-[0_1px_2px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.08)] transition-transform duration-300 group-hover:translate-x-1">
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
