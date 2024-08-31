import classNames from 'classnames';
import React from 'react';
import { twMerge } from 'tailwind-merge';

export type CardProps = {
  radius?: 'sm' | 'md' | 'lg'; // Allows different border-radius options
  shadow?: 'sm' | 'md' | 'lg'; // Allows different border-radius options
  className?: string; // Additional class names
  children?: React.ReactNode; // Content inside the card
  style?: 'dark' | 'light'; // Style of the card
};

const Card: React.FC<CardProps> = ({ radius = 'lg', className, children, shadow = 'sm', style = 'dark' }) => {
  // Define the border-radius classes based on the prop
  const radiusClasses = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg', // Using the default radius from Tailwind config
  }[radius];

  const shadowClasses = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  }[shadow];

  const cardClassNames = twMerge(
    classNames(
      'p-4', // Shared styles
      { 'bg-secondaryDark text-white': style === 'dark' }, // Default dark background and padding
      { 'bg-white text-dark': style === 'light' }, // Default dark background and padding
      radiusClasses, // Apply the radius class
      shadowClasses, // Apply the shadow class
      className, // Allow for additional custom classes
    ),
  );

  return (
    <div
      className={cardClassNames}
    >
      {children}
    </div>
  );
};

export default Card;
