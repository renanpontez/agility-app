import classNames from 'classnames';
import React from 'react';
import { twMerge } from 'tailwind-merge';

import { SimpleLoading } from '../Loading';

export type ButtonProps = {
  style: 'primary' | 'secondary' | 'light' | 'dark' | 'link' | 'warning' | 'error' | 'success' | 'outlined' | 'outlined-light';
  onClick?: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  href?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xlg';
  fullWidth?: boolean;
};

const Button: React.FC<ButtonProps> = ({ style, onClick, children, icon, loading, disabled, href, size = 'md', fullWidth = false }) => {
  const Tag = href ? 'a' : 'button';

  const baseClasses = classNames(
    'px-6 py-2 font-normal rounded-lg flex items-center justify-center text-sm tracking-wider',
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
        'text-primary hover:text-primaryDark underline': style === 'link',
        'bg-warning text-white hover:bg-warningDark active:shadow': style === 'warning',
        'bg-error text-white hover:bg-errorDark active:shadow': style === 'error',
        'bg-success text-white hover:bg-successDark active:shadow': style === 'success',
        'bg-transparent text-primary border border-primary hover:bg-primary hover:text-white active:shadow': style === 'outlined',
        'bg-transparent text-white border border-white hover:border-primary hover:text-primary active:shadow-lg active:text-primaryLight active:border-primaryLight': style === 'outlined-light',
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
    ),
  );

  return (
    <Tag
      type="button"
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading
        ? (
          // TODO: Replace with an appropriate loading spinner
            <SimpleLoading size="small" />
          )
        : (
            <>
              {children}
              {icon && <span className="ml-2">{icon}</span>}
            </>
          )}
    </Tag>
  );
};

export default Button;
