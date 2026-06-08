import { render } from '@react-email/render';

import { EMAIL_CONFIG } from '../config';
import type { ConfirmEmailProps } from './ConfirmEmail';
import { ConfirmEmail } from './ConfirmEmail';

export type ConfirmEmailInput = ConfirmEmailProps;

const SUBJECT = 'Confirme sua inscrição no blog da Agility';

const renderText = (input: ConfirmEmailInput): string => `
Falta um clique para confirmar sua inscrição no blog da Agility Creative.

Confirme aqui:
${input.confirmUrl}

Se você não se inscreveu, é só ignorar este e-mail — sem confirmação não enviaremos mais nada.

— Equipe Agility (${EMAIL_CONFIG.fromAddress})
`.trim();

/**
 * Builds the email payload (subject + html + text) for the double-opt-in
 * confirmation. HTML comes from rendering the React Email `<Confirm>`
 * component so the `react-email dev` preview matches what the user receives.
 */
export const buildConfirmEmail = async (input: ConfirmEmailInput) => {
  const html = await render(ConfirmEmail(input));
  return {
    subject: SUBJECT,
    html,
    text: renderText(input),
  };
};
