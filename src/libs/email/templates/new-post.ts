import { render } from '@react-email/render';

import type { BlogBodyBlock } from '@/types/blog';

import { EMAIL_CONFIG } from '../config';
import type { NewPostEmailProps } from './NewPostEmail';
import { NewPostEmail } from './NewPostEmail';

export type NewPostEmailInput = NewPostEmailProps;

// Mirrors the HTML render: blocks → readable plain text. Lists get bullets,
// headings get extra whitespace, code blocks pass through verbatim. Used by
// inbox clients that only show the text/plain part and by Resend's deliverability
// heuristics (which downrank text/html-only messages).
const blockToText = (block: BlogBodyBlock): string => {
  switch (block.type) {
    case 'paragraph':
      return block.text;
    case 'heading':
      return `\n${block.text}\n${'-'.repeat(Math.max(8, block.text.length))}`;
    case 'list':
      return block.items.map((i, n) => (block.ordered ? `${n + 1}. ${i}` : `• ${i}`)).join('\n');
    case 'quote':
      return `“${block.text}”${block.cite ? `\n— ${block.cite}` : ''}`;
    case 'image':
      return block.caption ? `[imagem: ${block.alt} — ${block.caption}]` : `[imagem: ${block.alt}]`;
    case 'code':
      return block.code;
    default:
      return '';
  }
};

const renderText = (input: NewPostEmailInput): string => {
  const body = input.body.map(blockToText).filter(Boolean).join('\n\n');
  return `
${input.title}

${input.excerpt}

${body}

Ver no site: ${input.postUrl}

Mais artigos: ${EMAIL_CONFIG.baseUrl}/blog

— Equipe Agility (${EMAIL_CONFIG.fromAddress})

---
Cancelar inscrição: ${input.unsubscribeUrl}
`.trim();
};

/**
 * Builds the email payload (subject + html + text) for the "new post"
 * notification. HTML is produced by rendering the React Email component, so
 * the markup is identical to what the `react-email dev` preview shows.
 */
export const buildNewPostEmail = async (input: NewPostEmailInput) => {
  const html = await render(NewPostEmail(input));
  return {
    subject: input.title,
    html,
    text: renderText(input),
  };
};
