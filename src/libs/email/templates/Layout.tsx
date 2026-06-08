import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

import { EMAIL_CONFIG } from '../config';

// Shared shell for every email. Same layout the inline-HTML templates used
// (560px max-width container, light bg, header/footer, hidden preview text)
// — refactored into React Email primitives so:
//   - `react-email dev` can preview templates with hot reload
//   - templates compose with `<Layout>` instead of string concatenation
//   - `render(<Component />)` produces email-client-safe HTML and a plain-text fallback
//
// Inline styles only (Gmail strips <style> blocks) and explicit colors on
// every text node (dark-mode inversion is unpredictable).

const FONT_STACK
  = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, "Helvetica Neue", Arial, sans-serif';

const styles = {
  body: {
    margin: 0,
    padding: 0,
    background: '#fafaf9',
    fontFamily: FONT_STACK,
    color: '#1c1917',
    WebkitFontSmoothing: 'antialiased',
  } as React.CSSProperties,
  container: {
    maxWidth: '560px',
    margin: '0 auto',
    padding: '40px 24px 56px',
  } as React.CSSProperties,
  headerLink: {
    textDecoration: 'none',
    color: '#1c1917',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
  } as React.CSSProperties,
  headerMark: {
    display: 'inline-block',
    width: '24px',
    height: '24px',
    background: EMAIL_CONFIG.brandColor,
    borderRadius: '6px',
  } as React.CSSProperties,
  headerBrand: {
    fontSize: '15px',
    letterSpacing: '-0.01em',
    fontWeight: 700,
  } as React.CSSProperties,
  headerHr: {
    border: 'none',
    borderTop: '1px solid rgba(0,0,0,0.06)',
    margin: '32px 0 32px',
  } as React.CSSProperties,
  footerHr: {
    border: 'none',
    borderTop: '1px solid rgba(0,0,0,0.06)',
    margin: '48px 0 24px',
  } as React.CSSProperties,
  footerText: {
    margin: 0,
    fontSize: '12px',
    lineHeight: 1.55,
    color: '#78716c',
  } as React.CSSProperties,
  footerLink: {
    color: '#78716c',
  } as React.CSSProperties,
  unsubscribe: {
    margin: '24px 0 0',
    fontSize: '11px',
    lineHeight: 1.5,
    color: '#a8a29e',
    textAlign: 'center' as const,
  } as React.CSSProperties,
} satisfies Record<string, React.CSSProperties>;

export type LayoutProps = {
  /**
   * Inbox preview text — the snippet shown next to the subject line in most
   * inboxes. Set this to a tight one-liner that complements the subject.
   */
  previewText: string;
  /**
   * If present, renders a centered "Cancelar inscrição" link in the footer
   * pointing at this URL. Used by the new-post email; omitted on confirmation.
   */
  unsubscribeUrl?: string;
  children: React.ReactNode;
};

const blogUrl = `${EMAIL_CONFIG.baseUrl}/blog`;

export const Layout = ({ previewText, unsubscribeUrl, children }: LayoutProps) => (
  <Html lang="pt-BR">
    <Head>
      <meta name="x-apple-disable-message-reformatting" />
      <meta name="color-scheme" content="light" />
      <meta name="supported-color-schemes" content="light" />
    </Head>
    <Preview>{previewText}</Preview>
    <Body style={styles.body}>
      <Container style={styles.container}>
        <Section>
          <Link href={blogUrl} style={styles.headerLink}>
            <span style={styles.headerMark} />
            <span style={styles.headerBrand}>Agility Creative</span>
          </Link>
        </Section>
        <Hr style={styles.headerHr} />
        {children}
        <Hr style={styles.footerHr} />
        <Section>
          <Text style={styles.footerText}>
            Você está recebendo este e-mail porque assinou o blog da Agility Creative em
            {' '}
            <Link href={blogUrl} style={styles.footerLink}>agilitycreative.com</Link>
            .
          </Text>
          {unsubscribeUrl
            ? (
                <Text style={styles.unsubscribe}>
                  Não quer mais receber?
                  {' '}
                  <Link href={unsubscribeUrl} style={{ color: '#78716c', textDecoration: 'underline' }}>
                    Cancelar inscrição
                  </Link>
                  .
                </Text>
              )
            : null}
        </Section>
      </Container>
    </Body>
  </Html>
);

export default Layout;
