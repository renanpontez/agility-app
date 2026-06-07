import { NextResponse } from 'next/server';

import { unsubscribeByToken } from '@/libs/subscribers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Two-way unsubscribe — GET for the one-click link in every email, POST for
// the RFC 8058 `List-Unsubscribe=One-Click` header Gmail/Apple Mail honor.
// Both honor the token immediately without an interstitial click; the page
// the user lands on is just a confirmation render.

const renderPage = (kind: 'unsubscribed' | 'invalid'): Response => {
  const isOk = kind === 'unsubscribed';
  const title = isOk ? 'Inscrição cancelada' : 'Link inválido';
  const heading = isOk
    ? 'Pronto, removemos seu e-mail'
    : 'Esse link não funciona mais';
  const body = isOk
    ? 'Você não vai receber mais e-mails nossos a partir de agora. Se mudou de ideia, é só assinar de novo no blog quando quiser.'
    : 'O link pode ter expirado ou sido digitado errado. Se você ainda quer parar de receber, abra um e-mail nosso recente e use o link de "Cancelar inscrição" no rodapé.';

  const html = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex" />
  <title>${title} — Agility Creative</title>
  <style>
    :root { color-scheme: light; }
    * { box-sizing: border-box; }
    html, body { margin: 0; background: #fafaf9; color: #1c1917; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, "Helvetica Neue", Arial, sans-serif; }
    .wrap { max-width: 480px; margin: 0 auto; padding: 80px 24px 64px; }
    .eyebrow { font-size: 11px; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; color: #78716c; display: inline-flex; gap: 12px; align-items: center; margin: 0 0 20px; }
    .eyebrow::before { content: ""; width: 32px; height: 1px; background: #a8a29e; display: inline-block; }
    h1 { margin: 0 0 16px; font-size: 32px; line-height: 1.15; letter-spacing: -0.02em; font-weight: 600; }
    p.lede { margin: 0 0 32px; color: #57534e; line-height: 1.6; font-size: 16px; }
    .cta { display: inline-flex; align-items: center; gap: 8px; padding: 12px 20px; border-radius: 999px; background: #1c1917; color: #fafaf9; text-decoration: none; font-weight: 500; font-size: 14px; }
    footer { margin-top: 48px; color: #a8a29e; font-size: 12px; }
    footer a { color: inherit; text-decoration: underline; }
  </style>
</head>
<body>
  <main class="wrap">
    <p class="eyebrow">${isOk ? 'Inscrição cancelada' : 'Algo deu errado'}</p>
    <h1>${heading}</h1>
    <p class="lede">${body}</p>
    <a class="cta" href="/blog">Voltar para o blog →</a>
    <footer>
      <p>Agility Creative · <a href="/">agilitycreative.com</a></p>
    </footer>
  </main>
</body>
</html>`;

  return new NextResponse(html, {
    status: isOk ? 200 : 400,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'private, no-store',
    },
  });
};

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get('token') ?? '';
  const result = await unsubscribeByToken(token);
  return renderPage(result.ok ? 'unsubscribed' : 'invalid');
}

// RFC 8058 one-click POST — Gmail and Apple Mail fire this when the user hits
// the "Unsubscribe" button in their inbox UI. No HTML response needed; the
// mail client only checks the HTTP status.
export async function POST(req: Request) {
  const token = new URL(req.url).searchParams.get('token') ?? '';
  const result = await unsubscribeByToken(token);
  if (!result.ok) {
    return new NextResponse('invalid_token', { status: 400 });
  }
  return new NextResponse(null, { status: 200 });
}
