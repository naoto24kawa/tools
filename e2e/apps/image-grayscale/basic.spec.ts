import { test, expect } from '@playwright/test';

test.describe('Image Grayscale - Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/image-grayscale');
  });

  test('should load the page successfully', async ({ page }) => {
    await expect(page.getByText(/grayscale/i) || page.getByText(/グレースケール/i)).toBeVisible();
  });
});
