import { Suspense } from 'react';

import LoginForm from './LoginForm';

export const dynamic = 'force-dynamic';

const AdminLoginPage = () => (
  <main className="flex min-h-screen items-center justify-center bg-stone-50 px-6 py-12">
    <div className="w-full max-w-sm rounded-2xl border border-stone-200/70 bg-white p-8 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      <div className="mb-6 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-400">
          Admin
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-[-0.02em] text-stone-900">
          Acesso restrito
        </h1>
      </div>
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  </main>
);

export default AdminLoginPage;
