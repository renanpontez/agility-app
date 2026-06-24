'use client';

import type { ButtonHTMLAttributes } from 'react';
import { forwardRef } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
};

const base
  = 'inline-flex select-none items-center justify-center gap-2 rounded-full font-semibold tracking-tight transition-transform duration-150 ease-out active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50';

const variants = {
  primary: 'bg-gradient-to-b from-amber-300 to-amber-500 text-stone-900 shadow-[0_10px_30px_-12px_rgba(245,158,11,0.6)] hover:from-amber-200 hover:to-amber-400',
  secondary: 'bg-white/10 text-white ring-1 ring-white/15 hover:bg-white/15',
  ghost: 'text-white/70 hover:text-white',
  danger: 'bg-rose-600 text-white hover:bg-rose-500',
} as const;

const sizes = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-[15px]',
  lg: 'h-14 px-8 text-base',
} as const;

const PrimaryButton = forwardRef<HTMLButtonElement, Props>(
  ({ className = '', variant = 'primary', size = 'md', children, ...rest }, ref) => (
    <button
      ref={ref}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  ),
);

PrimaryButton.displayName = 'PrimaryButton';

export default PrimaryButton;
