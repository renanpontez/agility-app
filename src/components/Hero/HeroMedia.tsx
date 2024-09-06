'use client';

import Image from 'next/image';
import React from 'react';

import LazyVideo from './LazyVideo';

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
  const isClient = typeof window !== 'undefined';
  const isMobile = isClient && window?.innerWidth < 768;
  const fallbackPoster = '/assets/images/video_cover.webp';
  return (
    <>
      {mediaType === 'image' || isMobile
        ? (
            <Image
              src={isMobile ? videoProps?.poster ?? fallbackPoster : mediaSrc}
              alt={altText || 'Hero Image'}
              layout="fill"
              className="absolute left-0 top-0 z-0 size-full object-cover"
              loading="lazy"
            />
          )
        : (
            <>
              {/* TODO: Change this to use a hook const { isMobile } = useBreakpoints() */}
              <LazyVideo
                src={mediaSrc}
                className="absolute left-0 top-0 z-0 size-full object-cover md:visible"
                props={videoProps}
              />
              <Image
                src={videoProps?.poster ?? ''}
                alt={altText || 'Hero Image'}
                layout="fill"
                className="absolute left-0 top-0 z-0 size-full object-cover md:hidden"
                loading="lazy"
              />
            </>
          )}
    </>
  );
};

export default HeroMedia;
