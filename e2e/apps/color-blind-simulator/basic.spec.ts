import { test, expect } from '@playwright/test';

test.describe('Color Blind Simulator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/color-blind-simulator');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Color Blind Simulator/i);
  });

  test('should display color picker for simulation target', async ({ page }) => {
    await expect(page.getByLabel('シミュレーション対象カラーピッカー')).toBeVisible();
  });

  test('should show multiple simulation type cards', async ({ page }) => {
    // The grid shows simulations for different color blindness types
    const cards = page.locator('[class*="grid"] > div');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display Protanopia simulation card', async ({ page }) => {
    // Japanese: 1型 (P型) - appears in card header and palette comparison
    await expect(page.getByText('1型 (P型)').first()).toBeVisible();
  });

  test('should display Deuteranopia simulation card', async ({ page }) => {
    // Japanese: 2型 (D型) - appears in card header and palette comparison
    await expect(page.getByText('2型 (D型)').first()).toBeVisible();
  });

  test('should display Tritanopia simulation card', async ({ page }) => {
    // Japanese: 3型 (T型) - appears in card header and palette comparison
    await expect(page.getByText('3型 (T型)').first()).toBeVisible();
  });

  test('should display Normal Vision card', async ({ page }) => {
    // Japanese: 通常
    await expect(page.getByText('通常').first()).toBeVisible();
  });

  test('should show simulated color preview for each type', async ({ page }) => {
    const simPreviews = page.locator('[aria-label*="シミュレーション"]');
    const count = await simPreviews.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display color palette comparison section', async ({ page }) => {
    await expect(page.getByText('カラーパレット比較')).toBeVisible();
  });

  test('should show default color code #3b82f6', async ({ page }) => {
    await expect(page.locator('code').filter({ hasText: '#3b82f6' }).first()).toBeVisible();
  });
});
