import { test, expect } from '@playwright/test';

test.describe('Whiteboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/whiteboard');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText('Whiteboard')).toBeVisible();
  });

  test('should render a canvas element', async ({ page }) => {
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
    // Canvas should have the expected dimensions
    const width = await canvas.getAttribute('width');
    const height = await canvas.getAttribute('height');
    expect(Number(width)).toBeGreaterThan(0);
    expect(Number(height)).toBeGreaterThan(0);
  });

  test('should show tool buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: /pen/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /eraser/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /line/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /rectangle/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /circle/i })).toBeVisible();
  });

  test('should show undo/redo/clear buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: /undo/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /redo/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /clear canvas/i })).toBeVisible();
  });

  test('should show PNG download button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /png/i })).toBeVisible();
  });

  test('should have undo button disabled initially (no strokes)', async ({ page }) => {
    const undoBtn = page.getByRole('button', { name: /undo/i });
    await expect(undoBtn).toBeDisabled();
  });

  test('should have redo button disabled initially', async ({ page }) => {
    const redoBtn = page.getByRole('button', { name: /redo/i });
    await expect(redoBtn).toBeDisabled();
  });

  test('should allow drawing on canvas (mouse down and move)', async ({ page }) => {
    const canvas = page.locator('canvas');
    const box = await canvas.boundingBox();
    if (!box) throw new Error('Canvas bounding box not found');

    // Simulate a drawing stroke
    await page.mouse.move(box.x + 100, box.y + 100);
    await page.mouse.down();
    await page.mouse.move(box.x + 200, box.y + 200);
    await page.mouse.up();

    // After drawing, undo should be enabled
    const undoBtn = page.getByRole('button', { name: /undo/i });
    await expect(undoBtn).toBeEnabled({ timeout: 2000 });
  });

  test('should undo a stroke', async ({ page }) => {
    const canvas = page.locator('canvas');
    const box = await canvas.boundingBox();
    if (!box) throw new Error('Canvas bounding box not found');

    // Draw a stroke
    await page.mouse.move(box.x + 100, box.y + 100);
    await page.mouse.down();
    await page.mouse.move(box.x + 200, box.y + 200);
    await page.mouse.up();

    // Undo the stroke — undo button should be enabled first
    const undoBtn = page.getByRole('button', { name: /undo/i });
    await expect(undoBtn).toBeEnabled({ timeout: 2000 });
    await undoBtn.click();

    // After undo, redo should be enabled
    const redoBtn = page.getByRole('button', { name: /redo/i });
    await expect(redoBtn).toBeEnabled();
  });
});
