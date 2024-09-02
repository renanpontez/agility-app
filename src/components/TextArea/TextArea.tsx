import classNames from 'classnames';
import React from 'react';

import InputErrorLabel from '../Input/InputErrorLabel';

export type TextAreaProps = {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  isInvalid?: boolean;
  className?: string;
  rows?: number; // Number of rows for the textarea
  style?: 'light' | 'dark';
  label?: string;
  required?: boolean;
};

const TextArea: React.FC<TextAreaProps> = ({
  value,
  onChange,
  placeholder,
  isInvalid = false,
  className,
  rows = 4,
  style = 'dark',
  label,
  required,
}) => {
  return (
    <div>
      {label && <label className="mb-2 block pl-3 text-sm font-medium text-white">{label}</label>}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        className={classNames(
          'w-full p-3 rounded-lg focus:outline-none placeholder-secondaryLight text-sm',
          'focus:outline-none focus:shadow-md focus:outline-secondaryDark', // Remove default focus styles

          {
            'bg-white text-black': style === 'light',
            'bg-secondaryDark text-white': style === 'dark',
          },
          {
            'border border-bottom border-red-500': isInvalid,
            'border-gray-300': !isInvalid,
          },
          className,
        )}
      />
      <InputErrorLabel isInvalid={isInvalid} errorMessage="Este campo está inválido" />
    </div>
  );
};

export default TextArea;
