import classNames from 'classnames';
import Image from 'next/image';
import React from 'react';

import BrandLoader from '@/public/assets/gifs/loading_agility_3.gif';

import Text from '../Text';

type BrandLoadingProps = {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xlg' | 'fullscreen' | 'full';
  label?: string;
};

const BrandLoading: React.FC<BrandLoadingProps> = ({ className, size = 'fullscreen', label }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xlg: 'w-24 h-24',
    fullscreen: 'w-64 h-64 fixed left-0 right-0 mx-auto flex items-center justify-center bg-opacity-75 ',
    full: 'w-32 h-32 flex items-center ',
  };

  return (
    <div
      role="status"
      className={classNames(
        'flex items-center justify-center flex-col',
        size === 'full' && 'z-10 bg-secondaryDarker bg-opacity-90 rounded-lg size-full absolute inset-0',
        size === 'fullscreen' && 'fixed inset-0 bg-secondaryEvenDarker bg-opacity-75 z-80',
      )}
    >
      <Image src={BrandLoader} className={classNames(sizeClasses[size], className)} alt="Brand Loading Spinner" />
      {label && <Text as="em" size="xs" className="w-1/2 text-center text-secondaryLight">{label}</Text>}
    </div>
  );
};

export default BrandLoading;
