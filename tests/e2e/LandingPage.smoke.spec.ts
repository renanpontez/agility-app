import { expect, test } from '@playwright/test';

// Smoke coverage for the V2 landing page's important, user-facing features.
// Also doubles as a guard for the security-hardening branch: it asserts the new
// security headers are applied and that the Report-Only CSP does not break the
// page (no page errors, and any CSP violations are surfaced, not silently
// swallowed) — the signal we need before flipping the CSP to enforcing.
//
// Dev builds compile routes on-demand, so the first navigation to each route can
// be slow; timeouts are generous on purpose.

const HERO_PREFIX = 'Transformando ideias em';
const HERO_HIGHLIGHT = 'soluções que inspiram';
const PORTFOLIO = ['RM Projeto & Construção', 'Smayly Maia', 'Dra. Barbarela Freire', 'MR Advogados'];

test.describe('Landing page (pt-BR)', () => {
  test.describe.configure({ mode: 'serial' });

  test('loads with a 200 and the hardening security headers', async ({ page }) => {
    test.setTimeout(120_000);
    const response = await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 120_000 });

    expect(response?.status()).toBe(200);
    const headers = response?.headers() ?? {};
    // From next.config.mjs security headers — proves the middleware/header layer
    // is live and, crucially, that the CSP is still Report-Only (not enforcing).
    expect(headers['x-frame-options']).toBe('DENY');
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    expect(headers['content-security-policy-report-only']).toBeTruthy();
    expect(headers['content-security-policy']).toBeUndefined();
  });

  test('renders the hero headline and both CTAs', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 120_000 });

    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toBeVisible();
    await expect(h1).toContainText(HERO_PREFIX);
    await expect(h1).toContainText(HERO_HIGHLIGHT);

    // Hero CTAs anchor to the contact + services sections.
    await expect(page.locator('a[href="#Contato"]').first()).toBeVisible();
    await expect(page.locator('a[href="#Servicos"]').first()).toBeVisible();
  });

  test('navbar shows brand, links and the contact CTA', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 120_000 });

    const nav = page.getByRole('navigation');
    await expect(nav.getByRole('link', { name: 'Portfólio' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Serviços' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Blog' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Fale conosco' }).first()).toBeVisible();
    await expect(page.locator('img[alt="Agility"]').first()).toBeVisible();
  });

  test('core sections and service cards are present', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 120_000 });

    for (const id of ['Sobre', 'Servicos', 'Portfolio']) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
    // "30+ projects delivered" stat in the About block.
    await expect(page.getByText('30+')).toBeVisible();
    // Four service cards render.
    await page.locator('#Servicos').scrollIntoViewIfNeeded();
    await expect(page.locator('#Servicos h3')).toHaveCount(4);
  });

  test('portfolio grid lists projects that link to detail pages', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 120_000 });
    await page.locator('#Portfolio').scrollIntoViewIfNeeded();

    for (const name of PORTFOLIO) {
      await expect(page.getByText(name, { exact: false }).first()).toBeVisible();
    }
    // Cards deep-link to /portfolio/<slug>.
    await expect(page.locator('a[href="/portfolio/rm-projeto-e-construcao"]')).toHaveCount(1);
    await expect(page.locator('a[href="/portfolio/smayly-maia"]')).toHaveCount(1);
  });

  test('FAQ accordion expands an answer on click', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 120_000 });

    const firstQuestion = page.locator('button', { has: page.locator('svg') }).filter({ hasText: /\?/ }).first();
    await firstQuestion.scrollIntoViewIfNeeded();
    // The answer sits in a grid that animates from grid-rows-[0fr] → [1fr]; the
    // <p> itself keeps its natural box (only clipped by an overflow-hidden
    // ancestor), so assert on the collapsing wrapper's measured height instead.
    const wrapper = firstQuestion.locator('xpath=following-sibling::div[1]');
    expect((await wrapper.boundingBox())?.height ?? 0).toBeLessThan(5);
    await firstQuestion.click();
    await expect.poll(async () => (await wrapper.boundingBox())?.height ?? 0).toBeGreaterThan(20);
    await expect(wrapper.locator('p')).toBeVisible();
  });

  test('contact form is fillable and hands off to WhatsApp', async ({ page, context }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 120_000 });
    await page.getByText('Quer falar com a gente?').scrollIntoViewIfNeeded();

    // Stub the outbound WhatsApp deep-link so the popup never hits the network.
    await context.route(/wa\.me/, route => route.fulfill({ status: 200, contentType: 'text/plain', body: 'stub' }));

    const form = page.locator('form').filter({ has: page.getByRole('button', { name: 'Enviar mensagem' }) });

    // This page ships heavy client JS (three.js / tsparticles / motion), so in
    // dev React can attach `onSubmit` a beat after the HTML is interactive-looking.
    // Retry fill+submit until it's hydrated: an un-hydrated submit does a native
    // GET (page navigates, no popup); once hydrated, preventDefault runs and
    // window.open fires the wa.me popup carrying the prefilled message.
    await expect(async () => {
      await form.locator('input').first().fill('Playwright Tester');
      await form.locator('input').nth(1).fill('tester@example.com');
      await form.locator('textarea').fill('Testing the contact flow.');

      const popupPromise = page.waitForEvent('popup', { timeout: 2500 });
      await form.getByRole('button', { name: 'Enviar mensagem' }).click();
      const popup = await popupPromise;
      await popup.waitForLoadState('domcontentloaded').catch(() => {});

      const url = popup.url();
      expect(url).toContain('wa.me/+5585996284730');
      expect(url).toContain(encodeURIComponent('Playwright Tester'));
      await popup.close();
    }).toPass({ timeout: 30_000 });
  });

  test('final CTA exposes a WhatsApp link', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 120_000 });
    await expect(page.locator('a[href^="https://wa.me/"]').first()).toBeVisible();
  });
});

test.describe('Landing page — cross-cutting', () => {
  test('English locale route renders translated content', async ({ page }) => {
    test.setTimeout(120_000);
    await page.goto('/en', { waitUntil: 'domcontentloaded', timeout: 120_000 });

    await expect(page.getByRole('heading', { level: 1 })).toContainText('Transforming ideas into');
    await expect(page.getByRole('navigation').getByRole('link', { name: 'Contact us' }).first()).toBeVisible();
  });

  test('mobile menu toggles the nav links', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 120_000 });

    const menuButton = page.getByRole('button', { name: 'Menu' });
    await expect(menuButton).toBeVisible();
    await menuButton.click();
    // The hidden desktop links (display:none) and the footer (contentinfo) drop
    // out of the a11y tree, so scoping to the nav + exact name leaves just the
    // one mobile-menu link.
    await expect(page.getByRole('navigation').getByRole('link', { name: 'Portfólio', exact: true })).toBeVisible();
  });

  test('no uncaught page errors, and CSP violations are surfaced', async ({ page }, testInfo) => {
    test.setTimeout(120_000);
    const pageErrors: string[] = [];
    const cspViolations: string[] = [];
    page.on('pageerror', err => pageErrors.push(err.message));
    page.on('console', (msg) => {
      const text = msg.text();
      if (/content security policy|refused to (?:load|execute|connect|apply)/i.test(text)) {
        cspViolations.push(text);
      }
    });

    await page.goto('/', { waitUntil: 'load', timeout: 120_000 });
    // Scroll to the lazy/dynamic sections (three.js, particles, ContactSection)
    // so their scripts execute and any CSP/console output is captured before we
    // assert — a deterministic settle instead of a fixed timeout.
    await page.getByText('Quer falar com a gente?').scrollIntoViewIfNeeded();
    await expect(page.getByText('Quer falar com a gente?')).toBeVisible();

    // Report-Only CSP violations don't break the page, but surface them (always,
    // even when empty) so they can be cleared before switching to enforcing.
    await testInfo.attach('csp-report-only-violations', {
      body: cspViolations.join('\n') || '(none)',
      contentType: 'text/plain',
    });
    console.warn(`[CSP Report-Only] ${cspViolations.length} violation(s) observed on '/'.`);

    expect(pageErrors, `Uncaught page errors:\n${pageErrors.join('\n')}`).toHaveLength(0);
  });
});
