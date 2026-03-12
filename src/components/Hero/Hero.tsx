'use client';

import { animated, useSpring } from '@react-spring/web';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim'; // if you are going to use `loadSlim`, install the "@tsparticles/slim" package too.
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import Button from '@/components/Button'; // Assuming you have a Button component
import type { ButtonProps } from '@/components/Button/Button';

import HeroMedia from './HeroMedia';
import particlesConfig from './particlesConfig';

type HeroProps = {
  mediaType: 'image' | 'video' | 'particles';
  mediaSrc?: string;
  style: 'full-height' | 'auto-height' | 'custom-height';
  className?: string;
  altText?: string;
  videoProps?: React.VideoHTMLAttributes<HTMLVideoElement>;
  content?: React.ReactNode;
  bottomContent?: React.ReactNode;
  cta?: ButtonProps;
  applyMask?: boolean;
  maskClassName?: string;
  mediaClass?: string;
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
  bottomContent,
  mediaClass,
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

  const [init, setInit] = useState(false);
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  return (
    <animated.div
      className={classNames(
        'relative w-full bg-no-repeat bg-cover bg-center flex items-center justify-center',
        {
          'flex-col md:flex-row': true,
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
        <div className="absolute left-0 top-0 z-10 size-full bg-white bg-opacity-70">
          <div className={twMerge('absolute left-0 top-0 z-10 size-full', maskClassName)} />
        </div>
      )}

      {
        (!!mediaSrc && mediaType !== 'particles')
          ? (
              <HeroMedia
                mediaClass={mediaClass}
                mediaType={mediaType}
                mediaSrc={mediaSrc}
                altText={altText}
                videoProps={videoProps}
              />

            )
          : (
              <>
                {init && (
                  <Particles
                    id="tsparticles"
                    options={particlesConfig}
                    className="absolute left-0 top-0 z-0 size-full border-2 border-x-0 border-t-0 border-b-secondaryDark"
                  />
                )}
              </>
            )
      }

      <div className="relative z-20 flex size-full flex-col">
        <div className="container flex grow flex-col items-start justify-center text-left">
          <animated.div style={{ ...slideDown }}>
            {content && <>{content}</>}
          </animated.div>
          {cta && <Button {...cta} />}
        </div>
        {bottomContent && (
          <div className="relative z-20 w-full">
            {bottomContent}
          </div>
        )}
      </div>
    </animated.div>
  );
};

export default Hero;
