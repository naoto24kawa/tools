import { test, expect } from '@playwright/test';

test.describe('Aspect Ratio Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/aspect-ratio-calculator');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page).toHaveTitle(/Aspect Ratio Calculator/i);
    await expect(page.getByRole('heading', { name: 'Aspect Ratio Calculator' })).toBeVisible();
  });

  test('should show Calculate Ratio card with width and height inputs', async ({ page }) => {
    await expect(page.getByText('Calculate Ratio')).toBeVisible();
    await expect(page.locator('#calc-width')).toBeVisible();
    await expect(page.locator('#calc-height')).toBeVisible();
  });

  test('should show default values of 1920x1080', async ({ page }) => {
    await expect(page.locator('#calc-width')).toHaveValue('1920');
    await expect(page.locator('#calc-height')).toHaveValue('1080');
  });

  test('should calculate 16:9 ratio for 1920x1080', async ({ page }) => {
    // Default values should already show 16:9
    await expect(page.locator('text=16:9')).toBeVisible();
  });

  test('should update ratio when dimensions change', async ({ page }) => {
    await page.locator('#calc-width').fill('800');
    await page.locator('#calc-height').fill('600');
    // 800:600 = 4:3
    await expect(page.locator('text=4:3')).toBeVisible();
  });

  test('should show decimal ratio', async ({ page }) => {
    // Decimal value should be visible for 1920x1080
    await expect(page.locator('text=/1\\.7[0-9]+/')).toBeVisible();
  });

  test('should show Calculate from Ratio card', async ({ page }) => {
    await expect(page.getByText('Calculate from Ratio')).toBeVisible();
  });

  test('should calculate dimensions from ratio', async ({ page }) => {
    // Default ratio is 16:9 with known width 1920, result height should be 1080
    await expect(page.locator('text=1920px')).toBeVisible();
    await expect(page.locator('text=1080px')).toBeVisible();
  });

  test('should show Common Presets card', async ({ page }) => {
    await expect(page.getByText('Common Presets')).toBeVisible();
  });

  test('should apply preset ratio when preset button is clicked', async ({ page }) => {
    // Click a preset button (e.g. 4:3)
    const presetButton = page.getByRole('button', { name: /4:3|16:9|21:9/i }).first();
    await presetButton.click();
    // Ratio should update in the "Calculate from Ratio" section
    await expect(page.locator('text=/\\d+px/').first()).toBeVisible();
  });

  test('should show Copy Ratio button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /copy ratio/i })).toBeVisible();
  });

  test('should show Copy Dimensions button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /copy dimensions/i })).toBeVisible();
  });

  test('should show visual preview of aspect ratio', async ({ page }) => {
    // Preview box showing the ratio
    await expect(page.locator('text=1920 x 1080')).toBeVisible();
  });
});
