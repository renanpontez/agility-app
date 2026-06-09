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
  eyebrowLabel?: string;
};

const BlogFeaturedCard = ({ item, locale, readArticleLabel, eyebrowLabel }: BlogFeaturedCardProps) => {
  const dateLabel = formatShortDate(item.publishedAt, locale);

  return (
    <section aria-label={readArticleLabel}>
      {eyebrowLabel && (
        <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-400">
          {eyebrowLabel}
        </p>
      )}

      <Link
        href={blogArticlePath(item)}
        className="group grid grid-cols-1 items-center gap-8 md:gap-12 lg:grid-cols-[1fr_1.1fr]"
      >
        {item.coverImage
          ? (
              <div className="relative aspect-[16/11] overflow-hidden rounded-2xl bg-gradient-to-br from-stone-100 to-stone-50 ring-1 ring-inset ring-black/[0.04]">
                <Image
                  src={item.coverImage}
                  alt={item.coverAlt ?? item.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                  priority
                />
              </div>
            )
          : (
              <div className="aspect-[16/11] rounded-2xl bg-gradient-to-br from-stone-100 to-stone-50" />
            )}

        <div className="flex flex-col gap-5">
          <h2 className="text-[1.75rem] font-semibold leading-[1.1] tracking-[-0.02em] text-stone-900 transition-colors duration-300 group-hover:text-primary md:text-[2.125rem] lg:text-[2.5rem]">
            {item.title}
          </h2>

          <div className="flex flex-wrap items-center gap-2 text-[13px] text-stone-500">
            {item.category && (
              <>
                <span className="font-medium text-stone-700">{item.category}</span>
                <span aria-hidden className="text-stone-300">/</span>
              </>
            )}
            <span>{dateLabel}</span>
          </div>

          <p className="line-clamp-3 text-[15px] leading-relaxed text-stone-500">
            {item.excerpt}
          </p>
        </div>
      </Link>
    </section>
  );
};

export default BlogFeaturedCard;
