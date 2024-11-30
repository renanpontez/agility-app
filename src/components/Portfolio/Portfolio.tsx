import React from 'react';

import type { Project } from '@/types/portfolio';

import PortfolioItem from './PortfolioItem';

const Portfolio: React.FC<{ items: Array<Project> }> = ({ items }) => {
  return (
    <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
      {items.map(item => (
        <PortfolioItem
          key={item.slug}
          imageSrc={item.thumbnailImage}
          title={item.name}
          description={item.introTitle}
          href={`/portfolio/${item.slug}`}
          linkPropsOverride={{ target: '_self', rel: '' }}
        />
      ))}
    </div>
  );
};

export default Portfolio;
