import { test, expect } from '@playwright/test';

test.describe('CSS Border Radius Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/css-border-radius');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/CSS Border Radius/i);
  });

  test('should display border radius preview', async ({ page }) => {
    await expect(page.getByLabel('ボーダーラジウスプレビュー')).toBeVisible();
  });

  test('should show corner sliders for all four corners', async ({ page }) => {
    await expect(page.getByLabel('Top Left')).toBeVisible();
    await expect(page.getByLabel('Top Right')).toBeVisible();
    await expect(page.getByLabel('Bottom Right')).toBeVisible();
    await expect(page.getByLabel('Bottom Left')).toBeVisible();
  });

  test('should show unit toggle buttons px and %', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'px' })).toBeVisible();
    await expect(page.getByRole('button', { name: '%' })).toBeVisible();
  });

  test('should show linked corners checkbox', async ({ page }) => {
    const checkbox = page.locator('input[type="checkbox"]');
    await expect(checkbox).toBeVisible();
  });

  test('should show CSS output code', async ({ page }) => {
    const code = page.locator('code').filter({ hasText: 'border-radius' });
    await expect(code).toBeVisible();
  });

  test('should show Copy CSS button', async ({ page }) => {
    await expect(page.getByLabel('CSSをコピー')).toBeVisible();
  });

  test('should update CSS when switching unit to %', async ({ page }) => {
    await page.getByRole('button', { name: '%' }).click();
    const code = page.locator('code').filter({ hasText: '%' });
    await expect(code).toBeVisible();
  });
});
