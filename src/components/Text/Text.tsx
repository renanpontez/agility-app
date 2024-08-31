import classNames from 'classnames';
import type { FC, ReactNode } from 'react';
import React from 'react';
import { twMerge } from 'tailwind-merge';

type TextProps = {
  as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'p' | 'em' | 'blockquote';
  styleOverride?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'p' | 'em' | 'blockquote';
  decoration?: 'italic' | 'bold' | 'strike';
  className?: string;
  children: ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
};

const Text: FC<TextProps> = ({ as = 'p', styleOverride, decoration, className, children, size }) => {
  const Tag = as;
  const baseClasses = classNames(
    'font-poppins leading-normal tracking-wide text-white transition-colors duration-300 ease-in-out',
    {
      'italic': decoration === 'italic',
      'font-bold': decoration === 'bold',
      'line-through': decoration === 'strike',
    },
  );

  const elementStyles: Record<TextProps['as'], string> = {
    h1: classNames(baseClasses, 'text-4xl font-bold'),
    h2: classNames(baseClasses, 'text-3xl font-semibold'),
    h3: classNames(baseClasses, 'text-2xl font-semibold'),
    h4: classNames(baseClasses, 'text-xl font-semibold'),
    h5: classNames(baseClasses, 'text-lg font-normal'),
    p: classNames(baseClasses, 'text-base leading-relaxed'),
    em: classNames(baseClasses, 'italic text-xs font-regular tracking-normal'),
    blockquote: classNames(baseClasses, 'border-l-4 pl-4 text-lg italic text-muted-foreground'),
  };

  const sizeClasses: Record<string, string> = {
    'xs': 'text-xs',
    'sm': 'text-sm',
    'md': 'text-base',
    'lg': 'text-lg',
    'xl': 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
  };

  const textClasses = twMerge(elementStyles[styleOverride ?? as], size && sizeClasses[size], className);

  return (
    <Tag className={textClasses}>
      {children}
    </Tag>
  );
};

export default Text;
