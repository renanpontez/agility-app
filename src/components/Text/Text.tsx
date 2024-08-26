import classNames from 'classnames';
import type { FC, ReactNode } from 'react';
import React from 'react';

type TextProps = {
  as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'p' | 'em' | 'blockquote';
  decoration?: 'italic' | 'bold' | 'strike';
  className?: string;
  children: ReactNode;
};

const Text: FC<TextProps> = ({ as, decoration, className, children }) => {
  const Tag = as;
  const baseClasses = classNames(
    'font-poppins',
    {
      'italic': decoration === 'italic',
      'font-bold': decoration === 'bold',
      'line-through': decoration === 'strike',
    },
    className,
  );

  const elementStyles: Record<TextProps['as'], string> = {
    h1: classNames(baseClasses, 'text-4xl font-bold tracking-tight'),
    h2: classNames(baseClasses, 'text-3xl font-semibold tracking-tight'),
    h3: classNames(baseClasses, 'text-2xl font-semibold tracking-tight'),
    h4: classNames(baseClasses, 'text-xl font-semibold tracking-tight'),
    h5: classNames(baseClasses, 'text-lg font-semibold tracking-tight'),
    p: classNames(baseClasses, 'text-base leading-relaxed'),
    em: classNames(baseClasses, 'italic text-sm font-medium'),
    blockquote: classNames(baseClasses, 'border-l-4 pl-4 text-lg italic text-muted-foreground'),
  };

  return <Tag className={elementStyles[as]}>{children}</Tag>;
};

export default Text;
