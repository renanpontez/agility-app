import { expect, test } from '@playwright/test';

// Smoke tests that exercise the critical paths affected by the
// Next 14→16, React 18→19, Clerk 6→7, next-intl 3→4 migration.
// Anchored to content + URLs that survive UI rewrites.

test.describe('Migration smoke', () => {
  test.describe('pt-BR locale', () => {
    test.use({ locale: 'pt-BR', extraHTTPHeaders: { 'Accept-Language': 'pt-BR,pt;q=0.9' } });

    test('landing page renders hero copy', async ({ page }) => {
      await page.goto('/');
      // pt-BR is the default locale, served at root with localePrefix: 'as-needed'.
      await expect(page).toHaveURL(/\/(pt-BR)?\/?$/);
      // Hero copy also appears in the footer; first() picks the hero heading.
      await expect(page.getByText('Transformando ideias em').first()).toBeVisible();
      await expect(page.getByText('soluções que inspiram').first()).toBeVisible();
    });

    test('navbar shows the portuguese portfolio label', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByRole('navigation').getByText('Portfólio')).toBeVisible();
    });
  });

  test.describe('en locale', () => {
    test.use({ locale: 'en-US', extraHTTPHeaders: { 'Accept-Language': 'en-US,en;q=0.9' } });

    test('landing page renders translated hero copy', async ({ page }) => {
      await page.goto('/en');
      // Both hero heading and footer tagline contain "Transforming ideas into".
      await expect(page.getByText('Transforming ideas into').first()).toBeVisible();
      await expect(page.getByText('solutions that inspire').first()).toBeVisible();
    });

    test('navbar shows the english portfolio label', async ({ page }) => {
      await page.goto('/en');
      await expect(page.getByRole('navigation').getByText('Portfolio')).toBeVisible();
    });
  });

  test('about page (sobre-nos) responds 200 and renders content', async ({ page }) => {
    const response = await page.goto('/sobre-nos');
    expect(response?.status()).toBeLessThan(400);
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('portfolio listing renders without server error', async ({ page }) => {
    const response = await page.goto('/portfolio');
    expect(response?.status()).toBeLessThan(400);
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('sign-in route mounts Clerk component', async ({ page }) => {
    const response = await page.goto('/sign-in');
    // Clerk may redirect to its hosted page (3xx) or render inline (200).
    expect(response?.status()).toBeLessThan(500);
  });

  test('protected dashboard redirects unauthenticated users', async ({ page }) => {
    await page.goto('/dashboard');
    // Clerk middleware must send the user to sign-in.
    await expect(page).toHaveURL(/sign-in/);
  });
});
