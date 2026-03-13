import Image from 'next/image';

import RevealOnScroll from './RevealOnScroll';

type Breadcrumb = {
  label: string;
  href?: string;
};

type PageHeroProps = {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: string;
  breadcrumbs?: Breadcrumb[];
};

const PageHero = ({ title, subtitle, badge, breadcrumbs }: PageHeroProps) => {
  return (
    <section className="relative overflow-hidden">
      <div className="fixed inset-0 -z-10">
        <Image
          src="/assets/images/agility-team-working.jpeg"
          alt="Agility team"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-40 sm:px-6 md:pb-20 md:pt-48">
        <RevealOnScroll>
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav className="mb-8 flex items-center gap-2 text-sm text-white/40">
              {breadcrumbs.map((crumb, i) => (
                <span key={crumb.label} className="flex items-center gap-2">
                  {i > 0 && <span>/</span>}
                  {crumb.href
                    ? (
                        <a href={crumb.href} className="transition-colors hover:text-white">
                          {crumb.label}
                        </a>
                      )
                    : (
                        <span className="text-white/70">{crumb.label}</span>
                      )}
                </span>
              ))}
            </nav>
          )}
          {badge && (
            <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-widest text-primary/70">
              {badge}
            </span>
          )}
          <h1 className="mb-3 max-w-2xl text-4xl font-bold tracking-tight md:text-5xl">
            {title}
          </h1>
          {subtitle && (
            <p className="max-w-lg text-lg leading-relaxed text-white/60">
              {subtitle}
            </p>
          )}
        </RevealOnScroll>
      </div>
    </section>
  );
};

export default PageHero;
