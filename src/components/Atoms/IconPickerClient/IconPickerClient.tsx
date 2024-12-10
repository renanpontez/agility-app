'use client';

import React from 'react';
import * as FaIcons from 'react-icons/fa'; // Importa todos os ícones Fa*
import { twMerge } from 'tailwind-merge';

type IconPickerClientProps = {
  iconName: keyof typeof FaIcons;
  classNames?: string;
};

const IconPickerClient: React.FC<IconPickerClientProps> = ({ iconName, classNames }) => {
  const IconComponent = FaIcons[iconName as keyof typeof FaIcons];

  return (
    <IconComponent className={twMerge('text-4xl text-blue-500', classNames)} />
  );
};

export default IconPickerClient;
