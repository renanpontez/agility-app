'use client';

import { animated, useSpring } from '@react-spring/web';
import classNames from 'classnames';
import React, { type PropsWithChildren, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';

type ParallaxProps = {
  mediaSrc: string;
  className?: string;
  applyMask?: boolean; // Apply a gradient mask over the media
  maskClassName?: string; // Additional class names for the mask
};

const Parallax: React.FC<PropsWithChildren<ParallaxProps>> = ({
  mediaSrc,
  className,
  applyMask = false,
  maskClassName,
  children,
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
        'relative bg-no-repeat bg-fixed bg-center bg-cover',
        className,
      )}
      style={{
        backgroundImage: `url(${mediaSrc})`,
        ...fadeIn,
      }}
    >
      {applyMask && (
        <div className={twMerge('absolute left-0 top-0 z-10 size-full bg-gradient-to-r from-transparent to-black', maskClassName)} />
      )}

      <animated.div
        className="container relative z-20 flex flex-col items-start justify-center text-left md:h-full"
        style={{ ...slideDown }}
      >
        {children}
      </animated.div>
    </animated.div>
  );
};

export default Parallax;
