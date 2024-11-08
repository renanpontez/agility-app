'use client';

import { animated, useSpring } from '@react-spring/web';
import classNames from 'classnames';
import React, { useEffect } from 'react';
import { twMerge } from 'tailwind-merge';

import Button from '@/components/Button'; // Assuming you have a Button component
import type { ButtonProps } from '@/components/Button/Button';

import HeroMedia from './HeroMedia';

type HeroProps = {
  mediaType: 'image' | 'video';
  mediaSrc: string;
  style: 'full-height' | 'auto-height' | 'custom-height';
  className?: string;
  altText?: string; // Alt text for images
  videoProps?: React.VideoHTMLAttributes<HTMLVideoElement>; // Additional video props
  content?: React.ReactNode; // Accepts React children for the title
  cta?: ButtonProps; // Button props for the CTA
  applyMask?: boolean; // Apply a gradient mask over the media
  maskClassName?: string; // Additional class names for the mask
};

const Hero: React.FC<HeroProps> = ({
  applyMask = false,
  maskClassName,
  mediaType,
  mediaSrc,
  style,
  className,
  altText,
  videoProps,
  content,
  cta,
}) => {
  const [slideDown, slideDownApi] = useSpring(() => ({
    from: { y: -200 },
  }));

  const [fadeIn, fadeInApi] = useSpring(() => ({
    from: { opacity: 0 },
  }));

  useEffect(() => {
    slideDownApi.start({ y: 0 });
    fadeInApi.start({ opacity: 1 });
  }, [slideDownApi, fadeInApi]);

  return (
    <animated.div
      className={classNames(
        'relative w-full flex items-center justify-center',
        {
          'h-screen': style === 'full-height',
          'h-auto': style === 'auto-height',
        },
        className,
      )}
      style={{
        ...fadeIn,
      }}

    >
      {applyMask && (
        <div className={twMerge('absolute left-0 top-0 z-0 size-full bg-gradient-to-r from-transparent to-black z-10', maskClassName)} />
      )}
      <div>
        <HeroMedia
          mediaType={mediaType}
          mediaSrc={mediaSrc}
          altText={altText}
          videoProps={videoProps}
        />
      </div>
      <div className="items-center md:size-full">

        <div className="container relative z-20 flex flex-col items-start justify-center text-left md:h-full">
          <animated.div style={{ ...slideDown }}>
            {content && <>{content}</>}
          </animated.div>
          {cta && <Button {...cta} />}
        </div>
      </div>
    </animated.div>
  );
};

export default Hero;
