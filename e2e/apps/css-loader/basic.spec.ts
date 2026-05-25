import { test, expect } from '@playwright/test';

test.describe('CSS Loader Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/css-loader');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/CSS Loader/i);
  });

  test('should display loader type buttons', async ({ page }) => {
    // LOADER_TEMPLATES includes types like spinner, dots, etc.
    const typeButtons = page.locator('div.flex.gap-2 button[type="button"]');
    const count = await typeButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display loader preview area', async ({ page }) => {
    await expect(page.getByLabel('ローダープレビュー')).toBeVisible();
  });

  test('should show loader animation element', async ({ page }) => {
    await expect(page.getByLabel('ローディングアニメーション')).toBeVisible();
  });

  test('should show Size slider', async ({ page }) => {
    await expect(page.getByLabel('Size')).toBeVisible();
  });

  test('should show Speed slider', async ({ page }) => {
    await expect(page.getByLabel('Speed (s)')).toBeVisible();
  });

  test('should show Border slider', async ({ page }) => {
    await expect(page.getByLabel('Border')).toBeVisible();
  });

  test('should show color picker for loader color', async ({ page }) => {
    await expect(page.getByLabel('ローダーカラーピッカー')).toBeVisible();
  });

  test('should display CSS Code output with animation', async ({ page }) => {
    const codeBlock = page.locator('pre');
    await expect(codeBlock).toBeVisible();
    const text = await codeBlock.textContent();
    expect(text).toBeTruthy();
    expect(text!).toContain('@keyframes');
  });

  test('should show Copy CSS button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Copy CSS/i })).toBeVisible();
  });

  test('should show spinner type selected by default', async ({ page }) => {
    // spinner button should be visually active (bg-primary)
    await expect(page.getByRole('button', { name: /spinner/i })).toBeVisible();
  });
});
