'use client';

import classNames from 'classnames';
import { useEffect, useId, useRef, useState } from 'react';

import { Link } from '@/libs/i18nNavigation';

import { blogCategoriesPath, blogCategoryPath } from './blogUrls';
import type { BlogCategoryRef } from './categories';

type HeaderCategoriesDropdownProps = {
  label: string;
  allLabel: string;
  categories: BlogCategoryRef[];
};

const HeaderCategoriesDropdown = ({
  label,
  allLabel,
  categories,
}: HeaderCategoriesDropdownProps) => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const panelId = useId();

  // Click outside / Escape closes the menu. We only attach the listener
  // when the menu is open so we don't pay the cost on every page.
  useEffect(() => {
    if (!open) {
      return;
    }
    const handlePointer = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (!target) {
        return;
      }
      if (
        buttonRef.current?.contains(target)
        || panelRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('touchstart', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('touchstart', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(prev => !prev)}
        className={classNames(
          'inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-[13px] font-medium tracking-tight transition-colors',
          open
            ? 'bg-stone-100 text-stone-900'
            : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900',
        )}
      >
        {label}
        <svg
          viewBox="0 0 24 24"
          width="12"
          height="12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className={classNames(
            'transition-transform duration-200',
            open ? 'rotate-180' : 'rotate-0',
          )}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div
          ref={panelRef}
          id={panelId}
          role="menu"
          aria-label={label}
          className="absolute right-0 top-[calc(100%+8px)] z-50 w-64 origin-top-right overflow-hidden rounded-2xl border border-stone-200/70 bg-white p-1.5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.18),0_8px_20px_-12px_rgba(0,0,0,0.08)]"
        >
          {categories.length === 0
            ? (
                <p className="px-3 py-3 text-[12px] text-stone-400">—</p>
              )
            : (
                <ul className="space-y-px">
                  {categories.map(category => (
                    <li key={category.slug}>
                      <Link
                        href={blogCategoryPath(category)}
                        role="menuitem"
                        onClick={() => setOpen(false)}
                        className="block rounded-lg px-3 py-2 text-[13px] font-medium text-stone-700 transition-colors hover:bg-stone-100 hover:text-stone-900"
                      >
                        {category.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
          <div className="my-1.5 h-px bg-stone-200/70" />
          <Link
            href={blogCategoriesPath()}
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900"
          >
            {allLabel}
            <span aria-hidden>→</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default HeaderCategoriesDropdown;
