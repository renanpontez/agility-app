'use client';

import Image from 'next/image';
import { useState } from 'react';

export type NavLink = {
  label: string;
  href: string;
};

type V2NavbarProps = {
  links?: NavLink[];
  ctaLabel?: string;
  ctaHref?: string;
};

const DEFAULT_LINKS: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Sobre', href: '/sobre-nos' },
  { label: 'Serviços', href: '/#Servicos' },
  { label: 'Portfólio', href: '/portfolio' },
];

const V2Navbar = ({
  links = DEFAULT_LINKS,
  ctaLabel = 'Fale conosco',
  ctaHref = '#Contato',
}: V2NavbarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/10 bg-black/10 px-5 py-3 shadow-sm backdrop-blur-md">
        <a href="/" className="flex items-center gap-2.5">
          <Image src="/assets/images/logo/logo_symbol_white.svg" alt="Agility" width={28} height={28} />
          <Image src="/assets/images/logo/logo_name_white.svg" alt="Agility" width={90} height={24} className="hidden sm:block" />
        </a>
        <div className="flex gap-4">
          <div className="hidden items-center gap-8 md:flex">
            {links.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-white/60 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a
              href={ctaHref}
              className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
            >
              {ctaLabel}
            </a>
            <button
              className="flex size-9 items-center justify-center rounded-full border border-white/10 text-white/70 md:hidden"
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
          {links.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="block rounded-lg px-4 py-3 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default V2Navbar;
