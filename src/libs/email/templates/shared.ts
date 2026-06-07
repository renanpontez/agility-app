// Shared building blocks for our email templates. Email HTML is its own
// little dark age — Gmail strips <style>, Outlook ignores half of flexbox,
// dark mode is unpredictable. We keep things minimal: inline styles, table-
// less centering with max-width, and explicit colors on every text node.

import { EMAIL_CONFIG } from '../config';

export const escape = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const FONT_STACK
  = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, "Helvetica Neue", Arial, sans-serif';

export const wrapHtml = (innerHtml: string, opts: { previewText?: string; unsubscribeUrl?: string } = {}): string => {
  const preview = opts.previewText ? escape(opts.previewText) : '';
  const unsubscribe = opts.unsubscribeUrl
    ? `<p style="margin:24px 0 0;font-size:11px;line-height:1.5;color:#a8a29e;text-align:center;">
        Não quer mais receber? <a href="${escape(opts.unsubscribeUrl)}" style="color:#78716c;text-decoration:underline;">Cancelar inscrição</a>.
      </p>`
    : '';
  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>${escape(EMAIL_CONFIG.fromName)}</title>
</head>
<body style="margin:0;padding:0;background:#fafaf9;font-family:${FONT_STACK};color:#1c1917;-webkit-font-smoothing:antialiased;">
  <span style="display:none !important;visibility:hidden;mso-hide:all;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
    ${preview}
  </span>
  <div style="max-width:560px;margin:0 auto;padding:40px 24px 56px;">
    <header style="padding-bottom:32px;border-bottom:1px solid rgba(0,0,0,.06);margin-bottom:32px;">
      <a href="${EMAIL_CONFIG.baseUrl}/blog" style="text-decoration:none;color:#1c1917;display:inline-flex;align-items:center;gap:8px;">
        <span style="display:inline-block;width:24px;height:24px;background:${EMAIL_CONFIG.brandColor};border-radius:6px;"></span>
        <strong style="font-size:15px;letter-spacing:-.01em;">Agility Creative</strong>
      </a>
    </header>
    ${innerHtml}
    <footer style="margin-top:48px;padding-top:24px;border-top:1px solid rgba(0,0,0,.06);">
      <p style="margin:0;font-size:12px;line-height:1.55;color:#78716c;">
        Você está recebendo este e-mail porque assinou o blog da Agility Creative em
        <a href="${EMAIL_CONFIG.baseUrl}/blog" style="color:#78716c;">agilitycreative.com</a>.
      </p>
      ${unsubscribe}
    </footer>
  </div>
</body>
</html>`;
};
