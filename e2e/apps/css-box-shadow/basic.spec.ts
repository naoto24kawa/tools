import { test, expect } from '@playwright/test';

test.describe('CSS Box Shadow Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/css-box-shadow');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/CSS Box Shadow/i);
  });

  test('should display box shadow preview', async ({ page }) => {
    await expect(page.getByLabel('ボックスシャドウプレビュー')).toBeVisible();
  });

  test('should show Shadow Layers section', async ({ page }) => {
    await expect(page.getByText('Shadow Layers')).toBeVisible();
  });

  test('should show Add layer button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Add/i })).toBeVisible();
  });

  test('should display Layer 1 controls', async ({ page }) => {
    await expect(page.getByText('Layer 1')).toBeVisible();
  });

  test('should show X, Y, Blur, Spread sliders', async ({ page }) => {
    await expect(page.getByLabel('レイヤー 1 X')).toBeVisible();
    await expect(page.getByLabel('レイヤー 1 Y')).toBeVisible();
    await expect(page.getByLabel('レイヤー 1 Blur')).toBeVisible();
    await expect(page.getByLabel('レイヤー 1 Spread')).toBeVisible();
  });

  test('should show Inset checkbox', async ({ page }) => {
    const insetCheckbox = page.locator('input[type="checkbox"]');
    await expect(insetCheckbox).toBeVisible();
  });

  test('should display CSS Code output with box-shadow', async ({ page }) => {
    const codeBlock = page.locator('code').filter({ hasText: 'box-shadow' });
    await expect(codeBlock).toBeVisible();
  });

  test('should show Copy CSS button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Copy CSS/i })).toBeVisible();
  });

  test('should add a new layer when Add button clicked', async ({ page }) => {
    await page.getByRole('button', { name: /Add/i }).click();
    await expect(page.getByText('Layer 2')).toBeVisible();
  });
});
