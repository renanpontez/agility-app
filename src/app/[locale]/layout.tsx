import '@/styles/global.css';

import type { Metadata } from 'next';
import { NextIntlClientProvider, useMessages } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';

import { AppConfig } from '@/utils/AppConfig';

export const metadata: Metadata = {
  title: 'Agility Creative - Soluções que inspiram.',
  description: 'Agility Creative oferece soluções digitais inovadoras, incluindo desenvolvimento de sites, aplicativos, branding e marketing digital.',
  keywords: 'Agility Creative, soluções digitais, desenvolvimento web, branding, marketing digital',
  authors: [{ name: 'Agility Creative' }],
  viewport: 'width=device-width, initial-scale=1.0',
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://www.agilitycreative.com',
  },
  openGraph: {
    title: 'Agility Creative - Soluções Digitais Inteligentes',
    description: 'Explore as soluções digitais da Agility Creative, incluindo desenvolvimento web, branding e marketing digital.',
    url: 'https://www.agilitycreative.com',
    siteName: 'Agility Creative',
    images: [
      {
        url: 'https://www.agilitycreative.com/assets/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Agility Creative Open Graph Image',
      },
    ],
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/assets/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/assets/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/assets/favicon.ico', type: 'image/x-icon' },
    ],
    apple: '/assets/apple-touch-icon.png',
  },
};

export function generateStaticParams() {
  return AppConfig.locales.map(locale => ({ locale }));
}

export default function RootLayout(props: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  unstable_setRequestLocale(props.params.locale);

  // Using internationalization in Client Components
  const messages = useMessages();

  return (
    <html lang={props.params.locale}>
      <body>
        <NextIntlClientProvider
          locale={props.params.locale}
          messages={messages}
        >
          {props.children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
