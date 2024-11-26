import classNames from 'classnames';
import React from 'react';
import { twMerge } from 'tailwind-merge';

import { SimpleLoading } from '../Loading';

export type ButtonProps = {
  style: 'primary' | 'secondary' | 'light' | 'dark' | 'link' | 'warning' | 'error' | 'success' | 'outlined' | 'outlined-light' | 'basic' | 'outlined-gray';
  onClick?: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconRight?: boolean; // Nova prop para controlar a posição do ícone
  loading?: boolean;
  disabled?: boolean;
  href?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xlg';
  fullWidth?: boolean;
  className?: string;
};

const Button: React.FC<ButtonProps> = ({
  style,
  onClick,
  children,
  icon,
  iconRight = false, // Valor padrão como falso
  loading,
  disabled,
  href,
  size = 'md',
  fullWidth = false,
  className,
  ...rest
}) => {
  const Tag = href ? 'a' : 'button';

  const baseClasses = classNames(
    'px-6 py-2 font-semibold rounded-lg flex items-center justify-center text-sm tracking-wider',
    'transition duration-200 ease-in-out focus:outline-none focus:ring-0',
  );

  const buttonClasses = twMerge(
    classNames(
      baseClasses,
      {
        'bg-primary text-white hover:bg-primaryDark active:shadow': style === 'primary',
        'bg-secondary text-white hover:bg-secondaryDark active:shadow': style === 'secondary',
        'bg-light text-dark hover:bg-lightDark active:shadow': style === 'light',
        'bg-dark text-white hover:bg-darkLight active:shadow': style === 'dark',
        'text-primaryLighter hover:text-white underline': style === 'link',
        'bg-warning text-white hover:bg-warningDark active:shadow': style === 'warning',
        'bg-error text-white hover:bg-errorDark active:shadow': style === 'error',
        'bg-success text-white hover:bg-successDark active:shadow': style === 'success',
        'bg-transparent text-primaryLight border border-primaryLight hover:bg-primary hover:text-white active:shadow': style === 'outlined',
        'bg-transparent text-white border border-white hover:bg-white hover:text-primary active:shadow-lg': style === 'outlined-light',
        'bg-transparent text-secondaryLighter border border-secondaryDark hover:border-white hover:text-white active:shadow-lg': style === 'outlined-gray',
        'bg-transparent text-white hover:text-primary active:shadow-none': style === 'basic',
        'opacity-50 cursor-not-allowed': disabled || loading,
      },
      {
        'text-xs px-4 py-1': size === 'xs',
        'text-xs px-6 py-2': size === 'sm',
        'text-sm px-6 py-2': size === 'md',
        'text-sm px-10 py-3': size === 'lg',
        'text-md px-10 py-4': size === 'xlg',
      },
      { 'w-full': fullWidth },
      className,
    ),
  );

  return (
    <Tag
      type="button"
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      role="button"
      {...rest}
    >
      {loading
        ? (
            <SimpleLoading size="small" />
          )
        : (
            <>
              {!iconRight && icon && <span className="mr-2">{icon}</span>}
              {children}
              {iconRight && icon && <span className="ml-2">{icon}</span>}
            </>
          )}
    </Tag>
  );
};

export default Button;
