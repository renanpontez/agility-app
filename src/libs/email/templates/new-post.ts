import { EMAIL_CONFIG } from '../config';
import { escape, wrapHtml } from './shared';

export type NewPostEmailInput = {
  title: string;
  excerpt: string;
  category?: string;
  coverImage?: string;
  coverAlt?: string;
  postUrl: string;
  unsubscribeUrl: string;
};

const renderHtml = (input: NewPostEmailInput): string => {
  const category = input.category
    ? `<p style="margin:0 0 16px;font-size:11px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:${EMAIL_CONFIG.brandColor};">
        ${escape(input.category)}
      </p>`
    : '';
  const cover = input.coverImage
    ? `<a href="${escape(input.postUrl)}" style="display:block;margin:0 0 28px;border-radius:14px;overflow:hidden;text-decoration:none;">
        <img src="${escape(input.coverImage)}" alt="${escape(input.coverAlt ?? input.title)}"
             width="512" style="display:block;width:100%;max-width:512px;height:auto;border:0;outline:none;text-decoration:none;border-radius:14px;" />
      </a>`
    : '';
  const inner = `
    ${cover}
    ${category}
    <h1 style="margin:0 0 16px;font-size:26px;font-weight:600;letter-spacing:-.02em;line-height:1.2;color:#1c1917;">
      ${escape(input.title)}
    </h1>
    <p style="margin:0 0 32px;font-size:15px;line-height:1.65;color:#44403c;">
      ${escape(input.excerpt)}
    </p>
    <p style="margin:0 0 8px;">
      <a href="${escape(input.postUrl)}"
         style="display:inline-block;padding:13px 22px;background:#1c1917;color:#fafaf9;border-radius:999px;text-decoration:none;font-size:14px;font-weight:500;letter-spacing:-.005em;">
        Ler artigo completo →
      </a>
    </p>
  `;
  return wrapHtml(inner, { previewText: input.excerpt, unsubscribeUrl: input.unsubscribeUrl });
};

const renderText = (input: NewPostEmailInput): string => `
${input.title}

${input.excerpt}

Ler completo: ${input.postUrl}

— Equipe Agility (${EMAIL_CONFIG.fromAddress})

---
Cancelar inscrição: ${input.unsubscribeUrl}
`.trim();

export const buildNewPostEmail = (input: NewPostEmailInput) => ({
  subject: input.title,
  html: renderHtml(input),
  text: renderText(input),
});
