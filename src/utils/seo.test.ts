import { describe, expect, it, vi } from 'vitest';

import { buildAlternates, localizedPath, localizedUrl, ogAlternateLocales, ogLocale } from './seo';

// Pin the helpers used by every page's generateMetadata so a regression in
// localizedPath/localizedUrl trips here instead of silently corrupting canonical
// or hreflang tags.

vi.mock('./Helpers', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./Helpers')>();
  return {
    ...actual,
    getBaseUrl: () => 'https://www.agilitycreative.com',
  };
});

describe('localizedPath', () => {
  it('returns the bare path for the default locale', () => {
    expect(localizedPath('pt-BR', '/sobre-nos')).toBe('/sobre-nos');
    expect(localizedPath('pt-BR', '/')).toBe('/');
  });

  it('prefixes non-default locales', () => {
    expect(localizedPath('en', '/sobre-nos')).toBe('/en/sobre-nos');
    expect(localizedPath('en', '/')).toBe('/en');
  });

  it('normalises paths missing a leading slash', () => {
    expect(localizedPath('en', 'portfolio')).toBe('/en/portfolio');
  });
});

describe('localizedUrl', () => {
  it('produces fully-qualified URLs', () => {
    expect(localizedUrl('pt-BR', '/')).toBe('https://www.agilitycreative.com/');
    expect(localizedUrl('en', '/portfolio')).toBe('https://www.agilitycreative.com/en/portfolio');
  });
});

describe('buildAlternates', () => {
  it('emits canonical, both locales and x-default', () => {
    const result = buildAlternates('en', '/sobre-nos');
    expect(result.canonical).toBe('/en/sobre-nos');
    expect(result.languages).toEqual({
      'pt-BR': '/sobre-nos',
      'en': '/en/sobre-nos',
      'x-default': '/sobre-nos',
    });
  });

  it('keeps x-default pointing at the default locale even when canonical is default', () => {
    const result = buildAlternates('pt-BR', '/portfolio');
    expect(result.canonical).toBe('/portfolio');
    expect(result.languages['x-default']).toBe('/portfolio');
  });
});

describe('ogLocale', () => {
  it('maps project locales to Open Graph format', () => {
    expect(ogLocale('pt-BR')).toBe('pt_BR');
    expect(ogLocale('en')).toBe('en_US');
  });
});

describe('ogAlternateLocales', () => {
  it('returns every supported locale except the active one', () => {
    expect(ogAlternateLocales('pt-BR')).toEqual(['en_US']);
    expect(ogAlternateLocales('en')).toEqual(['pt_BR']);
  });
});
