import classNames from 'classnames';
import Image from 'next/image';
import React from 'react';

import type { ButtonProps } from '@/components/Button';
import { Button } from '@/components/Button'; // Assuming you have a Button component

type HeroProps = {
  mediaType: 'image' | 'video';
  mediaSrc: string;
  style: 'full-height' | 'auto-height' | 'custom-height';
  className?: string;
  altText?: string; // Alt text for images
  videoProps?: React.VideoHTMLAttributes<HTMLVideoElement>; // Additional video props
  title?: React.ReactNode; // Accepts React children for the title
  cta?: ButtonProps; // Button props for the CTA
};

const Hero: React.FC<HeroProps> = ({
  mediaType,
  mediaSrc,
  style,
  className,
  altText,
  videoProps,
  title,
  cta,
}) => {
  return (
    <div
      className={classNames(
        'relative w-full',
        {
          'h-screen': style === 'full-height',
          'h-auto': style === 'auto-height',
        },
        className,
      )}
    >
      <div>

        {mediaType === 'image'
          ? (
              <Image
                src={mediaSrc}
                alt={altText || 'Hero Image'}
                layout="fill"
                objectFit="cover"
                className="z-0"
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
      <div className="absolute size-full items-center">
        <div className="container z-10 flex h-full flex-col items-start justify-center text-left">
          {title && <span>{title}</span>}
          {cta && <Button {...cta} />}
        </div>
      </div>
    </div>
  );
};

export default Hero;
