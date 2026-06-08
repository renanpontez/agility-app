import {
  Button,
  Heading,
  Img,
  Link,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

import type { BlogBodyBlock } from '@/types/blog';

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
  /**
   * Full article body as structured blocks. Rendered inline so the
   * newsletter reads as the article itself, not just a teaser.
   */
  body: BlogBodyBlock[];
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
    color: '#BC01FD',
  } as React.CSSProperties,
  heading: {
    margin: '0 0 16px',
    fontSize: '28px',
    fontWeight: 600,
    letterSpacing: '-0.02em',
    lineHeight: 1.2,
    color: '#1c1917',
  } as React.CSSProperties,
  excerpt: {
    margin: '0 0 32px',
    fontSize: '16px',
    lineHeight: 1.6,
    color: '#44403c',
    fontStyle: 'italic' as const,
  } as React.CSSProperties,
  paragraph: {
    margin: '0 0 18px',
    fontSize: '15px',
    lineHeight: 1.7,
    color: '#1c1917',
  } as React.CSSProperties,
  h2: {
    margin: '32px 0 12px',
    fontSize: '20px',
    fontWeight: 600,
    letterSpacing: '-0.01em',
    lineHeight: 1.25,
    color: '#1c1917',
  } as React.CSSProperties,
  h3: {
    margin: '28px 0 10px',
    fontSize: '17px',
    fontWeight: 600,
    letterSpacing: '-0.005em',
    lineHeight: 1.3,
    color: '#1c1917',
  } as React.CSSProperties,
  list: {
    margin: '0 0 18px',
    paddingLeft: '22px',
    fontSize: '15px',
    lineHeight: 1.7,
    color: '#1c1917',
  } as React.CSSProperties,
  listItem: {
    margin: '0 0 6px',
  } as React.CSSProperties,
  quote: {
    margin: '24px 0',
    padding: '4px 0 4px 18px',
    borderLeft: '3px solid #BC01FD',
    fontSize: '16px',
    lineHeight: 1.6,
    color: '#44403c',
    fontStyle: 'italic' as const,
  } as React.CSSProperties,
  quoteCite: {
    margin: '8px 0 0',
    fontSize: '13px',
    lineHeight: 1.5,
    color: '#78716c',
    fontStyle: 'normal' as const,
  } as React.CSSProperties,
  figure: {
    margin: '24px 0',
  } as React.CSSProperties,
  figureImg: {
    display: 'block',
    width: '100%',
    maxWidth: '512px',
    height: 'auto',
    borderRadius: '10px',
    border: 0,
    outline: 'none',
  } as React.CSSProperties,
  figureCaption: {
    margin: '8px 0 0',
    fontSize: '12px',
    lineHeight: 1.5,
    color: '#78716c',
    textAlign: 'center' as const,
  } as React.CSSProperties,
  code: {
    margin: '0 0 18px',
    padding: '14px 16px',
    background: '#f5f5f4',
    borderRadius: '8px',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    fontSize: '13px',
    lineHeight: 1.55,
    color: '#1c1917',
    whiteSpace: 'pre-wrap' as const,
    wordBreak: 'break-word' as const,
  } as React.CSSProperties,
  ctaWrap: {
    margin: '40px 0 8px',
    textAlign: 'center' as const,
  } as React.CSSProperties,
  ctaButton: {
    background: '#1c1917',
    color: '#fafaf9',
    padding: '13px 22px',
    borderRadius: '999px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 500,
    letterSpacing: '-0.005em',
  } as React.CSSProperties,
  moreCta: {
    margin: '36px 0 0',
    padding: '24px',
    background: '#f5f5f4',
    borderRadius: '14px',
    textAlign: 'center' as const,
  } as React.CSSProperties,
  moreCtaTitle: {
    margin: '0 0 8px',
    fontSize: '15px',
    fontWeight: 600,
    color: '#1c1917',
  } as React.CSSProperties,
  moreCtaText: {
    margin: '0 0 16px',
    fontSize: '13px',
    lineHeight: 1.55,
    color: '#57534e',
  } as React.CSSProperties,
  moreCtaLink: {
    color: '#BC01FD',
    fontSize: '14px',
    fontWeight: 600,
    textDecoration: 'none',
  } as React.CSSProperties,
} satisfies Record<string, React.CSSProperties>;

const renderBlock = (block: BlogBodyBlock, idx: number): React.ReactNode => {
  switch (block.type) {
    case 'paragraph':
      return <Text key={idx} style={styles.paragraph}>{block.text}</Text>;
    case 'heading':
      return (
        <Heading
          key={idx}
          as={block.level === 3 ? 'h3' : 'h2'}
          style={block.level === 3 ? styles.h3 : styles.h2}
        >
          {block.text}
        </Heading>
      );
    case 'list': {
      const items = block.items.map((item, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <li key={i} style={styles.listItem}>{item}</li>
      ));
      return block.ordered
        ? <ol key={idx} style={styles.list}>{items}</ol>
        : <ul key={idx} style={styles.list}>{items}</ul>;
    }
    case 'quote':
      return (
        <Section key={idx} style={styles.quote}>
          <Text style={{ ...styles.quote, border: 'none', margin: 0, padding: 0 }}>
            {block.text}
          </Text>
          {block.cite
            ? <Text style={styles.quoteCite}>{`— ${block.cite}`}</Text>
            : null}
        </Section>
      );
    case 'image':
      return (
        <Section key={idx} style={styles.figure}>
          <Img src={block.src} alt={block.alt} style={styles.figureImg} />
          {block.caption
            ? <Text style={styles.figureCaption}>{block.caption}</Text>
            : null}
        </Section>
      );
    case 'code':
      return <pre key={idx} style={styles.code}><code>{block.code}</code></pre>;
    default:
      return null;
  }
};

export const NewPostEmail = ({
  title,
  excerpt,
  category,
  coverImage,
  coverAlt,
  postUrl,
  unsubscribeUrl,
  body,
}: NewPostEmailProps) => {
  const blogUrl = `${EMAIL_CONFIG.baseUrl}/blog`;

  return (
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
        <Heading as="h1" style={styles.heading}>{title}</Heading>
        <Text style={styles.excerpt}>{excerpt}</Text>
      </Section>

      <Section>
        {body.map(renderBlock)}
      </Section>

      <Section style={styles.ctaWrap}>
        <Button href={postUrl} style={styles.ctaButton}>
          Ver no site →
        </Button>
      </Section>

      <Section style={styles.moreCta}>
        <Text style={styles.moreCtaTitle}>Quer mais leituras como essa?</Text>
        <Text style={styles.moreCtaText}>
          Explore todos os artigos do blog da Agility Creative — tecnologia, IA e ideias
          que importam.
        </Text>
        <Link href={blogUrl} style={styles.moreCtaLink}>Ver mais artigos →</Link>
      </Section>
    </Layout>
  );
};

// PreviewProps powers the react-email dev server — open
// http://localhost:3033/preview/NewPostEmail and you see this rendered live
// with the props below, hot-reloaded on save.
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
  body: [
    {
      type: 'paragraph',
      text:
        'Golpe no WhatsApp e Instagram não é falha técnica — é engenharia social. O atacante não invade nada; ele convence você a entregar o acesso, a transferência ou o código de SMS por vontade própria.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'O padrão por trás de quase todo golpe',
    },
    {
      type: 'paragraph',
      text:
        'Em três passos: 1) urgência fabricada, 2) autoridade emprestada (um banco, um amigo, um chefe), 3) uma ação que parece pequena mas é irreversível. Se o seu cérebro registra os três ao mesmo tempo, é golpe — mesmo que pareça legítimo.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'O checklist das 5 perguntas',
    },
    {
      type: 'list',
      items: [
        'Estou sob pressão de tempo? (urgência fabricada)',
        'Esta pessoa pediu algo financeiro ou de acesso? (objetivo do golpe)',
        'O contato chegou por canal estranho — número novo, link curto, e-mail genérico?',
        'A história tem um detalhe estranho — sotaque mudou, evita ligação, escreve diferente?',
        'O que estou prestes a fazer é reversível?',
      ],
    },
    {
      type: 'quote',
      text:
        'Se três das cinco perguntas baterem, pare. Não responda. Ligue para a pessoa em um número que você já tinha salvo antes — não o número que mandou a mensagem.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'O que fazer se já caiu',
    },
    {
      type: 'paragraph',
      text:
        'Bloqueie o WhatsApp ou Instagram imediatamente pela central de ajuda, registre B.O. online e avise todos os contatos próximos — o golpista vai tentar usar sua identidade para enganar outras pessoas nas próximas horas.',
    },
  ],
} satisfies NewPostEmailProps;

export default NewPostEmail;
