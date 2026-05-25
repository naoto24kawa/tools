import { test, expect } from '@playwright/test';

test.describe('CSS Gradient Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/css-gradient');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/CSS Gradient/i);
  });

  test('should display gradient preview area', async ({ page }) => {
    await expect(page.getByLabel('グラデーションプレビュー')).toBeVisible();
  });

  test('should show gradient type buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'linear' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'radial' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'conic' })).toBeVisible();
  });

  test('should show CSS Code output containing gradient', async ({ page }) => {
    const codeBlock = page.locator('code').filter({ hasText: 'gradient' });
    await expect(codeBlock).toBeVisible();
    const text = await codeBlock.textContent();
    expect(text).toContain('gradient');
  });

  test('should show angle slider for linear gradient', async ({ page }) => {
    await expect(page.getByLabel('グラデーション角度')).toBeVisible();
  });

  test('should display Color Stops controls', async ({ page }) => {
    await expect(page.getByText('Color Stops')).toBeVisible();
  });

  test('should show Add stop button', async ({ page }) => {
    await expect(page.getByText('+ Add')).toBeVisible();
  });

  test('should show preset gradient buttons', async ({ page }) => {
    await expect(page.getByText('Presets')).toBeVisible();
    const presetButtons = page.locator('button[aria-label*="プリセット"]');
    const count = await presetButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should update CSS output when switching to radial type', async ({ page }) => {
    await page.getByRole('button', { name: 'radial' }).click();
    const codeBlock = page.locator('code').filter({ hasText: 'radial-gradient' });
    await expect(codeBlock).toBeVisible();
  });

  test('should show Copy CSS button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Copy CSS/i })).toBeVisible();
  });
});
