import LogoutButton from '@/app/admin/LogoutButton';

import Sidebar from './Sidebar';

type DashboardShellProps = {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
};

const DashboardShell = ({ title, eyebrow = 'Admin', children }: DashboardShellProps) => (
  <div className="flex min-h-screen">
    <Sidebar />
    <div className="flex min-w-0 flex-1 flex-col">
      <header className="flex items-center justify-between gap-4 border-b border-stone-200/70 bg-white px-6 py-4 md:px-8">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-400">
            {eyebrow}
          </p>
          <h1 className="mt-0.5 truncate text-[18px] font-semibold tracking-[-0.01em] text-stone-900">
            {title}
          </h1>
        </div>
        <LogoutButton />
      </header>
      <main className="flex-1 px-6 py-8 md:px-8">
        {children}
      </main>
    </div>
  </div>
);

export default DashboardShell;
