import Link from 'next/link';
import React from 'react';
import { twMerge } from 'tailwind-merge';

export type BreadCrumbItemsProps = {
  name: string;
  href: string;
};

type BreadCrumbProps = {
  items: BreadCrumbItemsProps[];
  classNames?: string;
};

const BreadCrumb: React.FC<BreadCrumbProps> = ({ items, classNames }) => {
  return (
    <nav aria-label="Breadcrumb" className={twMerge('text-sm', classNames)}>
      <ol className="flex space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index !== 0 && (
              <span className="mx-2 text-gray-400">/</span>
            )}
            {item.href
              ? (
                  <Link href={item.href} target="_self" className="text-white hover:underline">
                    {item.name}
                  </Link>
                )
              : (
                  <span className="text-gray-500">{item.name}</span>
                )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default BreadCrumb;
