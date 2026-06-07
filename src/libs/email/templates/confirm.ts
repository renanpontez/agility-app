import { EMAIL_CONFIG } from '../config';
import { escape, wrapHtml } from './shared';

export type ConfirmEmailInput = {
  confirmUrl: string;
};

const SUBJECT = 'Confirme sua inscrição no blog da Agility';

const previewText = 'Falta um clique para começar a receber novos artigos.';

const renderHtml = (input: ConfirmEmailInput): string => {
  const inner = `
    <h1 style="margin:0 0 20px;font-size:24px;font-weight:600;letter-spacing:-.02em;line-height:1.2;color:#1c1917;">
      Falta um clique para confirmar
    </h1>
    <p style="margin:0 0 28px;font-size:15px;line-height:1.65;color:#44403c;">
      Obrigado por assinar o blog da Agility Creative. Para começar a receber
      novos artigos, confirme que este e-mail é seu clicando no botão abaixo.
    </p>
    <p style="margin:0 0 36px;">
      <a href="${escape(input.confirmUrl)}"
         style="display:inline-block;padding:13px 22px;background:#1c1917;color:#fafaf9;border-radius:999px;text-decoration:none;font-size:14px;font-weight:500;letter-spacing:-.005em;">
        Confirmar inscrição
      </a>
    </p>
    <p style="margin:0 0 8px;font-size:12px;line-height:1.55;color:#78716c;">
      Ou copie e cole este link no navegador:
    </p>
    <p style="margin:0 0 32px;font-size:12px;line-height:1.4;color:#78716c;word-break:break-all;">
      <a href="${escape(input.confirmUrl)}" style="color:#78716c;">${escape(input.confirmUrl)}</a>
    </p>
    <p style="margin:0;font-size:13px;line-height:1.6;color:#78716c;">
      Se você não se inscreveu, é só ignorar este e-mail — sem confirmação não
      enviaremos mais nada.
    </p>
  `;
  return wrapHtml(inner, { previewText });
};

const renderText = (input: ConfirmEmailInput): string => `
Falta um clique para confirmar sua inscrição no blog da Agility Creative.

Confirme aqui:
${input.confirmUrl}

Se você não se inscreveu, é só ignorar este e-mail — sem confirmação não enviaremos mais nada.

— Equipe Agility (${EMAIL_CONFIG.fromAddress})
`.trim();

export const buildConfirmEmail = (input: ConfirmEmailInput) => ({
  subject: SUBJECT,
  html: renderHtml(input),
  text: renderText(input),
});
