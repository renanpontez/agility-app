'use client';

import { useEffect, useRef } from 'react';

const blobs = [
  { size: 700, x: '60%', y: '-15%', color: 'rgba(188, 1, 253, 0.12)', speed: 0.6, blur: 110 },
  { size: 350, x: '-5%', y: '40%', color: 'rgba(218, 113, 255, 0.1)', speed: 0.45, blur: 130 },
  { size: 500, x: '80%', y: '80%', color: 'rgba(188, 1, 253, 0.08)', speed: 0.7, blur: 90 },
  { size: 280, x: '30%', y: '10%', color: 'rgba(134, 26, 171, 0.09)', speed: 0.5, blur: 140 },
  { size: 420, x: '15%', y: '90%', color: 'rgba(188, 1, 253, 0.07)', speed: 0.55, blur: 120 },
  { size: 450, x: '35%', y: '45%', color: 'rgba(188, 1, 253, 0.1)', speed: 0.5, blur: 100 },
];

const ParallaxBlobs = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollY = useRef(0);
  const current = useRef(blobs.map(() => 0));
  const raf = useRef<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      scrollY.current = window.scrollY;
    };

    const animate = () => {
      if (!containerRef.current) {
        raf.current = requestAnimationFrame(animate);
        return;
      }
      const children = containerRef.current.children;

      for (let i = 0; i < children.length; i++) {
        const blob = blobs[i];
        if (!blob) {
          continue;
        }
        const targetY = -scrollY.current * blob.speed;
        current.current[i]! += (targetY - current.current[i]!) * 0.03;
        const el = children[i] as HTMLElement;
        el.style.transform = `translate3d(0, ${current.current[i]}px, 0)`;
      }

      raf.current = requestAnimationFrame(animate);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    raf.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div ref={containerRef} className="pointer-events-none fixed inset-0 z-[5] hidden overflow-hidden md:block">
      {blobs.map((blob, i) => (
        <div
          key={i}
          className="absolute rounded-full will-change-transform"
          style={{
            width: blob.size,
            height: blob.size,
            left: blob.x,
            top: blob.y,
            background: `radial-gradient(circle, ${blob.color} 0%, transparent 70%)`,
            filter: `blur(${blob.blur}px)`,
          }}
        />
      ))}
    </div>
  );
};

export default ParallaxBlobs;
