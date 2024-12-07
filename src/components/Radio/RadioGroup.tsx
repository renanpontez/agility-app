'use client';

import classNames from 'classnames';
import React, { useState } from 'react';

import List from './List'; // Importar o componente List
import RadioItem from './RadioItem';

export type RadioOption = {
  id: string;
  value: string;
  label: string;
};

export type RadioGroupProps = {
  style: 'primary' | 'secondary';
  defaultValue: string;
  options: RadioOption[];
  className?: string;
};

const RadioGroup: React.FC<RadioGroupProps> = ({ options, style, defaultValue, className }) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue || options[0]?.value);

  const baseClasses = classNames(
    'flex items-center gap-3',
    className,
  );

  return (
    <List
      items={options}
      renderItem={item => (
        <div className={baseClasses} key={item.id}>
          <RadioItem
            style={style}
            id={item.id}
            value={item.value}
            isChecked={item.value === selectedValue}
            onClick={() => setSelectedValue(item.value)}
          />
          <label htmlFor={item.id}>{item.label}</label>
        </div>
      )}
    />
  );
};

export default RadioGroup;
