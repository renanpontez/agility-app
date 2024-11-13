import classNames from 'classnames';
import React from 'react';
import { twMerge } from 'tailwind-merge';

export type SwitchProps = {
  style: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  checked?: boolean;
  onClick: (e: any) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
};

const Switch: React.FC<SwitchProps> = ({ style, className, size = 'sm', label, checked = false, onClick, disabled,
}) => {
  const overallClasses = twMerge(
    classNames(
      'flex w-full gap-2 items-center cursor-pointer',
      {
        'gap-3': size === 'lg',
      },
      className,
    ),
  );
  const buttonClasses = twMerge(
    classNames(
      'rounded-3xl flex items-center justify-end',
      {
        'bg-primary': style === 'primary',
        'bg-secondary': style === 'secondary',
      },
      {
        'w-11 h-6 px-0.5': size === 'sm',
        'w-14 h-8 px-1': size === 'md',
        'w-16 h-9 px-1': size === 'lg',

      },
      !checked && 'bg-lightDark',
    ),
  );
  const switchSlider = classNames(
    'inline-block transform bg-white rounded-full transition-transform ',
    {
      'w-5 h-5': size === 'sm',
      'w-6 h-6': size === 'md',
      'w-7 h-7': size === 'lg',
    },
    !checked && !disabled && {
      '-translate-x-5': size === 'sm',
      '-translate-x-6': size === 'md',
      '-translate-x-7': size === 'lg',
    },
  );

  return (
    <button className={overallClasses} onClick={() => onClick} type="button">
      <div className={buttonClasses}>
        <span className={switchSlider}>
        </span>
      </div>
      <p>{label}</p>
    </button>
  );
};

export default Switch;
