import { test, expect } from '@playwright/test';

test.describe('Noise Texture Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/noise-texture');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText(/Noise Texture Generator/i)).toBeVisible();
  });

  test('should render canvas on initial load', async ({ page }) => {
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
  });

  test('should show scale slider', async ({ page }) => {
    await expect(page.getByText(/Scale:/i)).toBeVisible();
  });

  test('should show octaves slider', async ({ page }) => {
    await expect(page.getByText(/Octaves:/i)).toBeVisible();
  });

  test('should show persistence slider', async ({ page }) => {
    await expect(page.getByText(/Persistence:/i)).toBeVisible();
  });

  test('should show seed input', async ({ page }) => {
    const seedInput = page.locator('#seed');
    await expect(seedInput).toBeVisible();
    await expect(seedInput).toHaveValue('42');
  });

  test('should update canvas when seed is changed', async ({ page }) => {
    const canvas = page.locator('canvas');
    // Get initial pixel data
    const initialData = await canvas.evaluate((c: HTMLCanvasElement) => {
      const ctx = c.getContext('2d');
      const d = ctx?.getImageData(0, 0, 10, 10).data;
      return d ? Array.from(d).join(',') : '';
    });

    const seedInput = page.locator('#seed');
    await seedInput.fill('99');
    await page.keyboard.press('Tab');

    // Give time for the effect to re-run
    await page.waitForTimeout(300);

    const updatedData = await canvas.evaluate((c: HTMLCanvasElement) => {
      const ctx = c.getContext('2d');
      const d = ctx?.getImageData(0, 0, 10, 10).data;
      return d ? Array.from(d).join(',') : '';
    });

    expect(initialData).not.toBe(updatedData);
  });

  test('should switch color mode to gradient', async ({ page }) => {
    const colorModeSelect = page.getByRole('combobox');
    await colorModeSelect.click();
    await page.getByRole('option', { name: /Gradient Mapped/i }).click();
    // Color pickers appear for gradient mode
    await expect(page.getByText('Color 1')).toBeVisible();
    await expect(page.getByText('Color 2')).toBeVisible();
  });

  test('should show Download PNG button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Download PNG/i })).toBeVisible();
  });
});
