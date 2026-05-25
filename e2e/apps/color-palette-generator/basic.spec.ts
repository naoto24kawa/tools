import { test, expect } from '@playwright/test';

test.describe('Color Palette Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/color-palette-generator');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Color Palette Generator/i);
  });

  test('should display main heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Color Palette Generator' })).toBeVisible();
  });

  test('should show base color section', async ({ page }) => {
    await expect(page.getByText('Base Color', { exact: true })).toBeVisible();
  });

  test('should show hex input with default value', async ({ page }) => {
    const hexInput = page.getByLabel('Hex Value');
    await expect(hexInput).toBeVisible();
    await expect(hexInput).toHaveValue('#3366cc');
  });

  test('should show color picker', async ({ page }) => {
    const colorPicker = page.getByLabel('Color Picker');
    await expect(colorPicker).toBeVisible();
  });

  test('should show palette type selector', async ({ page }) => {
    await expect(page.getByText('Palette Type', { exact: true })).toBeVisible();
  });

  test('should generate complementary palette by default', async ({ page }) => {
    await expect(page.getByText('Generated Palette')).toBeVisible();
    await expect(page.getByText(/Complementary/i).first()).toBeVisible();
  });

  test('should display color swatches', async ({ page }) => {
    // Complementary palette should show at least 2 colors
    await expect(page.getByText('Generated Palette')).toBeVisible();
    const hexPattern = page.getByText(/^#[0-9a-f]{6}$/i).first();
    await expect(hexPattern).toBeVisible();
  });

  test('should show RGB values for colors', async ({ page }) => {
    await expect(page.getByText(/^rgb\(\d+, \d+, \d+\)$/i).first()).toBeVisible();
  });

  test('should show HSL values for colors', async ({ page }) => {
    await expect(page.getByText(/^hsl\(\d+, \d+%, \d+%\)$/i).first()).toBeVisible();
  });

  test('should switch to Analogous palette type', async ({ page }) => {
    await page.getByText('Palette Type').locator('..').locator('[role="combobox"]').click();
    await page.getByRole('option', { name: 'Analogous' }).click();
    await expect(page.getByText('Analogous palette')).toBeVisible();
  });

  test('should switch to Triadic palette type', async ({ page }) => {
    await page.getByText('Palette Type').locator('..').locator('[role="combobox"]').click();
    await page.getByRole('option', { name: 'Triadic' }).click();
    await expect(page.getByText('Triadic palette')).toBeVisible();
  });

  test('should update palette when hex value is changed', async ({ page }) => {
    const hexInput = page.getByLabel('Hex Value');
    await hexInput.fill('#ff0000');
    await expect(page.getByText('#ff0000')).toBeVisible();
  });

  test('should show Copy All and Export CSS Variables buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Copy All/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Export CSS Variables/i })).toBeVisible();
  });

  test('should show palette colors count in description', async ({ page }) => {
    await expect(page.getByText(/\d+ colors/i)).toBeVisible();
  });
});
