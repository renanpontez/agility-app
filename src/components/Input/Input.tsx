import classNames from 'classnames';
import type { ChangeEvent, FC, FocusEvent } from 'react';
import React from 'react';

import InputErrorLabel from './InputErrorLabel';

type InputProps = {
  isInvalid?: boolean;
  className?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
  value?: string;
  placeholder?: string;
  type?: string;
  style?: 'light' | 'dark';
  label?: string;
};

const Input: FC<InputProps> = ({
  isInvalid,
  className,
  onChange,
  onFocus,
  value,
  placeholder,
  type = 'text',
  style = 'dark',
  label,
}) => {
  const inputClass = classNames(
    'rounded-md px-3 py-3 text-sm placeholder-secondaryLight w-full', // Basic styles
    'focus:outline-none focus:shadow-md focus:outline-secondaryDark', // Remove default focus styles
    {
      'border border-error': isInvalid, // Invalid state styling
    },
    {
      'bg-white text-black': style === 'light',
      'bg-secondaryDark text-white': style === 'dark',
    },
    className,
  );

  return (
    <div>
      {label && <label className="mb-2 block pl-3 text-sm font-medium text-white">{label}</label>}
      <input
        type={type}
        className={inputClass}
        onChange={onChange}
        onFocus={onFocus}
        value={value}
        placeholder={placeholder}
      />
      <InputErrorLabel isInvalid={isInvalid} errorMessage="Este campo está inválido" />
    </div>
  );
};

export default Input;
