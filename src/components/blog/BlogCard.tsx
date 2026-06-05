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
      className="group flex h-full flex-col gap-5 rounded-2xl border border-neutral-200 bg-white p-6 transition-colors hover:border-neutral-300"
    >
      <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] text-neutral-500">
        <span>{dateLabel}</span>
        {item.category && (
          <>
            <span aria-hidden className="text-neutral-300">·</span>
            <span className="uppercase text-primary">{item.category}</span>
          </>
        )}
      </div>

      <div className="flex flex-1 items-start gap-4">
        <h3 className="flex-1 text-base font-semibold leading-snug text-neutral-900 transition-colors group-hover:text-primary">
          {item.title}
        </h3>
        {item.coverImage && (
          <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
            <Image
              src={item.coverImage}
              alt={item.coverAlt ?? item.title}
              fill
              sizes="80px"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
            />
          </div>
        )}
      </div>
    </Link>
  );
};

export default BlogCard;
