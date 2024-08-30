import classNames from 'classnames';
import React from 'react';

import { SimpleLoading } from '../Loading';

type ButtonProps = {
  style: 'primary' | 'secondary' | 'light' | 'dark' | 'link' | 'warning' | 'error';
  onClick?: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  href?: string;
};

const Button: React.FC<ButtonProps> = ({ style, onClick, children, icon, loading, disabled, href }) => {
  const Tag = href ? 'a' : 'button';
  const baseClasses = 'px-4 py-2 font-semibold rounded-xxl focus:outline-none focus:ring-0 flex items-center justify-center transition-colors duration-200';

  const buttonClasses = classNames(baseClasses, {
    'bg-primary text-white hover:bg-primaryDark active:shadow': style === 'primary',
    'bg-secondary text-white hover:bg-secondaryDark active:shadow': style === 'secondary',
    'bg-light text-dark hover:bg-lightDark active:shadow': style === 'light',
    'bg-dark text-white hover:bg-darkLight active:shadow': style === 'dark',
    'text-primary hover:text-primaryDark underline': style === 'link',
    'bg-warning text-white hover:bg-warningDark active:shadow': style === 'warning',
    'bg-error text-white hover:bg-errorDark active:shadow': style === 'error',
    'opacity-50 cursor-not-allowed': disabled || loading,
  });

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
