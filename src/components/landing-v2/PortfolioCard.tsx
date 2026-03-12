'use client';

import Image from 'next/image';

import RevealOnScroll from './RevealOnScroll';

export type PortfolioItem = {
  name: string;
  category: string;
  type: string;
  description: string;
  image: string;
  slug: string;
};

type PortfolioCardProps = {
  item: PortfolioItem;
  index?: number;
};

const PortfolioCard = ({ item, index = 0 }: PortfolioCardProps) => {
  return (
    <RevealOnScroll delay={index * 100}>
      <a href={`/portfolio/${item.slug}`} className="group block rounded-lg">
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03]">
          <div className="relative aspect-[16/9] overflow-hidden">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://placehold.co/800x600/111111/BC01FD/png?text=${encodeURIComponent(item.name)}`;
              }}
            />
          </div>
        </div>

        <div className="mt-5">
          <h3 className="text-lg font-bold">{item.name}</h3>
          <div className="mt-1.5 flex items-center justify-between">
            <span className="text-sm text-white/40">{item.category}</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-white/40">
            {item.description}
          </p>
          <div className="mt-2 flex items-center py-3.5">
            <span className="flex items-center gap-2 text-sm font-medium text-white/50 transition-colors group-hover:text-primary">
              Ver detalhes do projeto
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </span>
          </div>
        </div>
      </a>
    </RevealOnScroll>
  );
};

export default PortfolioCard;
