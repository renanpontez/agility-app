'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

const WHATSAPP_NUMBER = '5585996284730';
const WHATSAPP_GREETING = 'Olá! Vim pelo link do bio.';
const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_GREETING)}`;

const INSTAGRAM_URL = 'https://instagram.com/agilitycreative';

// Subtle ease curve that matches the rest of the site's motion language.
const EASE = [0.22, 1, 0.36, 1] as const;

const SiteIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3a13.5 13.5 0 0 1 0 18M12 3a13.5 13.5 0 0 0 0 18" />
  </svg>
);

const BlogIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h11A1.5 1.5 0 0 1 18 5.5V20l-3-2-3 2-3-2-3 2-2-1V5.5z" />
    <path d="M8 9h6M8 13h6M8 17h4" />
  </svg>
);

// Brand-accurate WhatsApp glyph (simplified — keeps load light, no extra dep).
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden>
    <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9s-.5-.1-.7.1-.8 1-1 1.2-.3.2-.6.1c-1.7-.8-2.8-1.5-4-3.4-.3-.5.3-.5.9-1.7.1-.2 0-.4 0-.5 0-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4s-1 1-1 2.4 1.1 2.8 1.2 3 2.1 3.2 5 4.4c1.8.7 2.5.8 3.4.7.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.2-.3-.3-.6-.4z" />
    <path d="M20.5 3.5A11.5 11.5 0 0 0 4.4 19.6L3 23l3.5-.9a11.5 11.5 0 0 0 14-17.6zm-8.5 17a9.4 9.4 0 0 1-4.8-1.3l-.3-.2-2.7.7.7-2.7-.2-.3a9.4 9.4 0 1 1 7.3 3.8z" />
  </svg>
);

const Arrow = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

type LinkRowProps = {
  href: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  external?: boolean;
  accent?: boolean;
};

const LinkRow = ({ href, label, description, icon, external, accent }: LinkRowProps) => (
  <a
    href={href}
    target={external ? '_blank' : undefined}
    rel={external ? 'noopener noreferrer' : undefined}
    className={`group flex items-center gap-4 rounded-2xl border px-4 py-4 transition-all duration-300 sm:px-5 ${
      accent
        ? 'border-primary/40 bg-primary/10 text-white hover:-translate-y-0.5 hover:border-primary/60 hover:bg-primary/15 hover:shadow-[0_18px_40px_-18px_rgba(253,81,46,0.55)]'
        : 'border-white/10 bg-white/[0.03] text-white hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.06] hover:shadow-[0_18px_40px_-22px_rgba(0,0,0,0.6)]'
    }`}
  >
    <span
      className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${
        accent ? 'bg-primary text-white' : 'bg-white/[0.06] text-white'
      } transition-transform duration-300 group-hover:scale-105`}
    >
      {icon}
    </span>
    <span className="min-w-0 flex-1">
      <span className="block text-[15px] font-semibold leading-tight tracking-tight text-white">
        {label}
      </span>
      <span className="mt-0.5 block text-[12px] leading-snug text-white/55">
        {description}
      </span>
    </span>
    <span
      className="ml-2 inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-white/60 transition-all duration-300 group-hover:translate-x-1 group-hover:bg-white/10 group-hover:text-white"
      aria-hidden
    >
      <Arrow />
    </span>
  </a>
);

const BioPageClient = () => {
  const t = useTranslations('BioPage');

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] font-poppins text-white antialiased">
      {/* Atmospheric backdrop — matches the main site's vibe without dragging
          in the full ParallaxBlobs component (this page is meant to load fast). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(253,81,46,0.12) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 50% 100%, rgba(188,1,253,0.08) 0%, transparent 65%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04] mix-blend-screen"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.9) 1px, transparent 0)',
          backgroundSize: '3px 3px',
        }}
      />

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-md flex-col px-5 py-12 sm:px-6 sm:py-16">
        {/* Logo + name */}
        <motion.div
          className="flex flex-col items-center text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE }}
        >
          <Image
            src="/assets/images/logo/logo_symbol_white.svg"
            alt="Agility Creative"
            width={56}
            height={56}
            priority
            className="size-14"
          />
          <Image
            src="/assets/images/logo/logo_name_white.svg"
            alt=""
            width={140}
            height={32}
            priority
            className="mt-5 h-8 w-auto"
          />
        </motion.div>

        {/* Tagline */}
        <motion.p
          className="mt-5 text-center text-[14px] leading-relaxed text-white/60 sm:text-[15px]"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE, delay: 0.08 }}
        >
          {t('tagline')}
        </motion.p>

        <motion.a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex w-fit items-center gap-1.5 self-center rounded-full bg-white/[0.04] px-3 py-1 text-[11px] font-medium tracking-tight text-white/50 transition-colors hover:bg-white/[0.08] hover:text-white/80"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE, delay: 0.14 }}
        >
          {t('handle')}
        </motion.a>

        {/* Link buttons — staggered fade up */}
        <div className="mt-10 flex flex-col gap-3">
          {[
            {
              href: '/',
              label: t('siteLabel'),
              description: t('siteDescription'),
              icon: <SiteIcon />,
            },
            {
              href: '/blog',
              label: t('blogLabel'),
              description: t('blogDescription'),
              icon: <BlogIcon />,
            },
            {
              href: whatsappHref,
              label: t('whatsappLabel'),
              description: t('whatsappDescription'),
              icon: <WhatsAppIcon />,
              external: true,
              accent: true,
            },
          ].map((link, index) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.22 + index * 0.07 }}
            >
              <LinkRow {...link} />
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <motion.p
          className="mt-auto pt-12 text-center text-[11px] text-white/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.5 }}
        >
          ©
          {' '}
          {new Date().getFullYear()}
          {' '}
          Agility Creative · Fortaleza, BR
        </motion.p>
      </main>
    </div>
  );
};

export default BioPageClient;
