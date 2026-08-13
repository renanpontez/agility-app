'use client';

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import type { ReactNode } from 'react';
import { useRef } from 'react';

type MagneticButtonProps = {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'ghost' | 'metal';
  className?: string;
  external?: boolean;
};

const base
  = 'group relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-colors duration-300 will-change-transform';

const variants: Record<NonNullable<MagneticButtonProps['variant']>, string> = {
  primary: 'bg-white text-ink hover:bg-white/90',
  ghost: 'border border-white/15 text-white/85 hover:border-white/35 hover:text-white',
  metal: 'text-ink',
};

/**
 * A button that leans toward the cursor (magnetic pull) with a soft violet
 * aura on hover. Pull + glow are disabled under prefers-reduced-motion.
 */
const MagneticButton = ({ href, children, variant = 'primary', className = '', external }: MagneticButtonProps) => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(my, { stiffness: 220, damping: 18, mass: 0.4 });
  const rangeX = useTransform(x, v => v * 0.35);
  const rangeY = useTransform(y, v => v * 0.35);

  const handleMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (reduce || !ref.current) {
      return;
    }
    const rect = ref.current.getBoundingClientRect();
    mx.set(e.clientX - (rect.left + rect.width / 2));
    my.set(e.clientY - (rect.top + rect.height / 2));
  };

  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={reduce ? undefined : { x: rangeX, y: rangeY }}
      className={`${base} ${variants[variant]} ${className}`}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {variant === 'metal' && (
        <span
          aria-hidden
          className="absolute inset-0 rounded-full"
          style={{ background: 'var(--grad-champagne)' }}
        />
      )}
      {/* Hover aura */}
      <span
        aria-hidden
        className="absolute -inset-2 -z-10 rounded-full opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: 'radial-gradient(closest-side, oklch(0.62 0.29 309 / 0.55), transparent)' }}
      />
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </motion.a>
  );
};

export default MagneticButton;
