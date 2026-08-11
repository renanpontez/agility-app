'use client';

import { useState } from 'react';

import type { PortfolioItem } from './PortfolioCard';
import PortfolioCard from './PortfolioCard';
import RevealOnScroll from './RevealOnScroll';

const PORTFOLIO_FILTERS = ['Todos', 'Site', 'Landing Page', 'App', 'Design'] as const;

const PortfolioGrid = ({ items }: { items: PortfolioItem[] }) => {
  const [activeFilter, setActiveFilter] = useState<string>('Todos');

  const filtered = activeFilter === 'Todos'
    ? items
    : items.filter(p => p.type === activeFilter);

  // Only offer filters for the types actually present, and skip the bar entirely
  // when every project shares the same type.
  const presentTypes = PORTFOLIO_FILTERS.filter(
    filter => filter !== 'Todos' && items.some(p => p.type === filter),
  );
  const visibleFilters = presentTypes.length > 1 ? ['Todos', ...presentTypes] : [];

  return (
    <div className="relative z-10 bg-[#050505] pb-20">
      <div className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 xl:px-0">
        {visibleFilters.length > 0 && (
          <RevealOnScroll>
            <div className="mb-12 flex flex-wrap items-center justify-center gap-2">
              {visibleFilters.map(filter => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${activeFilter === filter
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'border border-white/10 text-white/50 hover:border-white/20 hover:text-white/80'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </RevealOnScroll>
        )}

        <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-3">
          {filtered.map((item, i) => (
            <PortfolioCard key={item.slug} item={item} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioGrid;
