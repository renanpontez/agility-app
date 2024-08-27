import classNames from 'classnames';
import React from 'react';

type ButtonProps = {
  style: 'primary' | 'secondary' | 'light' | 'dark' | 'link' | 'warning' | 'error';
  onClick?: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
};

const Button: React.FC<ButtonProps> = ({ style, onClick, children, icon, loading, disabled }) => {
  const baseClasses = 'px-4 py-2 font-semibold rounded-xxl focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center';

  const buttonClasses = classNames(baseClasses, {
    'bg-primary text-white hover:bg-primary-dark active:shadow': style === 'primary',
    'bg-secondary text-white hover:bg-secondary-dark active:shadow': style === 'secondary',
    'bg-light text-dark hover:bg-light-dark active:shadow': style === 'light',
    'bg-dark text-white hover:bg-dark-light active:shadow': style === 'dark',
    'text-primary hover:text-primary-dark underline': style === 'link',
    'bg-warning text-white hover:bg-warning-dark active:shadow': style === 'warning',
    'bg-error text-white hover:bg-error-dark active:shadow': style === 'error',
    'opacity-50 cursor-not-allowed': disabled || loading,
  });

  return (
    <button
      type="button"
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading
        ? (
            // TODO: Replace with an appropriate loading spinner
            <span className="mr-3 size-5 animate-spin">🔄</span>
          )
        : (
            <>
              {children}
              {icon && <span className="ml-2">{icon}</span>}
            </>
          )}
    </button>
  );
};

export default Button;
