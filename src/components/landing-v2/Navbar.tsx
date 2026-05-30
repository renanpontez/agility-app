'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import LocaleSwitcher from '@/components/LocaleSwitcher';
import { Link } from '@/libs/i18nNavigation';

export type NavLink = {
  label: string;
  href: string;
};

type V2NavbarProps = {
  links?: NavLink[];
  ctaLabel?: string;
  ctaHref?: string;
};

const isHashOrExternal = (href: string) => href.startsWith('#') || href.startsWith('http') || href.includes('#');

const NavLinkItem = ({ href, className, onClick, children }: {
  href: string;
  className: string;
  onClick?: () => void;
  children: React.ReactNode;
}) => {
  // Hash / cross-section anchors must stay native <a> — next-intl's Link rewrites
  // them with the active locale and breaks scroll behaviour. Internal routes go
  // through the locale-aware Link so navigation preserves the active language.
  if (isHashOrExternal(href)) {
    return (
      <a href={href} className={className} onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
};

const V2Navbar = ({
  links,
  ctaLabel,
  ctaHref = '#Contato',
}: V2NavbarProps) => {
  const t = useTranslations('Navbar');
  const [menuOpen, setMenuOpen] = useState(false);

  const resolvedLinks = links ?? [
    { label: t('home'), href: '/' },
    { label: t('about'), href: '/sobre-nos' },
    { label: t('services'), href: '/#Servicos' },
    { label: t('portfolio'), href: '/portfolio' },
  ];
  const resolvedCtaLabel = ctaLabel ?? t('cta');

  return (
    <nav className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/10 bg-black/10 px-5 py-3 shadow-sm backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/assets/images/logo/logo_symbol_white.svg" alt="Agility" width={28} height={28} />
          <Image src="/assets/images/logo/logo_name_white.svg" alt="Agility" width={90} height={24} className="hidden sm:block" />
        </Link>
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-8 md:flex">
            {resolvedLinks.map(link => (
              <NavLinkItem
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-white/60 transition-colors hover:text-white"
              >
                {link.label}
              </NavLinkItem>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <LocaleSwitcher className="hidden sm:flex" />
            <NavLinkItem
              href={ctaHref}
              className="rounded-full bg-primaryDark px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
            >
              {resolvedCtaLabel}
            </NavLinkItem>
            <button
              className="flex size-9 items-center justify-center rounded-full border border-white/10 text-white md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
              type="button"
              aria-label="Menu"
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="mx-auto mt-2 max-w-6xl rounded-2xl border border-white/10 bg-black/90 p-4 backdrop-blur-lg md:hidden">
          {resolvedLinks.map(link => (
            <NavLinkItem
              key={link.href}
              href={link.href}
              className="block rounded-lg px-4 py-3 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLinkItem>
          ))}
          <div className="mt-3 flex justify-center border-t border-white/10 pt-3">
            <LocaleSwitcher />
          </div>
        </div>
      )}
    </nav>
  );
};

export default V2Navbar;
