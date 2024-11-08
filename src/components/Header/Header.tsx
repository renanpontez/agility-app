'use client';
import { animated, useSpring } from '@react-spring/web';
import classNames from 'classnames';
import React, { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { FaBars } from 'react-icons/fa6';

import Link from '@/components/Link';
import { BrandLoading } from '@/components/Loading';
import Logo from '@/components/Logo';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import useThrottle from '@/hooks/useThrottle';
import { MENU_ITEMS } from '@/utils/Constants';

import Button from '../Button';
import HeaderLink from './HeaderLink';

export type HeaderProps = {
  style: 'light' | 'dark' | 'transparent';
};

// SidebarMenu component
const SidebarMenu: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const linksWrapperRef = React.useRef<HTMLDivElement>(null);

  const handleLinkClick = useThrottle((e: MouseEvent) => {
    if (linksWrapperRef.current && linksWrapperRef.current.contains(e.target as Node)) {
      setIsLoading(true);
      onClose();

      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    }
  }, 150);

  useEffect(() => {
    // If the menu is open and any link is clicked, close the menu
    if (isOpen) {
      document.addEventListener('click', handleLinkClick);
    }

    return () => {
      document.removeEventListener('click', handleLinkClick);
    };
  }, [isOpen, onClose, handleLinkClick]);

  return (
    <>
      <div
        className={classNames(
          'fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out bg-secondaryDarker/90 w-max pr-24 sm:pr-48 pl-8 pt-16 shadow-lg',
          {
            'translate-x-0': isOpen,
            '-translate-x-full': !isOpen,
          },
        )}
      >
        <div className="flex size-full items-start justify-start ">
          <div className="absolute right-2 top-0 flex w-full justify-end pt-2">
            <Button style="basic" onClick={onClose} size="sm" className="text-secondaryLighter" aria-label="Close menu">
              <FaTimes />
            </Button>
          </div>
          <nav className="flex flex-col gap-6 space-y-4 text-left" ref={linksWrapperRef}>
            {MENU_ITEMS.map(item => (
              <HeaderLink
                key={item.title + item.href}
                href={item.href}
                text={item.title}
              />
            ))}
          </nav>
        </div>
      </div>
      {isLoading && <BrandLoading size="fullscreen" />}
    </>

  );
};

const Header: React.FC<HeaderProps> = ({ style }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const [isScrolled, setIsScrolled] = React.useState(false);

  const handleScroll = useThrottle(() => {
    if (window.scrollY > 0) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  }, 500);

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const headerClasses = classNames(
    'fixed top-0 left-0 w-full z-50 transition-colors duration-300',
    {
      'bg-white text-black': style === 'light',
      'bg-black text-white': style === 'dark',
      'bg-transparent text-white': style === 'transparent',
      'shadow-2xl !bg-secondaryDarker/90': isScrolled,
    },
  );

  const [springs, api] = useSpring(() => ({
    from: { opacity: 0, y: -200 },
  }));

  useEffect(() => {
    api.start({ opacity: 1, y: 0, delay: 0 });
  }, [api]);

  const { isMobile, isTablet, isDesktop, isWidescreen } = useBreakpoint();

  return (
    <animated.header
      className={headerClasses}
      style={springs}
    >
      <div className={headerClasses}>
        <div className="container flex items-center justify-between py-4 transition-colors duration-300">
          {(isDesktop || isWidescreen) && (
            <div className=" flex items-center ">
              <Link href="/" aria-label="Agility Homepage">
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
          )}

          <nav className="flex w-full flex-row justify-between lg:w-auto">
            {isMobile || isTablet
              ? (
                  <>
                    <div>
                      <Button style="link" onClick={toggleMenu} aria-label="Open menu">
                        <span className="text-2xl text-white">
                          <FaBars />
                        </span>
                      </Button>
                    </div>
                    <Link href="/" aria-label="Agility Homepage">
                      <Logo
                        symbolColor="primary"
                        nameSloganColor="white"
                        style="horizontal"
                        size="sm"
                        className="size-8"
                      />
                    </Link>
                  </>
                )
              : (
                  <div className="flex gap-10">
                    {MENU_ITEMS.map(item => (
                      <HeaderLink
                        key={item.title + item.href}
                        href={item.href}
                        text={item.title}
                      />
                    ))}
                  </div>
                )}
          </nav>
        </div>

        <SidebarMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      </div>
    </animated.header>
  );
};

export default Header;
