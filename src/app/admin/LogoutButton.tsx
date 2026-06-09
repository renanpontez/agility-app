'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const LogoutButton = () => {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const onClick = async () => {
    if (busy) {
      return;
    }
    setBusy(true);
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.replace('/admin/login');
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className="inline-flex h-9 items-center justify-center rounded-full border border-stone-200/70 bg-white px-4 text-[12px] font-medium text-stone-600 transition-colors hover:bg-stone-50 hover:text-stone-900 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {busy ? 'Saindo…' : 'Sair'}
    </button>
  );
};

export default LogoutButton;
