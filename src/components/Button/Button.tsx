import React from 'react';

type ButtonProps = {
  style: 'primary' | 'secondary';
  onClick: () => void;
  children: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({ style, onClick, children }) => {
  const baseClasses = 'px-4 py-2 text-white font-semibold rounded-xxl focus:outline-none focus:ring-2 focus:ring-offset-2';

  const buttonClasses = {
    primary: `${baseClasses} bg-primary`,
    secondary: `${baseClasses} bg-secondary`,
  };

  return (
    <button type="button" className={buttonClasses[style]} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
