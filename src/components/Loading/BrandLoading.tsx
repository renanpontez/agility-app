import classNames from 'classnames';
import Image from 'next/image';
import React from 'react';

import BrandLoader from '@/public/assets/gifs/loading_agility_3.gif';

type BrandLoadingProps = {
  className?: string;
};

const BrandLoading: React.FC<BrandLoadingProps> = ({ className }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    big: 'w-12 h-12',
    fullscreen: 'w-16 h-16 absolute inset-0 flex items-center justify-center bg-white bg-opacity-75',
    full: 'w-12 h-12 flex items-center justify-center',
  };

  return (
    <div role="status">
      <Image src={BrandLoader} className={classNames(sizeClasses.full, className)} alt="Brand Loading Spinner" />
    </div>
  );
};

export default BrandLoading;
