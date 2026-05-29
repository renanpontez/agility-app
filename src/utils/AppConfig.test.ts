import { AppConfig } from '@/utils/AppConfig';

// These tests pin the AppConfig contract that drives next-intl v4 routing.
// next-intl's `getRequestConfig` is server-only and can't be run from Vitest's
// jsdom env, so we exercise the configuration directly here. The Playwright
// smoke tests in tests/e2e/Migration.smoke.spec.ts cover the runtime path.

describe('AppConfig (drives next-intl v4 routing)', () => {
  it('declares pt-BR and en as supported locales', () => {
    expect(AppConfig.locales).toContain('pt-BR');
    expect(AppConfig.locales).toContain('en');
  });

  it('defaults to pt-BR', () => {
    expect(AppConfig.defaultLocale).toBe('pt-BR');
  });

  it('uses as-needed locale prefix', () => {
    expect(AppConfig.localePrefix).toBe('as-needed');
  });

  it('default locale is always in the supported list', () => {
    expect(AppConfig.locales).toContain(AppConfig.defaultLocale);
  });
});
