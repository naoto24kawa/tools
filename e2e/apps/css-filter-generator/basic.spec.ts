import { test, expect } from '@playwright/test';

test.describe('CSS Filter Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/css-filter-generator');
  });

  test('should load page with heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /css filter generator/i })).toBeVisible();
  });

  test('should show Preview section', async ({ page }) => {
    await expect(page.getByText('Preview')).toBeVisible();
  });

  test('should show Filters section with sliders', async ({ page }) => {
    await expect(page.getByText('Filters')).toBeVisible();
    // Should have multiple range sliders
    const sliders = page.locator('input[type="range"]');
    await expect(sliders.first()).toBeVisible();
    const count = await sliders.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should show Generated CSS section', async ({ page }) => {
    await expect(page.getByText('Generated CSS')).toBeVisible();
    await expect(page.locator('pre code')).toContainText('filter:');
  });

  test('should show filter labels (Brightness, Contrast, etc.)', async ({ page }) => {
    await expect(page.getByText('Brightness')).toBeVisible();
    await expect(page.getByText('Contrast')).toBeVisible();
    await expect(page.getByText('Saturation')).toBeVisible();
  });

  test('should show Reset button (disabled at defaults)', async ({ page }) => {
    // Reset button is disabled when values are at default
    await expect(page.getByRole('button', { name: /reset/i })).toBeDisabled();
  });

  test('should enable Reset button after changing a slider', async ({ page }) => {
    const brightnessSlider = page.getByRole('slider', { name: /brightness/i });
    await brightnessSlider.fill('200');
    await expect(page.getByRole('button', { name: /reset/i })).toBeEnabled();
  });

  test('should update Generated CSS when slider is adjusted', async ({ page }) => {
    const initialCss = await page.locator('pre code').textContent();
    const brightnessSlider = page.getByRole('slider', { name: /brightness/i });
    await brightnessSlider.fill('200');
    const updatedCss = await page.locator('pre code').textContent();
    expect(updatedCss).not.toBe(initialCss);
    expect(updatedCss).toContain('brightness');
  });

  test('should show Copy button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /copy/i })).toBeVisible();
  });
});
