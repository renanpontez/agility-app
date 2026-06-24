'use client';

import { animate } from 'motion/react';
import { useEffect, useRef } from 'react';

type Props = {
  value: number;
  durationSec?: number;
  format?: (n: number) => string;
  className?: string;
};

const defaultFormat = (n: number) =>
  new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(Math.round(n));

// Drives a number tween via Motion without re-rendering on every frame —
// writes directly to the DOM node's textContent. Snaps for prefers-reduced
// motion is handled by the caller (just pass durationSec=0).
export default function DigitCounter({ value, durationSec = 0.8, format = defaultFormat, className = '' }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const prevRef = useRef(value);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    const from = prevRef.current;
    const to = value;
    prevRef.current = to;
    if (durationSec <= 0 || from === to) {
      ref.current.textContent = format(to);
      return;
    }
    const node = ref.current;
    const controls = animate(from, to, {
      duration: durationSec,
      ease: 'easeOut',
      onUpdate: (v) => {
        node.textContent = format(v);
      },
    });
    return () => controls.stop();
  }, [value, durationSec, format]);

  return <span ref={ref} className={className}>{format(value)}</span>;
}
