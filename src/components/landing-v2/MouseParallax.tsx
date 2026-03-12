'use client';

import type { ReactNode } from 'react';
import { useCallback, useEffect, useRef } from 'react';

type MouseParallaxProps = {
  children: ReactNode;
  className?: string;
  /** How much the element moves relative to mouse (higher = more) */
  intensity?: number;
  /** Adds a subtle float animation on top */
  floatDuration?: number;
  floatDelay?: number;
};

const MouseParallax = ({
  children,
  className = '',
  intensity = 1,
  floatDuration = 4,
  floatDelay = 0,
}: MouseParallaxProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const raf = useRef<number>(0);

  const lerp = useCallback(() => {
    pos.current.x += (target.current.x - pos.current.x) * 0.015;
    pos.current.y += (target.current.y - pos.current.y) * 0.015;

    if (ref.current) {
      ref.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
    }

    raf.current = requestAnimationFrame(lerp);
  }, []);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      target.current = {
        x: ((e.clientX - cx) / cx) * 20 * intensity,
        y: ((e.clientY - cy) / cy) * 15 * intensity,
      };
    };

    window.addEventListener('mousemove', handleMouse, { passive: true });
    raf.current = requestAnimationFrame(lerp);

    return () => {
      window.removeEventListener('mousemove', handleMouse);
      cancelAnimationFrame(raf.current);
    };
  }, [intensity, lerp]);

  return (
    <div
      className={className}
      style={{
        animation: `float ${floatDuration}s ease-in-out ${floatDelay}s infinite`,
      }}
    >
      <div ref={ref} className="will-change-transform">
        {children}
      </div>
    </div>
  );
};

export default MouseParallax;
