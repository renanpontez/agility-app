import classNames from 'classnames';
import Image from 'next/image';
import React from 'react';

import BrandLoader from '@/public/assets/gifs/loading_agility_3.gif';

type BrandLoadingProps = {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xlg' | 'fullscreen' | 'full';
};

const BrandLoading: React.FC<BrandLoadingProps> = ({ className, size = 'fullscreen' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xlg: 'w-24 h-24',
    fullscreen: 'w-64 h-64 fixed left-0 right-0 mx-auto flex items-center justify-center bg-opacity-75 ',
    full: 'w-12 h-12 flex items-center justify-center',
  };

  return (
    <div
      role="status"
      className={classNames(
        'flex items-center justify-center',
        size === 'fullscreen' && 'fixed inset-0 bg-secondaryEvenDarker bg-opacity-75 z-80',
      )}
    >
      <Image src={BrandLoader} className={classNames(sizeClasses[size], className)} alt="Brand Loading Spinner" />
    </div>
  );
};

export default BrandLoading;
