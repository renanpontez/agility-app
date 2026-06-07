import type { Metadata } from 'next';

import { BlogHero } from '@/components/blog';
import { Link } from '@/libs/i18nNavigation';
import { unsubscribeByToken } from '@/libs/subscribers';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'Cancelar inscrição',
};

type Params = { token?: string | string[] };

const pickToken = (raw: Params['token']): string => {
  if (Array.isArray(raw)) {
    return raw[0] ?? '';
  }
  return raw ?? '';
};

const UnsubscribePage = async ({
  searchParams,
}: {
  searchParams: Promise<Params>;
}) => {
  const { token: rawToken } = await searchParams;
  const token = pickToken(rawToken);
  // Honoring the unsubscribe is a server side-effect — we run it as part of
  // the page render. The token model means a missing/bad token simply shows
  // the error variant; nothing destructive happens.
  const result = token
    ? await unsubscribeByToken(token)
    : { ok: false as const, reason: 'invalid_token' as const };

  if (!result.ok) {
    return (
      <>
        <BlogHero
          eyebrow="Algo deu errado"
          title="Esse link não funciona mais"
          subtitle="O link pode ter expirado ou sido digitado errado. Se você ainda quer parar de receber, abra um e-mail nosso recente e clique no link de “Cancelar inscrição” no rodapé."
        />
        <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
          <p className="mb-6 text-[15px] leading-relaxed text-stone-600">
            Você também pode escrever para
            {' '}
            <a
              href="mailto:hi@agilitycreative.com?subject=Cancelar%20inscri%C3%A7%C3%A3o"
              className="text-stone-900 underline decoration-stone-300 underline-offset-4 hover:decoration-stone-500"
            >
              hi@agilitycreative.com
            </a>
            {' '}
            que removemos manualmente.
          </p>
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

  const alreadyUnsubscribed = result.alreadyUnsubscribed;

  return (
    <>
      <BlogHero
        eyebrow={alreadyUnsubscribed ? 'Você já estava fora' : 'Inscrição cancelada'}
        title={
          alreadyUnsubscribed
            ? 'Esse e-mail já tinha sido removido'
            : 'Pronto, removemos seu e-mail'
        }
        subtitle={
          alreadyUnsubscribed
            ? 'Confirmamos: você não está mais na nossa lista. Se ainda chegar algum e-mail, pode ser um envio anterior que ficou em fila — vai parar nas próximas horas.'
            : 'Você não vai receber mais e-mails nossos a partir de agora. Se mudou de ideia, é só assinar de novo no blog quando quiser.'
        }
      />
      <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
        <p className="mb-8 text-[14px] leading-relaxed text-stone-500">
          Tem um segundo para nos contar o motivo? Responda este e-mail:
          {' '}
          <a
            href="mailto:hi@agilitycreative.com?subject=Por%20que%20cancelei"
            className="text-stone-900 underline decoration-stone-300 underline-offset-4 hover:decoration-stone-500"
          >
            hi@agilitycreative.com
          </a>
          . Ajuda demais a ajustar o que enviamos.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-5 py-2.5 text-[13px] font-medium text-stone-50 shadow-[0_1px_2px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.08)] transition-all hover:bg-stone-800"
          >
            Continuar lendo o blog
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

export default UnsubscribePage;
