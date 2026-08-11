'use client';

import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** seconds */
  delay?: number;
  /** initial vertical offset in px */
  y?: number;
  once?: boolean;
};

// ease-out-expo — the premium, decisive settle used across the surface.
const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Scroll-triggered entrance: rise + fade + a touch of blur, settling on an
 * exponential ease-out. Collapses to a plain fade when reduced motion is on.
 * Drop-in replacement for the old IntersectionObserver RevealOnScroll (same
 * children/className/delay surface, but delay is in seconds here).
 */
const Reveal = ({ children, className, delay = 0, y = 26, once = true }: RevealProps) => {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y, filter: 'blur(8px)' }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once, margin: '-12% 0px -12% 0px' }}
      transition={{ duration: 0.75, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;
