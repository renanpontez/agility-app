import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { Link } from '@/libs/i18nNavigation';

const BlogFooter = () => {
  const t = useTranslations('Footer');
  const tNav = useTranslations('Navbar');
  const tBlog = useTranslations('BlogPage');

  return (
    <footer className="relative border-t border-stone-200/70 bg-white">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-sm">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <Image src="/assets/images/logo/logo_symbol_black.svg" alt="Agility" width={28} height={28} />
              <Image src="/assets/images/logo/logo_name_black.svg" alt="Agility" width={92} height={22} />
            </Link>
            <p className="mt-5 text-sm leading-relaxed text-stone-500">
              {t('tagline')}
            </p>
          </div>

          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">
              {t('navigation')}
            </p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/blog" className="text-stone-600 transition-colors hover:text-stone-900">
                  {tBlog('badge')}
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-stone-600 transition-colors hover:text-stone-900">
                  {tNav('portfolio')}
                </Link>
              </li>
              <li>
                <Link href="/sobre-nos" className="text-stone-600 transition-colors hover:text-stone-900">
                  {tNav('about')}
                </Link>
              </li>
              <li>
                <Link href="/" className="text-stone-600 transition-colors hover:text-stone-900">
                  {tNav('home')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">
              {t('contact')}
            </p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="mailto:hi@agilitycreative.com" className="text-stone-600 transition-colors hover:text-stone-900">
                  hi@agilitycreative.com
                </a>
              </li>
              <li>
                <a href="tel:+5585996284730" className="text-stone-600 transition-colors hover:text-stone-900">
                  +55 85 99628-4730
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/agilitycreative"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-600 transition-colors hover:text-stone-900"
                >
                  @agilitycreative
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-stone-200/70 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-stone-400">
            ©
            {' '}
            {new Date().getFullYear()}
            {' '}
            Agility Creative.
            {' '}
            {t('copyright')}
          </p>
          <p className="text-xs uppercase tracking-[0.18em] text-stone-400">
            Fortaleza · Brasil
          </p>
        </div>
      </div>
    </footer>
  );
};

export default BlogFooter;
