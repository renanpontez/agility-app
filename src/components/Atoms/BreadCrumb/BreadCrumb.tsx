import classNames from 'classnames';
import Link from 'next/link';
import React from 'react';
import { twMerge } from 'tailwind-merge';

export type BreadcrumbItemsProps = {
  name: string;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItemsProps[];
  className?: string;
  style?: 'primary' | 'secondary' | 'white' | 'dark';
  size?: 'xs' | 'md' | 'lg';
};

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className, style = 'white', size = 'xs' }) => {
  const textStyle = twMerge(
    classNames(
      'hover:underline',
      {
        'text-white': style === 'white',
        'text-primary': style === 'primary',
        'text-secondary': style === 'secondary',
        'text-secondaryDark': style === 'dark',
      },
      classNames,
    ),
  );

  const textSize = twMerge(classNames('container pt-4', className, {
    'text-xs': size === 'xs',
    'text-md': size === 'md',
    'text-lg': size === 'lg',
  }));

  return (
    <nav aria-label="Breadcrumb" className={textSize}>
      <ol className="flex space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index !== 0 && (
              <span className="mx-2 text-gray-400">/</span>
            )}
            {item.href
              ? (
                  <Link href={item?.href} target="_self" className={textStyle}>
                    {item.name}
                  </Link>
                )
              : (
                  <span className="opacity-50">{item.name}</span>
                )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
