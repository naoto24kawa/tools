import { test, expect } from '@playwright/test';

test.describe('CSS Text Shadow Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/css-text-shadow');
  });

  test('should load page with heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /css text shadow generator/i })).toBeVisible();
  });

  test('should show Preview section with default preview text', async ({ page }) => {
    await expect(page.getByText('Preview').first()).toBeVisible();
    await expect(page.getByText('Text Shadow Preview')).toBeVisible();
  });

  test('should show Shadow Layers section with Layer 1', async ({ page }) => {
    await expect(page.getByText('Shadow Layers', { exact: true })).toBeVisible();
    await expect(page.getByText('Layer 1')).toBeVisible();
  });

  test('should show default layer controls (Offset X, Offset Y, Blur)', async ({ page }) => {
    await expect(page.getByText('Offset X (px)')).toBeVisible();
    await expect(page.getByText('Offset Y (px)')).toBeVisible();
    await expect(page.getByText('Blur (px)')).toBeVisible();
  });

  test('should show Generated CSS with text-shadow property', async ({ page }) => {
    await expect(page.getByText('Generated CSS')).toBeVisible();
    await expect(page.locator('pre code')).toContainText('text-shadow');
  });

  test('should add a new layer when Add Layer is clicked', async ({ page }) => {
    await expect(page.getByText('Layer 1')).toBeVisible();
    await page.getByRole('button', { name: /add layer/i }).click();
    await expect(page.getByText('Layer 2')).toBeVisible();
  });

  test('should update preview text when input changes', async ({ page }) => {
    const textInput = page.getByPlaceholder('Enter preview text');
    await textInput.clear();
    await textInput.fill('Hello World');
    await expect(page.getByText('Hello World').last()).toBeVisible();
  });

  test('should update CSS when slider is adjusted', async ({ page }) => {
    const initialCss = await page.locator('pre code').textContent();
    const offsetXSlider = page.getByRole('slider', { name: /layer 1 offset x/i });
    await offsetXSlider.fill('20');
    const updatedCss = await page.locator('pre code').textContent();
    expect(updatedCss).not.toBe(initialCss);
  });

  test('should show Copy button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /copy/i })).toBeVisible();
  });

  test('should disable Remove layer button when only one layer exists', async ({ page }) => {
    await expect(page.getByRole('button', { name: /remove layer/i })).toBeDisabled();
  });
});
