import { render } from '@react-email/render';

import { EMAIL_CONFIG } from '../config';
import type { NewPostEmailProps } from './NewPostEmail';
import { NewPostEmail } from './NewPostEmail';

export type NewPostEmailInput = NewPostEmailProps;

const renderText = (input: NewPostEmailInput): string => `
${input.title}

${input.excerpt}

Ler completo: ${input.postUrl}

— Equipe Agility (${EMAIL_CONFIG.fromAddress})

---
Cancelar inscrição: ${input.unsubscribeUrl}
`.trim();

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
