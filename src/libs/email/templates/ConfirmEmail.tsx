import {
  Button,
  Heading,
  Link,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

import { Layout } from './_layout';

export type ConfirmEmailProps = {
  confirmUrl: string;
};

const styles = {
  heading: {
    margin: '0 0 20px',
    fontSize: '24px',
    fontWeight: 600,
    letterSpacing: '-0.02em',
    lineHeight: 1.2,
    color: '#1c1917',
  } as React.CSSProperties,
  intro: {
    margin: '0 0 28px',
    fontSize: '15px',
    lineHeight: 1.65,
    color: '#44403c',
  } as React.CSSProperties,
  buttonWrap: {
    margin: '0 0 36px',
  } as React.CSSProperties,
  button: {
    background: '#1c1917',
    color: '#fafaf9',
    padding: '13px 22px',
    borderRadius: '999px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 500,
    letterSpacing: '-0.005em',
  } as React.CSSProperties,
  fallbackLabel: {
    margin: '0 0 8px',
    fontSize: '12px',
    lineHeight: 1.55,
    color: '#78716c',
  } as React.CSSProperties,
  fallbackUrl: {
    margin: '0 0 32px',
    fontSize: '12px',
    lineHeight: 1.4,
    color: '#78716c',
    wordBreak: 'break-all' as const,
  } as React.CSSProperties,
  ignoreNote: {
    margin: 0,
    fontSize: '13px',
    lineHeight: 1.6,
    color: '#78716c',
  } as React.CSSProperties,
} satisfies Record<string, React.CSSProperties>;

export const ConfirmEmail = ({ confirmUrl }: ConfirmEmailProps) => (
  <Layout previewText="Falta um clique para começar a receber novos artigos.">
    <Section>
      <Heading as="h1" style={styles.heading}>
        Falta um clique para confirmar
      </Heading>
      <Text style={styles.intro}>
        Obrigado por assinar o blog da Agility Creative. Para começar a receber novos
        artigos, confirme que este e-mail é seu clicando no botão abaixo.
      </Text>
      <Section style={styles.buttonWrap}>
        <Button href={confirmUrl} style={styles.button}>
          Confirmar inscrição
        </Button>
      </Section>
      <Text style={styles.fallbackLabel}>Ou copie e cole este link no navegador:</Text>
      <Text style={styles.fallbackUrl}>
        <Link href={confirmUrl} style={{ color: '#78716c' }}>{confirmUrl}</Link>
      </Text>
      <Text style={styles.ignoreNote}>
        Se você não se inscreveu, é só ignorar este e-mail — sem confirmação não
        enviaremos mais nada.
      </Text>
    </Section>
  </Layout>
);

// Hot-reloaded preview at http://localhost:3001/preview/ConfirmEmail
ConfirmEmail.PreviewProps = {
  confirmUrl: 'https://www.agilitycreative.com/blog/confirm?token=preview-token',
} satisfies ConfirmEmailProps;

export default ConfirmEmail;
