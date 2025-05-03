'use client';

import type { PropsWithChildren } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

type ParallaxProps = {
  mediaSrc: string;
  className?: string;
  applyMask?: boolean;
  maskClassName?: string;
  height?: string;
  intensity?: number;
};

const Parallax: React.FC<PropsWithChildren<ParallaxProps>> = ({
  mediaSrc,
  className,
  applyMask = false,
  maskClassName,
  height = 'h-[70vh]',
  intensity = 150,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) {
        return;
      }

      const { top, height } = containerRef.current.getBoundingClientRect();
      const scrollPosition = window.scrollY + window.innerHeight;
      const elementPosition = top + window.scrollY;

      // Calculate progress (0 when top is at bottom of viewport, 1 when bottom is at top of viewport)
      const progress = (scrollPosition - elementPosition) / (window.innerHeight + height);

      setOffsetY(progress * intensity);
    };

    // Add event listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial calculation
    handleScroll();

    // Clean up
    return () => window.removeEventListener('scroll', handleScroll);
  }, [intensity]);

  return (
    <div
      ref={containerRef}
      className={twMerge(
        'relative w-full overflow-hidden',
        height,
        className,
      )}
    >
      {/* Background image with parallax effect */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${mediaSrc})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          height: '150%',
          transform: `translateY(-${offsetY}px)`,
          willChange: 'transform',
        }}
      />

      {/* Optional mask */}
      {applyMask && (
        <div
          className={twMerge(
            'pointer-events-none absolute inset-0 z-10',
            maskClassName || 'bg-gradient-to-l from-black/30 to-black/70',
          )}
        />
      )}

      {/* Content */}
      <div className="relative z-20 size-full">
        {children}
      </div>
    </div>
  );
};

export default Parallax;
