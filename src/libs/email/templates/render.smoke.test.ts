import { describe, expect, it } from 'vitest';

import { buildConfirmEmail } from './confirm';
import { buildNewPostEmail } from './new-post';

describe('email templates render', () => {
  it('builds a well-formed NewPost email', async () => {
    const { subject, html, text } = await buildNewPostEmail({
      title: 'Alexa+ chega ao Brasil',
      excerpt: 'O que muda no dia a dia.',
      category: 'IA',
      coverImage: 'https://example.com/cover.jpg',
      coverAlt: 'capa',
      postUrl: 'https://www.agilitycreative.com/blog/ia/alexa-plus',
      unsubscribeUrl: 'https://www.agilitycreative.com/blog/unsubscribe?token=x',
    });
    expect(subject).toBe('Alexa+ chega ao Brasil');
    expect(html).toMatch(/^<!DOCTYPE html/i);
    expect(html).toContain('Alexa+ chega ao Brasil');
    expect(html).toContain('Ler artigo completo');
    expect(html).toContain('Cancelar inscrição');
    expect(text).toContain('Ler completo: https://www.agilitycreative.com/blog/ia/alexa-plus');
  });

  it('builds a well-formed Confirm email', async () => {
    const { subject, html, text } = await buildConfirmEmail({
      confirmUrl: 'https://www.agilitycreative.com/blog/confirm?token=abc',
    });
    expect(subject).toMatch(/Confirme/i);
    expect(html).toMatch(/^<!DOCTYPE html/i);
    expect(html).toContain('Confirmar inscrição');
    expect(html).toContain('blog/confirm?token=abc');
    expect(text).toContain('https://www.agilitycreative.com/blog/confirm?token=abc');
  });
});
