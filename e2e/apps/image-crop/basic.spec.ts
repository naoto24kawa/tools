import { test, expect } from '@playwright/test';

test.describe('Image Crop - Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/image-crop');
  });

  test('should load the page successfully', async ({ page }) => {
    await expect(page.getByText(/crop/i) || page.getByText(/トリミング/i)).toBeVisible();
  });
});
