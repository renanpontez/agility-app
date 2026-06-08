import {
  Button,
  Heading,
  Img,
  Link,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

import { EMAIL_CONFIG } from '../config';
import { Layout } from './_layout';

export type NewPostEmailProps = {
  title: string;
  excerpt: string;
  category?: string;
  coverImage?: string;
  coverAlt?: string;
  postUrl: string;
  unsubscribeUrl: string;
};

const styles = {
  coverLink: {
    display: 'block',
    margin: '0 0 28px',
    borderRadius: '14px',
    overflow: 'hidden',
    textDecoration: 'none',
  } as React.CSSProperties,
  coverImg: {
    display: 'block',
    width: '100%',
    maxWidth: '512px',
    height: 'auto',
    border: 0,
    outline: 'none',
    textDecoration: 'none',
    borderRadius: '14px',
  } as React.CSSProperties,
  category: {
    margin: '0 0 16px',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.18em',
    textTransform: 'uppercase' as const,
    color: EMAIL_CONFIG.brandColor,
  } as React.CSSProperties,
  heading: {
    margin: '0 0 16px',
    fontSize: '26px',
    fontWeight: 600,
    letterSpacing: '-0.02em',
    lineHeight: 1.2,
    color: '#1c1917',
  } as React.CSSProperties,
  excerpt: {
    margin: '0 0 32px',
    fontSize: '15px',
    lineHeight: 1.65,
    color: '#44403c',
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
} satisfies Record<string, React.CSSProperties>;

export const NewPostEmail = ({
  title,
  excerpt,
  category,
  coverImage,
  coverAlt,
  postUrl,
  unsubscribeUrl,
}: NewPostEmailProps) => (
  <Layout previewText={excerpt} unsubscribeUrl={unsubscribeUrl}>
    {coverImage
      ? (
          <Section>
            <Link href={postUrl} style={styles.coverLink}>
              <Img
                src={coverImage}
                alt={coverAlt ?? title}
                width="512"
                style={styles.coverImg}
              />
            </Link>
          </Section>
        )
      : null}

    {category
      ? (
          <Section>
            <Text style={styles.category}>{category}</Text>
          </Section>
        )
      : null}

    <Section>
      <Heading as="h1" style={styles.heading}>
        {title}
      </Heading>
      <Text style={styles.excerpt}>{excerpt}</Text>
      <Button href={postUrl} style={styles.button}>
        Ler artigo completo →
      </Button>
    </Section>
  </Layout>
);

// PreviewProps powers the react-email dev server — open
// http://localhost:3001/preview/NewPostEmail and you see this rendered live with
// the props below, hot-reloaded on save.
NewPostEmail.PreviewProps = {
  title: 'Como não cair em golpes do WhatsApp e Instagram',
  excerpt:
    'A engenharia social por trás do golpe — e o checklist de 5 perguntas para evitar cair.',
  category: 'Segurança',
  coverImage:
    'https://images.unsplash.com/photo-1517292987719-0369a794ec0f?w=1024&h=576&fit=crop&fm=jpg&q=80',
  coverAlt: 'Pessoa digitando em um teclado de notebook',
  postUrl:
    'https://www.agilitycreative.com/blog/seguranca/golpes-whatsapp-instagram',
  unsubscribeUrl:
    'https://www.agilitycreative.com/blog/unsubscribe?token=preview-token',
} satisfies NewPostEmailProps;

export default NewPostEmail;
