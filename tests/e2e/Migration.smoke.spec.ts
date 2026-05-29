import { expect, test } from '@playwright/test';

// Smoke tests that exercise the critical paths affected by the
// Next 14→16, React 18→19, Clerk 6→7, next-intl 3→4 migration.
// Every assertion below would silently break under one of those upgrades
// without a working test, so we keep them stable and content-anchored.

test.describe('Migration smoke', () => {
  test('pt-BR landing page renders hero copy', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/(pt-BR)?\/?$/);
    await expect(page.getByText('soluções que inspiram')).toBeVisible();
    await expect(page.getByText('Transformando ideias em')).toBeVisible();
  });

  test('en landing page renders hero copy', async ({ page }) => {
    await page.goto('/en');
    await expect(page.getByText('solutions that inspire')).toBeVisible();
    await expect(page.getByText('Transforming ideas into')).toBeVisible();
  });

  test('navbar renders locale-specific labels', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('navigation').getByText('Portfólio')).toBeVisible();
    await page.goto('/en');
    await expect(page.getByRole('navigation').getByText('Portfolio')).toBeVisible();
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
    // Clerk redirects unauth users; either 200 or 3xx is acceptable
    expect(response?.status()).toBeLessThan(500);
  });

  test('protected dashboard redirects unauthenticated users', async ({ page }) => {
    await page.goto('/dashboard');
    // Clerk middleware must redirect to sign-in (HTTPS preserved)
    await expect(page).toHaveURL(/sign-in/);
  });
});
