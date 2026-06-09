import { desc } from 'drizzle-orm';

import { db } from '@/libs/DB';
import { blogSubscribersSchema } from '@/models/Schema';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const STATUS_STYLE: Record<string, string> = {
  confirmed: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  pending: 'bg-amber-50 text-amber-700 ring-amber-200',
  unsubscribed: 'bg-stone-100 text-stone-500 ring-stone-200',
};

const formatDate = (value: Date | null): string => {
  if (!value) {
    return '—';
  }
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Sao_Paulo',
  }).format(value);
};

const AdminSubscribersPage = async () => {
  const rows = await db
    .select()
    .from(blogSubscribersSchema)
    .orderBy(desc(blogSubscribersSchema.createdAt));

  const totals = rows.reduce(
    (acc, r) => {
      acc.total += 1;
      acc[r.status as keyof typeof acc] = (acc[r.status as keyof typeof acc] ?? 0) + 1;
      return acc;
    },
    { total: 0, confirmed: 0, pending: 0, unsubscribed: 0 },
  );

  return (
    <main className="min-h-screen bg-stone-50 py-12">
      <div className="mx-auto max-w-6xl px-6">
        <header className="mb-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-400">
            Admin
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-[-0.02em] text-stone-900">
            Newsletter subscribers
          </h1>
        </header>

        <section className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {([
            { label: 'Total', value: totals.total, tone: 'text-stone-900' },
            { label: 'Confirmados', value: totals.confirmed, tone: 'text-emerald-700' },
            { label: 'Pendentes', value: totals.pending, tone: 'text-amber-700' },
            { label: 'Cancelados', value: totals.unsubscribed, tone: 'text-stone-500' },
          ]).map(stat => (
            <div
              key={stat.label}
              className="rounded-2xl border border-stone-200/70 bg-white p-5"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">
                {stat.label}
              </p>
              <p className={`mt-2 text-3xl font-semibold tracking-tight ${stat.tone}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </section>

        <section className="overflow-hidden rounded-2xl border border-stone-200/70 bg-white">
          <table className="w-full text-left text-[14px]">
            <thead className="bg-stone-50 text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-500">
              <tr>
                <th className="px-5 py-3">E-mail</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Source</th>
                <th className="px-5 py-3">Locale</th>
                <th className="px-5 py-3">Inscrição</th>
                <th className="px-5 py-3">Confirmação</th>
                <th className="px-5 py-3">Cancelamento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {rows.length === 0
                ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-12 text-center text-stone-400">
                        Nenhum inscrito ainda.
                      </td>
                    </tr>
                  )
                : (
                    rows.map(r => (
                      <tr key={r.id} className="hover:bg-stone-50/60">
                        <td className="px-5 py-3 font-medium text-stone-900">{r.email}</td>
                        <td className="px-5 py-3">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ring-1 ring-inset ${
                              STATUS_STYLE[r.status] ?? 'bg-stone-100 text-stone-600 ring-stone-200'
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-stone-600">{r.source ?? '—'}</td>
                        <td className="px-5 py-3 text-stone-600">{r.locale}</td>
                        <td className="px-5 py-3 text-stone-600">{formatDate(r.createdAt)}</td>
                        <td className="px-5 py-3 text-stone-600">{formatDate(r.confirmedAt)}</td>
                        <td className="px-5 py-3 text-stone-600">{formatDate(r.unsubscribedAt)}</td>
                      </tr>
                    ))
                  )}
            </tbody>
          </table>
        </section>
      </div>
    </main>
  );
};

export default AdminSubscribersPage;
