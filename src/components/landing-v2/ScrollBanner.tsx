'use client';

import { useEffect, useRef } from 'react';

type ScrollBannerProps = {
  text?: string;
  multiplier?: number;
};

const ScrollBanner = ({
  text = 'CREATIVE • DIGITAL • INNOVATION •',
  multiplier = 4,
}: ScrollBannerProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const pos = useRef(0);
  const target = useRef(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      target.current = progress * -3000;
    };

    const animate = () => {
      pos.current += (target.current - pos.current) * 0.04;
      if (ref.current) {
        ref.current.style.transform = `translate3d(${pos.current}px, 0, 0)`;
      }
      raf.current = requestAnimationFrame(animate);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    raf.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <section className="overflow-hidden py-10">
      <div ref={ref} className="flex whitespace-nowrap will-change-transform">
        {[...Array(multiplier)].map((_, i) => (
          <span
            key={i}
            className="mx-6 text-5xl font-bold tracking-wider text-transparent sm:mx-8 sm:text-7xl"
            style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.08)' }}
          >
            {text}
          </span>
        ))}
      </div>
    </section>
  );
};

export default ScrollBanner;
