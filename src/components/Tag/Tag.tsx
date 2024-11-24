import classNames from 'classnames';
import React from 'react';

type TagProps = {
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  iconRight?: boolean;
  style?: 'light' | 'dark';
  children: React.ReactNode;
};

const Tag: React.FC<TagProps> = ({
  icon,
  size = 'md',
  iconRight = false,
  style = 'dark',
  children,
}) => {
  const baseClasses
    = 'inline-flex items-center rounded-2xl font-medium transition duration-200 shadow-lg shadow-gray-950';
  const sizeClasses = {
    sm: 'text-sm px-2 py-1',
    md: 'text-base px-5 py-2',
    lg: 'text-lg px-7 py-3',
  };

  const styleClasses = {
    light: 'bg-light text-dark hover:bg-lightDark',
    dark: 'bg-dark text-white hover:bg-darkLight',
  };

  return (
    <div
      className={classNames(
        baseClasses,
        sizeClasses[size],
        styleClasses[style],
      )}
    >
      {!iconRight && icon && (
        <span className="mr-2 flex items-center justify-center ">
          {icon}
        </span>
      )}
      {children}
      {iconRight && icon && (
        <span className="ml-2 flex items-center justify-center">
          {icon}
        </span>
      )}
    </div>
  );
};

export default Tag;
