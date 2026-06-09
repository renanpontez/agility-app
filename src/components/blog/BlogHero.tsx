import { Link } from '@/libs/i18nNavigation';

type Breadcrumb = {
  label: string;
  href?: string;
};

type BlogHeroProps = {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  meta?: React.ReactNode;
  breadcrumbs?: Breadcrumb[];
  align?: 'left' | 'center';
  size?: 'sm' | 'md' | 'lg';
};

const SIZE_TO_TITLE = {
  sm: 'text-3xl md:text-4xl',
  md: 'text-4xl md:text-5xl lg:text-[3.5rem]',
  lg: 'text-[2rem] leading-[1.05] md:text-5xl lg:text-[3.25rem]',
} as const;

const BlogHero = ({
  eyebrow,
  title,
  subtitle,
  meta,
  breadcrumbs,
  align = 'left',
  size = 'lg',
}: BlogHeroProps) => {
  const isCenter = align === 'center';

  return (
    <section className="relative">
      {/* Hairline divider — gradient fade for a more editorial finish than a flat border. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-stone-300/60 to-transparent"
      />
      <div className={`mx-auto max-w-6xl px-5 pb-10 pt-12 sm:px-8 md:pb-14 md:pt-20 ${isCenter ? 'text-center' : 'text-left'}`}>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav
            aria-label="Breadcrumb"
            className={`mb-8 flex flex-wrap items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-stone-400 ${isCenter ? 'justify-center' : ''}`}
          >
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center gap-2">
                {crumb.href
                  ? (
                      <Link href={crumb.href} className="transition-colors hover:text-stone-900">
                        {crumb.label}
                      </Link>
                    )
                  : (
                      <span className="text-stone-700">{crumb.label}</span>
                    )}
                {index < breadcrumbs.length - 1 && <span className="text-stone-300">/</span>}
              </div>
            ))}
          </nav>
        )}

        <div className={isCenter ? 'mx-auto max-w-3xl' : ''}>
          {eyebrow && (
            <div className={`mb-6 flex items-center gap-3 ${isCenter ? 'justify-center' : ''}`}>
              <span aria-hidden className="h-px w-8 bg-primary" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                {eyebrow}
              </p>
            </div>
          )}

          <h1 className={`font-semibold tracking-[-0.02em] text-stone-900 ${SIZE_TO_TITLE[size]}`}>
            {title}
          </h1>

          {subtitle && (
            <p className={`mt-5 text-[15px] leading-relaxed text-stone-500 md:mt-6 md:text-base ${isCenter ? 'mx-auto max-w-2xl' : 'max-w-3xl'}`}>
              {subtitle}
            </p>
          )}

          {meta && (
            <div className={`mt-9 flex flex-wrap items-center gap-3 text-sm text-stone-500 ${isCenter ? 'justify-center' : ''}`}>
              {meta}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BlogHero;
