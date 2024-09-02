import classNames from 'classnames';
import Image from 'next/image';
import React from 'react';
import { twMerge } from 'tailwind-merge';

import Button from '@/components/Button'; // Assuming you have a Button component
import type { ButtonProps } from '@/components/Button/Button';

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
  return (
    <div
      className={classNames(
        'relative w-full bg-no-repeat bg-cover bg-center flex items-center justify-center',
        {
          'h-screen': style === 'full-height',
          'h-auto': style === 'auto-height',
        },
        className,
      )}
      {...(mediaType === 'image' && {
        style: { backgroundImage: `url(${mediaSrc})` },
      })}
    >
      {applyMask && (
        <div className={twMerge('absolute left-0 top-0 z-0 size-full bg-gradient-to-r from-transparent to-black z-10', maskClassName)} />
      )}
      <div>
        {mediaType === 'image'
          ? (
              <Image
                src={mediaSrc}
                alt={altText || 'Hero Image'}
                layout="fill"
                objectFit="cover"
                className="absolute left-0 top-0 z-0 size-full object-cover"
              />
            )
          : (
            // eslint-disable-next-line jsx-a11y/media-has-caption
              <video
                src={mediaSrc}
                className="absolute left-0 top-0 z-0 size-full object-cover"
                {...videoProps}
              />
            )}
      </div>
      <div className="size-full items-center">
        <div className="container relative z-20 flex h-full flex-col items-start justify-center text-left">
          {content && <>{content}</>}
          {cta && <Button {...cta} />}
        </div>
      </div>
    </div>
  );
};

export default Hero;
