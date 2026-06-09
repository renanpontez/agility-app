'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/admin/subscribers', label: 'Newsletter', icon: '✉' },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 border-r border-stone-200/70 bg-white md:flex md:flex-col">
      <div className="px-5 py-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-400">
          Agility
        </p>
        <p className="mt-0.5 text-[15px] font-semibold tracking-[-0.01em] text-stone-900">
          Admin
        </p>
      </div>
      <nav className="flex-1 px-3 py-2">
        <ul className="flex flex-col gap-1">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2 text-[14px] transition-colors ${
                    active
                      ? 'bg-stone-100 font-medium text-stone-900'
                      : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <span aria-hidden className="text-stone-400">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
