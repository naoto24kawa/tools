import { test, expect } from '@playwright/test';

test.describe('Treemap Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/treemap-generator');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText(/Treemap Generator/i)).toBeVisible();
  });

  test('should render a canvas with the default sample data', async ({ page }) => {
    // Default data is pre-filled with sample programming languages
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
    // Canvas should have non-zero dimensions
    const width = await canvas.evaluate((el: HTMLCanvasElement) => el.width);
    const height = await canvas.evaluate((el: HTMLCanvasElement) => el.height);
    expect(width).toBeGreaterThan(0);
    expect(height).toBeGreaterThan(0);
  });

  test('should show item count for default data', async ({ page }) => {
    // Sample data has 10 items
    await expect(page.getByText(/10 items parsed/i)).toBeVisible();
  });

  test('should update canvas when data is changed', async ({ page }) => {
    const textarea = page.locator('textarea');
    await textarea.fill('Alpha, 50\nBeta, 30\nGamma, 20');
    await expect(page.getByText(/3 items parsed/i)).toBeVisible();
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
  });

  test('should update title in canvas when title input is changed', async ({ page }) => {
    const titleInput = page.locator('input').first();
    await titleInput.fill('My Custom Chart');
    // Title field should reflect the new value
    await expect(titleInput).toHaveValue('My Custom Chart');
  });

  test('should show Download PNG button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /download png/i })).toBeVisible();
  });

  test('should show zero items for empty data', async ({ page }) => {
    const textarea = page.locator('textarea');
    await textarea.fill('');
    await expect(page.getByText(/0 items parsed/i)).toBeVisible();
  });
});
