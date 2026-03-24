'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

import type { NavLink } from './Navbar';

type FooterLink = NavLink;

type ServiceLink = {
  title: string;
  href: string;
};

type V2FooterProps = {
  links?: FooterLink[];
  services?: ServiceLink[];
};

const V2Footer = ({
  links,
  services,
}: V2FooterProps) => {
  const t = useTranslations('Footer');
  const tNav = useTranslations('Navbar');

  const resolvedLinks = links ?? [
    { label: tNav('home'), href: '/' },
    { label: tNav('about'), href: '/sobre-nos' },
    { label: tNav('services'), href: '/#Servicos' },
    { label: tNav('portfolio'), href: '/portfolio' },
  ];

  const resolvedServices = services ?? [
    { title: t('service_sites'), href: '#Servicos' },
    { title: t('service_apps'), href: '#Servicos' },
    { title: t('service_ecommerce'), href: '#Servicos' },
    { title: t('service_consulting'), href: '#Servicos' },
  ];
  return (
    <footer className="border-t border-white/5 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 xl:px-0">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-4 flex items-center gap-2.5">
              <Image src="/assets/images/logo/logo_symbol_white.svg" alt="Agility" width={28} height={28} />
              <Image src="/assets/images/logo/logo_name_white.svg" alt="Agility" width={90} height={24} />
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-white/60">
              {t('tagline')}
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/60">{t('navigation')}</h4>
            <ul className="space-y-2.5">
              {resolvedLinks.map(link => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-white/60 transition-colors hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/60">{t('services')}</h4>
            <ul className="space-y-2.5">
              {resolvedServices.map(s => (
                <li key={s.title}>
                  <a href={s.href} className="text-sm text-white/60 transition-colors hover:text-white">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/60">{t('contact')}</h4>
            <ul className="space-y-2.5">
              <li>
                <a href="mailto:hi@agilitycreative.com" className="text-sm text-white/60 transition-colors hover:text-white">
                  hi@agilitycreative.com
                </a>
              </li>
              <li>
                <a href="tel:+5585996284730" className="text-sm text-white/60 transition-colors hover:text-white">
                  +55 85 99628-4730
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/agilitycreative"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/60 transition-colors hover:text-white"
                >
                  @agilitycreative
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
          <p className="text-xs text-white/60">
            ©
            {' '}
            {new Date().getFullYear()}
            {' '}
            Agility Creative.
            {' '}
            {t('copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default V2Footer;
