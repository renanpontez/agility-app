import classNames from 'classnames';
import React from 'react';
import { twMerge } from 'tailwind-merge';

export type CardProps = {
  radius?: 'sm' | 'md' | 'lg'; // Allows different border-radius options
  shadow?: 'sm' | 'md' | 'lg'; // Allows different shadow options
  className?: string; // Additional class names
  children?: React.ReactNode; // Content inside the card
  style?: 'dark' | 'light' | 'outlined-light' | 'outlined-gray'; // Style of the card
  backgroundImage?: string; // URL for the background image
};

const Card: React.FC<CardProps> = ({
  radius = 'lg',
  shadow = 'sm',
  className,
  children,
  style = 'dark',
  backgroundImage,
}) => {
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
      'p-4 relative', // Shared styles
      { 'bg-secondaryDark text-white': style === 'dark' && !backgroundImage }, // Default dark background
      { 'bg-white text-dark': style === 'light' && !backgroundImage }, // Default light background
      { 'bg-transparent border border-white': style === 'outlined-light' },
      { 'bg-transparent border border-2 border-secondaryDark': style === 'outlined-gray' },
      radiusClasses, // Apply the radius class
      shadowClasses, // Apply the shadow class
      className, // Allow for additional custom classes
    ),
  );

  const backgroundStyle = backgroundImage
    ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : undefined;

  return (
    <div
      className={cardClassNames}
      style={backgroundStyle} // Inline styles for background image
    >
      {children}
    </div>
  );
};

export default Card;
