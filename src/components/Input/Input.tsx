import classNames from 'classnames';
import type { ChangeEvent, FC, FocusEvent } from 'react';
import React from 'react';

type InputProps = {
  isInvalid?: boolean;
  className?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
  value?: string;
  placeholder?: string;
};

const Input: FC<InputProps> = ({
  isInvalid,
  className,
  onChange,
  onFocus,
  value,
  placeholder,
}) => {
  const inputClass = classNames(
    'border rounded-md px-4 py-2 text-base', // Basic styles
    {
      'border-red-500': isInvalid, // Invalid state styling
      'border-gray-300': !isInvalid, // Normal state styling
    },
    {
      'focus-visible:outline-gray-500': true,
    },
    className,
  );

  return (
    <input
      type="text"
      className={inputClass}
      onChange={onChange}
      onFocus={onFocus}
      value={value}
      placeholder={placeholder}
    />
  );
};

export default Input;
