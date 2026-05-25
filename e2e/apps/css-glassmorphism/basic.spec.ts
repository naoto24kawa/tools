import { test, expect } from '@playwright/test';

test.describe('Glassmorphism Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/css-glassmorphism');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Glassmorphism/i);
  });

  test('should display glassmorphism preview', async ({ page }) => {
    await expect(page.getByLabel('Glassmorphismプレビュー')).toBeVisible();
  });

  test('should show Glass Card preview text', async ({ page }) => {
    await expect(page.getByText('Glass Card')).toBeVisible();
  });

  test('should show Blur slider', async ({ page }) => {
    await expect(page.getByLabel('Blur')).toBeVisible();
  });

  test('should show Opacity slider', async ({ page }) => {
    await expect(page.getByLabel('Opacity %')).toBeVisible();
  });

  test('should show Saturation slider', async ({ page }) => {
    await expect(page.getByLabel('Saturation %')).toBeVisible();
  });

  test('should show Border Radius slider', async ({ page }) => {
    await expect(page.getByLabel('Border Radius')).toBeVisible();
  });

  test('should show Border checkbox', async ({ page }) => {
    await expect(page.locator('#border')).toBeVisible();
  });

  test('should display CSS Code output with backdrop-filter', async ({ page }) => {
    const codeBlock = page.locator('pre').filter({ hasText: 'backdrop-filter' });
    await expect(codeBlock).toBeVisible();
  });

  test('should show Copy CSS button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Copy CSS/i })).toBeVisible();
  });

  test('should show color picker for glass color', async ({ page }) => {
    await expect(page.getByLabel('ガラスカラーピッカー')).toBeVisible();
  });
});
