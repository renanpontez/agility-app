'use client';

import Image from 'next/image';
import React from 'react';

import { useBreakpoint } from '@/hooks/useBreakpoint';

import LazyVideo from './LazyVideo';

const FALLBACK_POSTER = '/assets/images/video_cover.webp';

type HeroMediaProps = {
  mediaType: string;
  mediaSrc: string;
  altText?: string;
  videoProps?: {
    poster?: string;
  };
};

const HeroMedia: React.FC<HeroMediaProps> = ({
  mediaType,
  mediaSrc,
  altText,
  videoProps,
}) => {
  const { isDesktop, isWidescreen } = useBreakpoint();

  const imageSrc = mediaType === 'image' ? mediaSrc : videoProps?.poster ?? FALLBACK_POSTER;
  const mediaClassName = 'absolute left-0 top-0 z-0 size-full object-cover';
  return (
    <>
      {(isDesktop || isWidescreen) && imageSrc === 'video'
        ? (
            <LazyVideo
              src={mediaSrc}
              className={mediaClassName}
              props={videoProps}
            />
          )
        : (
            <Image
              src={imageSrc}
              alt={altText || 'Hero Image'}
              layout="fill"
              className={mediaClassName}
              loading="eager"
            />
          )}
    </>
  );
};

export default HeroMedia;