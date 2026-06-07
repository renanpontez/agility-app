import type { Metadata } from 'next';

import { BlogHero } from '@/components/blog';
import { Link } from '@/libs/i18nNavigation';
import { confirmByToken } from '@/libs/subscribers';

export const dynamic = 'force-dynamic';

// Confirmation pages must never be indexed — they're transactional landing
// pages, not content. Excluding them also stops GSC from flagging the empty
// `?token` variant as a duplicate.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'Confirmação de inscrição',
};

type Params = { token?: string | string[] };

const pickToken = (raw: Params['token']): string => {
  if (Array.isArray(raw)) {
    return raw[0] ?? '';
  }
  return raw ?? '';
};

const ConfirmPage = async ({
  searchParams,
}: {
  searchParams: Promise<Params>;
}) => {
  const { token: rawToken } = await searchParams;
  const token = pickToken(rawToken);
  const result = token ? await confirmByToken(token) : { ok: false as const, reason: 'invalid_token' as const };

  if (!result.ok) {
    return (
      <>
        <BlogHero
          eyebrow="Algo deu errado"
          title="Esse link não funciona mais"
          subtitle="O link pode ter expirado depois que você pediu uma nova confirmação, ou pode ter sido digitado errado. Tente assinar de novo no blog."
        />
        <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-5 py-2.5 text-[13px] font-medium text-stone-50 transition-colors hover:bg-stone-800"
          >
            Voltar para o blog
            <span aria-hidden className="text-stone-400">→</span>
          </Link>
        </section>
      </>
    );
  }

  const alreadyConfirmed = result.alreadyConfirmed;

  return (
    <>
      <BlogHero
        eyebrow={alreadyConfirmed ? 'Você já estava dentro' : 'Inscrição confirmada'}
        title={alreadyConfirmed ? 'Você já é assinante' : 'Pronto, está confirmado'}
        subtitle={
          alreadyConfirmed
            ? 'Esse e-mail já tinha sido confirmado em uma sessão anterior. Você vai continuar recebendo cada artigo novo.'
            : 'Você vai receber um e-mail toda vez que publicarmos um artigo novo. Leituras curtas, em pt-BR, sobre tecnologia, IA e produto.'
        }
      />
      <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
        <div className="flex flex-wrap gap-3">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-5 py-2.5 text-[13px] font-medium text-stone-50 shadow-[0_1px_2px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.08)] transition-all hover:bg-stone-800"
          >
            Ler os artigos
            <span aria-hidden className="text-stone-400">→</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-stone-200/70 bg-white px-5 py-2.5 text-[13px] font-medium text-stone-600 transition-colors hover:border-stone-300 hover:text-stone-900"
          >
            Ir para o site
          </Link>
        </div>
      </section>
    </>
  );
};

export default ConfirmPage;
