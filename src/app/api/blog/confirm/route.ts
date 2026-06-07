import { NextResponse } from 'next/server';

import { confirmByToken } from '@/libs/subscribers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/blog/confirm?token=<hex> — the user clicks this from their inbox.
// We render minimal inline HTML rather than redirecting to a route so the
// success message is rendered even if the destination is rate-limited or down.

const renderPage = (kind: 'confirmed' | 'invalid'): Response => {
  const isConfirmed = kind === 'confirmed';
  const title = isConfirmed
    ? 'Inscrição confirmada'
    : 'Link inválido ou expirado';
  const heading = isConfirmed
    ? 'Tudo certo. Você está dentro.'
    : 'Esse link não funciona mais';
  const body = isConfirmed
    ? 'Você vai receber um e-mail toda vez que publicarmos um artigo novo. Pode esperar leituras curtas, na maioria das vezes em pt-BR, sobre tecnologia, IA e produto.'
    : 'O link pode ter expirado depois que você pediu uma nova confirmação, ou pode ter sido digitado errado. Tente assinar de novo no blog.';
  const ctaHref = '/blog';
  const ctaLabel = isConfirmed ? 'Ir para o blog' : 'Voltar para o blog';

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
    .eyebrow { font-size: 11px; font-weight: 600; letter-spacing: 0.22em; text-transform: uppercase; color: #FD512E; display: inline-flex; gap: 12px; align-items: center; margin: 0 0 20px; }
    .eyebrow::before { content: ""; width: 32px; height: 1px; background: #FD512E; display: inline-block; }
    h1 { margin: 0 0 16px; font-size: 32px; line-height: 1.15; letter-spacing: -0.02em; font-weight: 600; }
    p.lede { margin: 0 0 32px; color: #57534e; line-height: 1.6; font-size: 16px; }
    .cta { display: inline-flex; align-items: center; gap: 8px; padding: 12px 20px; border-radius: 999px; background: #1c1917; color: #fafaf9; text-decoration: none; font-weight: 500; font-size: 14px; }
    .cta:hover { background: #292524; }
    footer { margin-top: 48px; color: #a8a29e; font-size: 12px; }
    footer a { color: inherit; text-decoration: underline; }
  </style>
</head>
<body>
  <main class="wrap">
    <p class="eyebrow">${isConfirmed ? 'Inscrição confirmada' : 'Algo deu errado'}</p>
    <h1>${heading}</h1>
    <p class="lede">${body}</p>
    <a class="cta" href="${ctaHref}">${ctaLabel} →</a>
    <footer>
      <p>Agility Creative · <a href="/">agilitycreative.com</a></p>
    </footer>
  </main>
</body>
</html>`;

  return new NextResponse(html, {
    status: isConfirmed ? 200 : 400,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'private, no-store',
    },
  });
};

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get('token') ?? '';
  const result = await confirmByToken(token);
  return renderPage(result.ok ? 'confirmed' : 'invalid');
}
