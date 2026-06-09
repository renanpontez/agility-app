import '@/styles/global.css';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin — Agility Creative',
  robots: { index: false, follow: false },
};

const AdminRootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="pt-BR">
    <body className="min-h-screen bg-stone-50 font-sans text-stone-900 antialiased">
      {children}
    </body>
  </html>
);

export default AdminRootLayout;
