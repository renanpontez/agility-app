import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { Link } from '@/libs/i18nNavigation';

const BlogFooter = () => {
  const t = useTranslations('Footer');
  const tNav = useTranslations('Navbar');
  const tBlog = useTranslations('BlogPage');

  return (
    <footer className="border-t border-neutral-200 bg-white py-12">
      <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 px-4 sm:flex-row sm:items-center sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/assets/images/logo/logo_symbol_black.svg" alt="Agility" width={24} height={24} />
          <Image src="/assets/images/logo/logo_name_black.svg" alt="Agility" width={76} height={20} />
        </Link>

        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-neutral-500">
          <Link href="/blog" className="transition-colors hover:text-neutral-900">
            {tBlog('badge')}
          </Link>
          <Link href="/portfolio" className="transition-colors hover:text-neutral-900">
            {tNav('portfolio')}
          </Link>
          <Link href="/sobre-nos" className="transition-colors hover:text-neutral-900">
            {tNav('about')}
          </Link>
          <a href="mailto:hi@agilitycreative.com" className="transition-colors hover:text-neutral-900">
            hi@agilitycreative.com
          </a>
        </nav>

        <p className="text-xs text-neutral-400">
          ©
          {' '}
          {new Date().getFullYear()}
          {' '}
          Agility Creative.
          {' '}
          {t('copyright')}
        </p>
      </div>
    </footer>
  );
};

export default BlogFooter;
