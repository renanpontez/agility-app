'use client';

import Image from 'next/image';

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

const DEFAULT_LINKS: FooterLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Sobre', href: '/sobre-nos' },
  { label: 'Serviços', href: '/#Servicos' },
  { label: 'Portfólio', href: '/portfolio' },
];

const DEFAULT_SERVICES: ServiceLink[] = [
  { title: 'Sites & Landing Pages', href: '#Servicos' },
  { title: 'Aplicativos & Jogos', href: '#Servicos' },
  { title: 'Lojas Virtuais & E-commerce', href: '#Servicos' },
  { title: 'Consultoria & Tecnologia', href: '#Servicos' },
];

const V2Footer = ({
  links = DEFAULT_LINKS,
  services = DEFAULT_SERVICES,
}: V2FooterProps) => {
  return (
    <footer className="border-t border-white/5 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 xl:px-0">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-4 flex items-center gap-2.5">
              <Image src="/assets/images/logo/logo_symbol_white.svg" alt="Agility" width={28} height={28} />
              <Image src="/assets/images/logo/logo_name_white.svg" alt="Agility" width={90} height={24} />
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-white/40">
              Soluções que inspiram. Transformando ideias em experiências únicas e poderosas.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/60">Navegação</h4>
            <ul className="space-y-2.5">
              {links.map(link => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-white/40 transition-colors hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/60">Serviços</h4>
            <ul className="space-y-2.5">
              {services.map(s => (
                <li key={s.title}>
                  <a href={s.href} className="text-sm text-white/40 transition-colors hover:text-white">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/60">Contato</h4>
            <ul className="space-y-2.5">
              <li>
                <a href="mailto:hi@agilitycreative.com" className="text-sm text-white/40 transition-colors hover:text-white">
                  hi@agilitycreative.com
                </a>
              </li>
              <li>
                <a href="tel:+5585996284730" className="text-sm text-white/40 transition-colors hover:text-white">
                  +55 85 99628-4730
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/agilitycreative"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/40 transition-colors hover:text-white"
                >
                  @agilitycreative
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
          <p className="text-xs text-white/30">
            ©
            {' '}
            {new Date().getFullYear()}
            {' '}
            Agility Creative. Todos os direitos reservados.
          </p>
          <p className="text-xs text-white/20">
            Feito com dedicação para cada projeto.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default V2Footer;
