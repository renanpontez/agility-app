'use client';

import Image from 'next/image';

import { Link } from '@/libs/i18nNavigation';

import type { BlogCardItem } from './BlogCard';
import { blogArticlePath } from './blogUrls';
import { formatShortDate } from './formatDate';

type BlogCardHorizontalProps = {
  item: BlogCardItem;
  locale: string;
};

const BlogCardHorizontal = ({ item, locale }: BlogCardHorizontalProps) => {
  const dateLabel = formatShortDate(item.publishedAt, locale);

  return (
    <Link
      href={blogArticlePath(item)}
      className="group flex items-start gap-5 py-8 first:pt-0 sm:gap-7 [&+&]:border-t [&+&]:border-stone-200/70"
    >
      {item.coverImage
        ? (
            <div className="relative size-[110px] shrink-0 overflow-hidden rounded-2xl bg-stone-100 ring-1 ring-inset ring-black/[0.04] sm:size-[140px] md:size-[160px]">
              <Image
                src={item.coverImage}
                alt={item.coverAlt ?? item.title}
                fill
                sizes="(max-width: 640px) 110px, (max-width: 768px) 140px, 160px"
                className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
              />
            </div>
          )
        : (
            <div className="size-[110px] shrink-0 rounded-2xl bg-gradient-to-br from-stone-100 to-stone-200 sm:size-[140px] md:size-[160px]" />
          )}

      <div className="flex flex-1 flex-col gap-3 pt-1">
        <h3 className="text-[18px] font-semibold leading-snug tracking-[-0.01em] text-stone-900 transition-colors duration-300 group-hover:text-primary sm:text-[20px] md:text-[22px]">
          {item.title}
        </h3>

        <div className="flex flex-wrap items-center gap-2 text-[13px] text-stone-500">
          {item.category && (
            <>
              <span className="font-medium text-stone-700">{item.category}</span>
              <span aria-hidden className="text-stone-300">/</span>
            </>
          )}
          <span>{dateLabel}</span>
        </div>

        <p className="line-clamp-2 text-[14px] leading-relaxed text-stone-500">
          {item.excerpt}
        </p>
      </div>
    </Link>
  );
};

export default BlogCardHorizontal;
