'use client';

import { useEffect, useRef } from 'react';

/**
 * Ambient backdrop for the whole marketing surface: soft, dark glows that
 * drift at different rates as the page scrolls.
 *
 * Deliberately irregular — no two shapes share a size, an aspect, a blur, a
 * tint or a speed, and none of them sit on a grid. They stay at the deep end
 * of the violet ramp (lightness 0.22–0.34, far below the --violet-500
 * accent), so they read as depth in the dark rather than as lit blobs.
 *
 * Positions are hand-tuned constants, not randomised, so the server and the
 * client render the same tree. Under prefers-reduced-motion the parallax is
 * skipped and the field is simply painted where it sits.
 */

type Blob = {
  /** px */
  w: number;
  /** px */
  h: number;
  /** css left */
  x: string;
  /** css top, relative to the viewport; >100% scrolls into view later */
  y: string;
  tint: string;
  blur: number;
  /** fraction of scroll distance travelled — lower reads as further away */
  speed: number;
  /** organic, non-circular silhouette */
  radius: string;
  rotate: number;
  /** dropped on small screens to keep the paint cost down */
  wide?: boolean;
};

const BLOBS: Blob[] = [
  {
    w: 900,
    h: 620,
    x: '52%',
    y: '-18%',
    tint: 'oklch(0.26 0.12 307 / 0.34)',
    blur: 90,
    speed: 0.08,
    radius: '62% 38% 54% 46% / 48% 56% 44% 52%',
    rotate: -12,
  },
  {
    w: 420,
    h: 520,
    x: '-8%',
    y: '26%',
    tint: 'oklch(0.23 0.08 268 / 0.30)',
    blur: 74,
    speed: 0.17,
    radius: '44% 56% 38% 62% / 58% 42% 60% 40%',
    rotate: 18,
  },
  {
    w: 660,
    h: 430,
    x: '68%',
    y: '58%',
    tint: 'oklch(0.22 0.10 310 / 0.32)',
    blur: 110,
    speed: 0.05,
    radius: '58% 42% 66% 34% / 40% 62% 38% 60%',
    rotate: 8,
    wide: true,
  },
  {
    w: 340,
    h: 300,
    x: '22%',
    y: '84%',
    tint: 'oklch(0.31 0.15 306 / 0.22)',
    blur: 66,
    speed: 0.23,
    radius: '52% 48% 40% 60% / 56% 44% 58% 42%',
    rotate: -26,
  },
  {
    w: 780,
    h: 560,
    x: '4%',
    y: '124%',
    tint: 'oklch(0.24 0.11 309 / 0.30)',
    blur: 96,
    speed: 0.11,
    radius: '38% 62% 56% 44% / 62% 38% 54% 46%',
    rotate: 24,
  },
  {
    w: 300,
    h: 380,
    x: '78%',
    y: '146%',
    tint: 'oklch(0.28 0.05 248 / 0.20)',
    blur: 58,
    speed: 0.2,
    radius: '60% 40% 46% 54% / 42% 60% 40% 58%',
    rotate: -8,
    wide: true,
  },
  {
    w: 720,
    h: 640,
    x: '46%',
    y: '182%',
    tint: 'oklch(0.23 0.10 312 / 0.30)',
    blur: 104,
    speed: 0.07,
    radius: '54% 46% 62% 38% / 46% 58% 42% 54%',
    rotate: 14,
  },
  {
    w: 380,
    h: 260,
    x: '10%',
    y: '208%',
    tint: 'oklch(0.34 0.04 84 / 0.11)',
    blur: 72,
    speed: 0.15,
    radius: '46% 54% 52% 48% / 54% 46% 50% 50%',
    rotate: -18,
    wide: true,
  },
  {
    w: 560,
    h: 700,
    x: '70%',
    y: '244%',
    tint: 'oklch(0.25 0.12 305 / 0.28)',
    blur: 88,
    speed: 0.13,
    radius: '40% 60% 44% 56% / 60% 40% 56% 44%',
    rotate: 30,
  },
];

const GRAIN
  = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'140\' height=\'140\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'2\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")';

const ParallaxBlobs = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollY = useRef(0);
  const current = useRef(BLOBS.map(() => 0));
  const raf = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const handleScroll = () => {
      scrollY.current = window.scrollY;
    };

    const animate = () => {
      const children = container.children;

      for (let i = 0; i < children.length; i++) {
        const blob = BLOBS[i];
        const el = children[i] as HTMLElement | undefined;
        if (!blob || !el) {
          continue;
        }
        const targetY = -scrollY.current * blob.speed;
        // Lerp toward the target so the drift lags the scroll slightly; that
        // lag is what sells the depth.
        current.current[i]! += (targetY - current.current[i]!) * 0.06;
        el.style.transform = `translate3d(0, ${current.current[i]!.toFixed(2)}px, 0) rotate(${blob.rotate}deg)`;
      }

      raf.current = requestAnimationFrame(animate);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    raf.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div ref={containerRef} className="absolute inset-0">
        {BLOBS.map((blob, i) => (
          <div
            key={i}
            className={`absolute will-change-transform ${blob.wide ? 'hidden md:block' : ''}`}
            style={{
              width: blob.w,
              height: blob.h,
              left: blob.x,
              top: blob.y,
              borderRadius: blob.radius,
              background: `radial-gradient(closest-side, ${blob.tint} 0%, transparent 78%)`,
              filter: `blur(${blob.blur}px)`,
              transform: `rotate(${blob.rotate}deg)`,
            }}
          />
        ))}
      </div>

      {/* Grain keeps the wide gradients from banding on a near-black surface */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-soft-light"
        style={{ backgroundImage: GRAIN }}
      />

      {/* Vignette seats the content against the ambience */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(125% 95% at 50% 0%, transparent 58%, oklch(0.08 0.012 300 / 0.6) 100%)' }}
      />
    </div>
  );
};

export default ParallaxBlobs;
