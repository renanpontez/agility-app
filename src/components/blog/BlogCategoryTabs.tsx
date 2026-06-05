import classNames from 'classnames';

import { Link } from '@/libs/i18nNavigation';

import type { BlogCategoryRef } from './categories';

type BlogCategoryTabsProps = {
  categories: BlogCategoryRef[];
  activeSlug: string;
  allLabel: string;
  allSlug?: string;
};

const ALL_SLUG = '__all__';

const BlogCategoryTabs = ({
  categories,
  activeSlug,
  allLabel,
  allSlug = ALL_SLUG,
}: BlogCategoryTabsProps) => {
  const items: { slug: string; label: string; href: string }[] = [
    { slug: allSlug, label: allLabel, href: '/blog' },
    ...categories.map(category => ({
      slug: category.slug,
      label: category.label,
      href: `/blog/category/${category.slug}`,
    })),
  ];

  return (
    <nav
      aria-label="Blog categories"
      className="relative -mx-5 border-b border-stone-200/70 px-5 sm:mx-0 sm:px-0"
    >
      <ul
        className="flex h-14 min-w-max items-stretch gap-1 overflow-x-auto overflow-y-hidden sm:gap-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => {
          const isActive = item.slug === activeSlug;
          return (
            <li key={item.slug} className="flex">
              <Link
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={classNames(
                  'relative inline-flex items-center whitespace-nowrap px-2 text-[13px] tracking-tight transition-colors',
                  isActive
                    ? 'font-semibold text-stone-900'
                    : 'font-medium text-stone-500 hover:text-stone-900',
                )}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden
                    className="absolute inset-x-2 -bottom-px h-[2px] rounded-t-full bg-stone-900"
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export { ALL_SLUG };
export default BlogCategoryTabs;
