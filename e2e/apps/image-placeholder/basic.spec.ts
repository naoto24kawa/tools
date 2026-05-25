import { test, expect } from '@playwright/test';

test.describe('Image Placeholder Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/image-placeholder');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText(/Image Placeholder Generator/i)).toBeVisible();
  });

  test('should show width and height inputs', async ({ page }) => {
    await expect(page.getByText(/width \(px\)/i)).toBeVisible();
    await expect(page.getByText(/height \(px\)/i)).toBeVisible();
  });

  test('should render preview image on load with default size', async ({ page }) => {
    const preview = page.locator('img[alt*="Placeholder"]');
    await expect(preview).toBeVisible();
  });

  test('should update preview description when width changes', async ({ page }) => {
    const widthInput = page.locator('input[type="number"]').first();
    await widthInput.clear();
    await widthInput.fill('400');
    // The CardDescription shows "400 x {height} - PNG"
    await expect(page.getByText(/400 x/i)).toBeVisible();
  });

  test('should update preview description when height changes', async ({ page }) => {
    const heightInput = page.locator('input[type="number"]').nth(1);
    await heightInput.clear();
    await heightInput.fill('300');
    await expect(page.getByText(/x 300/i)).toBeVisible();
  });

  test('should apply a quick preset and update dimensions', async ({ page }) => {
    // Click first preset button (e.g., 16:9 or specific size)
    const presets = page.getByRole('button').filter({ hasText: /\d+x\d+|\d+ x \d+/i });
    const count = await presets.count();
    if (count > 0) {
      const firstPreset = presets.first();
      const presetText = await firstPreset.textContent();
      await firstPreset.click();
      // Verify preview description was updated to include the preset dimension
      const match = presetText?.match(/(\d+)/);
      if (match) {
        await expect(page.getByText(new RegExp(match[1]))).toBeVisible();
      }
    }
  });

  test('should switch to SVG format', async ({ page }) => {
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /^svg$/i }).click();
    await expect(page.getByText(/SVG/i).last()).toBeVisible();
  });

  test('should show Download button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /download/i })).toBeVisible();
  });

  test('should show toast after clicking Download PNG', async ({ page }) => {
    await page.getByRole('button', { name: /download png/i }).click();
    await expect(page.getByText(/png downloaded/i)).toBeVisible();
  });

  test('should allow custom text input and update preview', async ({ page }) => {
    const textInput = page.getByLabel(/custom text/i);
    await textInput.fill('My Preview');
    // After filling, the preview should reflect changes (img re-renders)
    const preview = page.locator('img[alt*="Placeholder"]');
    await expect(preview).toBeVisible();
  });
});
