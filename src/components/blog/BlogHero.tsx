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
  sm: 'text-2xl md:text-3xl',
  md: 'text-3xl md:text-4xl lg:text-[2.75rem]',
  lg: 'text-4xl md:text-5xl lg:text-[3.25rem]',
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
    <section className="border-b border-neutral-200/70 bg-white">
      <div className={`mx-auto max-w-6xl px-4 pb-10 pt-14 sm:px-6 md:pb-14 md:pt-20 ${isCenter ? 'text-center' : 'text-left'}`}>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav
            aria-label="Breadcrumb"
            className={`mb-6 flex flex-wrap items-center gap-1.5 text-xs text-neutral-500 ${isCenter ? 'justify-center' : ''}`}
          >
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center gap-1.5">
                {crumb.href
                  ? (
                      <Link href={crumb.href} className="transition-colors hover:text-neutral-900">
                        {crumb.label}
                      </Link>
                    )
                  : (
                      <span className="text-neutral-700">{crumb.label}</span>
                    )}
                {index < breadcrumbs.length - 1 && <span className="text-neutral-300">/</span>}
              </div>
            ))}
          </nav>
        )}

        <div className={isCenter ? 'mx-auto max-w-3xl' : 'max-w-3xl'}>
          {eyebrow && (
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              {eyebrow}
            </p>
          )}

          <h1 className={`font-bold leading-[1.1] tracking-tight text-neutral-900 ${SIZE_TO_TITLE[size]}`}>
            {title}
          </h1>

          {subtitle && (
            <p className="mt-5 text-base leading-relaxed text-neutral-600 md:mt-6 md:text-lg">
              {subtitle}
            </p>
          )}

          {meta && (
            <div className={`mt-7 flex flex-wrap items-center gap-3 text-sm text-neutral-500 ${isCenter ? 'justify-center' : ''}`}>
              {meta}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BlogHero;
