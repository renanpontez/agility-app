'use client';
import classNames from 'classnames';
import React from 'react';

import Link from '@/components/Link';
import Logo from '@/components/Logo';
import { MENU_ITEMS } from '@/utils/Constants';

import HeaderLink from './HeaderLink';

export type HeaderProps = {
  style: 'light' | 'dark' | 'transparent';
};

const Header: React.FC<HeaderProps> = ({ style }) => {
  const [isScrolled, setIsScrolled] = React.useState(false);
  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
          <Link href="/">
            <Logo
              showName
              showSlogan
              symbolColor="primary"
              nameSloganColor="white"
              style="horizontal"
              size="sm"
            />
          </Link>
        </div>
        <nav className="">
          <div className="invisible flex gap-10 md:visible">
            {MENU_ITEMS.map(item => (
              <HeaderLink
                key={item.title + item.href}
                href={item.href}
                text={item.title}
              />
            ))}
          </div>
        </nav>
      </div>

    </header>
  );
};

export default Header;
