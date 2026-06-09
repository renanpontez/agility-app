'use client';

import { Link } from '@/libs/i18nNavigation';

import { blogCategoryPath } from './blogUrls';
import type { BlogCategoryWithCount } from './categories';
import SubscribeForm from './SubscribeForm';

type BlogSidebarProps = {
  popularCategories: BlogCategoryWithCount[];
  popularCategoriesLabel: string;
};

const BlogSidebar = ({ popularCategories, popularCategoriesLabel }: BlogSidebarProps) => {
  return (
    <aside className="lg:sticky lg:top-[88px] lg:self-start">
      <div className="rounded-2xl border border-stone-200/70 bg-stone-50/60 p-6">
        <SubscribeForm source="blog-sidebar" variant="sidebar" />
      </div>

      {popularCategories.length > 0 && (
        <div className="mt-10">
          <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-400">
            {popularCategoriesLabel}
          </p>
          <ul className="flex flex-col">
            {popularCategories.map(cat => (
              <li key={cat.slug}>
                <Link
                  href={blogCategoryPath(cat)}
                  className="group flex items-center gap-3 py-2.5"
                >
                  <span className="flex-1 truncate text-[14px] font-medium text-stone-700 transition-colors group-hover:text-primary">
                    {cat.label}
                  </span>
                  <span className="text-[11px] tabular-nums text-stone-400">
                    {cat.count}
                  </span>
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    width="14"
                    height="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-stone-300 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-stone-500"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
};

export default BlogSidebar;
