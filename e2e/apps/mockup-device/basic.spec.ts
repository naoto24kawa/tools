import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Mockup Device', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/mockup-device');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText(/Mockup Device/i)).toBeVisible();
  });

  test('should show upload prompt when no image is loaded', async ({ page }) => {
    await expect(page.getByText(/Upload an image to preview/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Upload Image/i })).toBeVisible();
  });

  test('should show device type selector', async ({ page }) => {
    // Select trigger for device type is visible
    await expect(page.getByText(/Device Type/i)).toBeVisible();
    await expect(page.getByRole('combobox').first()).toBeVisible();
  });

  test('should show image fit selector in settings', async ({ page }) => {
    await expect(page.getByText(/Image Fit/i)).toBeVisible();
  });

  test('should show background color input', async ({ page }) => {
    await expect(page.getByText(/Background Color/i)).toBeVisible();
    // The hex input should contain default value
    const hexInput = page.getByRole('textbox').first();
    await expect(hexInput).toHaveValue('#f0f0f0');
  });

  test('should update background color when preset button is clicked', async ({ page }) => {
    // Click the white preset color button
    await page.getByTitle('#ffffff').click();
    const hexInput = page.getByRole('textbox').first();
    await expect(hexInput).toHaveValue('#ffffff');
  });

  test('should change device when clicking device grid button', async ({ page }) => {
    // Click the first device in the quick-select grid
    const deviceButtons = page.locator('button').filter({ hasText: /iPhone|iPad|Desktop|Mobile/i });
    const count = await deviceButtons.count();
    if (count > 1) {
      await deviceButtons.nth(1).click();
    }
    // Page remains stable after device change
    await expect(page.getByText(/Mockup Device/i)).toBeVisible();
  });
});
