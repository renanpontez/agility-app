import '@/styles/global.css';

import type { Metadata, Viewport } from 'next';
import { Poppins, Sorts_Mill_Goudy } from 'next/font/google';
import Script from 'next/script';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';

import { AppConfig } from '@/utils/AppConfig';
import { getBaseUrl } from '@/utils/Helpers';
import { buildAlternates, ogAlternateLocales, ogLocale } from '@/utils/seo';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
});

const sortsMillGoudy = Sorts_Mill_Goudy({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-sorts-mill-goudy',
  preload: false,
});

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const safeLocale = (AppConfig.locales as readonly string[]).includes(locale)
    ? (locale as (typeof AppConfig.locales)[number])
    : AppConfig.defaultLocale;
  const t = await getTranslations({ locale: safeLocale, namespace: 'Metadata' });
  const alternates = buildAlternates(safeLocale, '/');

  return {
    metadataBase: new URL(getBaseUrl()),
    title: {
      default: t('title'),
      template: `%s | ${AppConfig.name}`,
    },
    description: t('description'),
    authors: [{ name: AppConfig.name }],
    robots: {
      index: true,
      follow: true,
    },
    alternates,
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      url: alternates.canonical,
      siteName: AppConfig.name,
      locale: ogLocale(safeLocale),
      alternateLocale: ogAlternateLocales(safeLocale),
      images: [
        {
          url: '/assets/images/og-image.jpg',
          width: 1200,
          height: 630,
          alt: AppConfig.name,
        },
      ],
      type: 'website',
    },
    icons: {
      icon: [
        { url: '/assets/favicon/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
        { url: '/assets/favicon/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
        { url: '/assets/favicon/favicon.ico', type: 'image/x-icon' },
      ],
      apple: '/assets/favicon/apple-touch-icon.png',
    },
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export function generateStaticParams() {
  return AppConfig.locales.map(locale => ({ locale }));
}

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  // Using internationalization in Client Components
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${poppins.variable} ${sortsMillGoudy.variable}`}>
      <body>
        <NextIntlClientProvider
          locale={locale}
          messages={messages}
        >
          {props.children}
        </NextIntlClientProvider>
        {process.env.VERCEL_ENV === 'production' && (
          <Script
            src="https://cloud.umami.is/script.js"
            data-website-id="fbef5db3-d9f6-407f-a106-7fb818d1ecf4"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
