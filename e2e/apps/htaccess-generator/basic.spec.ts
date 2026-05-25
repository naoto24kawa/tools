import { test, expect } from '@playwright/test';

test.describe('.htaccess Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/htaccess-generator');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText(/\.htaccess Generator/i)).toBeVisible();
  });

  test('should show preview pane with generated output', async ({ page }) => {
    // The <pre> element contains generated .htaccess content
    const preview = page.locator('pre');
    await expect(preview).toBeVisible();
    const content = await preview.textContent();
    expect(content).not.toBe('');
  });

  test('should toggle Force HTTPS and reflect in output', async ({ page }) => {
    const httpsCheckbox = page.locator('#https');
    await httpsCheckbox.check();
    const preview = page.locator('pre');
    await expect(preview).toContainText(/RewriteRule.*https/i);
  });

  test('should toggle CORS and reveal origin input', async ({ page }) => {
    const corsCheckbox = page.locator('#cors');
    await corsCheckbox.check();
    await expect(page.getByPlaceholder(/\* or https:\/\/example\.com/i)).toBeVisible();
  });

  test('should toggle Cache Control and reveal duration input', async ({ page }) => {
    const cacheCheckbox = page.locator('#cache');
    await cacheCheckbox.check();
    await expect(page.getByText(/default cache duration/i)).toBeVisible();
  });

  test('should add a redirect rule and show it in the form', async ({ page }) => {
    await page.getByRole('button', { name: /add/i }).first().click();
    await expect(page.getByPlaceholder('/old-path')).toBeVisible();
    await expect(page.getByPlaceholder('/new-path')).toBeVisible();
  });

  test('should reflect redirect rule in preview output', async ({ page }) => {
    await page.getByRole('button', { name: /add/i }).first().click();
    const fromInput = page.getByPlaceholder('/old-path');
    const toInput = page.getByPlaceholder('/new-path');
    await fromInput.fill('/old');
    await toInput.fill('/new');
    const preview = page.locator('pre');
    await expect(preview).toContainText('/old');
    await expect(preview).toContainText('/new');
  });

  test('should show Copy button and trigger clipboard', async ({ page }) => {
    await page.evaluate(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: () => Promise.resolve() },
        configurable: true,
      });
    });
    await page.getByRole('button', { name: /^copy$/i }).click();
    await expect(page.getByText(/copied to clipboard/i)).toBeVisible();
  });
});
