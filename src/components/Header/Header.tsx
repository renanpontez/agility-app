import classNames from 'classnames';
import React from 'react';

import Logo from '@/components/Logo';

import HeaderLink from './HeaderLink';

type HeaderProps = {
  style: 'light' | 'dark' | 'transparent';
  isScrolled?: boolean;
};

const Header: React.FC<HeaderProps> = ({ style, isScrolled = false }) => {
  const headerClasses = classNames(
    'fixed top-0 left-0 w-full z-50 transition-colors duration-300',
    {
      'bg-white text-black': style === 'light',
      'bg-black text-white': style === 'dark',
      'bg-transparent text-white': style === 'transparent',
      'shadow-2xl !bg-secondaryDarker bg-opacity-80': isScrolled,
    },
  );

  return (
    <header className={headerClasses}>
      <div className="container flex items-center justify-between py-4 transition-colors duration-300">
        <div className="flex items-center">
          <Logo showName showSlogan symbolColor="primary" nameSloganColor="white" style="horizontal" size="sm" />
        </div>
        <nav className="flex gap-10">
          <HeaderLink href="#home" text="SOBRE NÓS" />
          <HeaderLink href="#home" text="NOSSAS SOLUÇÕES" />
          <HeaderLink href="#home" text="PORTFOLIO" />
          <HeaderLink href="#home" text="FALE COM A GENTE" />
        </nav>
      </div>

    </header>
  );
};

export default Header;
