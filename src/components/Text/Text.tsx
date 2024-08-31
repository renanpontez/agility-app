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
};

const Text: FC<TextProps> = ({ as = 'p', styleOverride, decoration, className, children }) => {
  const Tag = as;
  const baseClasses = classNames(
    'font-poppins leading-normal tracking-wide text-white',
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
    h5: classNames(baseClasses, 'text-lg font-semibold'),
    p: classNames(baseClasses, 'text-base leading-relaxed'),
    em: classNames(baseClasses, 'italic text-xs font-regular tracking-normal'),
    blockquote: classNames(baseClasses, 'border-l-4 pl-4 text-lg italic text-muted-foreground'),
  };

  return <Tag className={twMerge(elementStyles[styleOverride ?? as], className)}>{children}</Tag>;
};

export default Text;
