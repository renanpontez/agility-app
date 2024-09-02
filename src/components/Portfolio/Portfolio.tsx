import React from 'react';

import PortfolioItem from './PortfolioItem';

export type PortfolioProps = {
  items: Array<{
    id: number;
    imageSrc: string;
    title: string;
    description?: string;
    href?: string;
  }>;
};

const Portfolio: React.FC<PortfolioProps> = ({ items }) => {
  return (
    <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
      {items.map(item => (
        <PortfolioItem
          key={item.id}
          imageSrc={item.imageSrc}
          title={item.title}
          description={item.description}
          href={item.href}
        />
      ))}
    </div>
  );
};

export default Portfolio;
