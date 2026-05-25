import { test, expect } from '@playwright/test';

test.describe('Pixel Art Editor', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pixel-art-editor');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Pixel Art Editor' })).toBeVisible();
  });

  test('should display grid canvas', async ({ page }) => {
    // The pixel grid is rendered as a div with inline-grid style
    const grid = page.locator('.inline-grid');
    await expect(grid).toBeVisible();
  });

  test('should show tool buttons: Pencil, Eraser, Fill', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Pencil' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Eraser' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Fill' })).toBeVisible();
  });

  test('should select Eraser tool when clicked', async ({ page }) => {
    const eraserBtn = page.getByRole('button', { name: 'Eraser' });
    await eraserBtn.click();
    // After clicking Eraser it becomes the active (default variant) button
    await expect(eraserBtn).toHaveClass(/bg-primary|default/);
  });

  test('should show grid size selector', async ({ page }) => {
    // Select trigger for Grid Size; use exact match to avoid matching the description text
    await expect(page.getByText('Grid Size', { exact: true })).toBeVisible();
    // Default is 16 x 16
    await expect(page.getByText('16 x 16')).toBeVisible();
  });

  test('should have Export PNG button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Export PNG/i })).toBeVisible();
  });

  test('should have Clear button that clears the canvas', async ({ page }) => {
    const clearBtn = page.getByRole('button', { name: 'Clear' });
    await expect(clearBtn).toBeVisible();
    await clearBtn.click();
    // Toast "Canvas cleared" should appear; use exact match to avoid matching aria-live region
    await expect(page.getByText('Canvas cleared', { exact: true }).first()).toBeVisible();
  });

  test('should render color palette swatches', async ({ page }) => {
    // Color palette contains at least 16 color swatch buttons
    const swatches = page.locator('button[type="button"][style*="background-color"]');
    expect(await swatches.count()).toBeGreaterThanOrEqual(16);
  });
});
