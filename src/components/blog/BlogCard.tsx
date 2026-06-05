'use client';

import Image from 'next/image';

import { Link } from '@/libs/i18nNavigation';

import { formatShortDate } from './formatDate';

export type BlogCardItem = {
  slug: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  coverAlt?: string;
  category?: string;
  publishedAt: string;
  readingTimeMinutes?: number;
};

type BlogCardProps = {
  item: BlogCardItem;
  locale: string;
};

const BlogCard = ({ item, locale }: BlogCardProps) => {
  const dateLabel = formatShortDate(item.publishedAt, locale);

  return (
    <Link
      href={`/blog/${item.slug}`}
      className="group flex h-full flex-col gap-6 rounded-2xl border border-stone-200/70 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-0.5 hover:border-stone-300/70 hover:shadow-[0_12px_28px_-12px_rgba(0,0,0,0.12),0_4px_10px_-6px_rgba(0,0,0,0.06)]"
    >
      <div className="flex items-center gap-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400">
        <span>{dateLabel}</span>
        {item.category && (
          <>
            <span aria-hidden className="size-1 rounded-full bg-stone-300" />
            <span className="text-primary">{item.category}</span>
          </>
        )}
      </div>

      <div className="flex flex-1 items-start gap-5">
        <div className="flex-1">
          <h3 className="text-[17px] font-semibold leading-snug tracking-[-0.01em] text-stone-900 transition-colors duration-300 group-hover:text-primary">
            {item.title}
          </h3>
          <p className="mt-2.5 line-clamp-2 text-[13px] leading-relaxed text-stone-500">
            {item.excerpt}
          </p>
        </div>
        {item.coverImage && (
          <div className="relative size-[88px] shrink-0 overflow-hidden rounded-xl bg-stone-100 ring-1 ring-inset ring-black/[0.04]">
            <Image
              src={item.coverImage}
              alt={item.coverAlt ?? item.title}
              fill
              sizes="88px"
              className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
            />
          </div>
        )}
      </div>

      {item.readingTimeMinutes && (
        <div className="flex items-center gap-2 text-[11px] text-stone-400">
          <span aria-hidden className="h-px w-4 bg-stone-200" />
          <span>
            {item.readingTimeMinutes}
            {' '}
            min
          </span>
        </div>
      )}
    </Link>
  );
};

export default BlogCard;
