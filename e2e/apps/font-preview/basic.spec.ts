import { test, expect } from '@playwright/test';

test.describe('Font Preview', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/font-preview');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page).toHaveTitle(/Font Preview/i);
    await expect(page.getByText('Font Preview')).toBeVisible();
  });

  test('should show preview area with default text', async ({ page }) => {
    await expect(page.getByText('Preview')).toBeVisible();
    await expect(page.getByText(/The quick brown fox/)).toBeVisible();
  });

  test('should show custom text area', async ({ page }) => {
    await expect(page.getByText('Custom Text')).toBeVisible();
    await expect(page.getByPlaceholder(/enter custom text/i)).toBeVisible();
  });

  test('should update preview when custom text is entered', async ({ page }) => {
    const textarea = page.getByPlaceholder(/enter custom text/i);
    await textarea.fill('Hello World Preview');

    await expect(page.getByText('Hello World Preview').first()).toBeVisible();
  });

  test('should show font family selector', async ({ page }) => {
    await expect(page.getByText('Font Family')).toBeVisible();
  });

  test('should show settings controls', async ({ page }) => {
    await expect(page.getByText('Settings')).toBeVisible();
    await expect(page.getByRole('slider', { name: /font size/i })).toBeVisible();
    await expect(page.getByRole('slider', { name: /line height/i })).toBeVisible();
    await expect(page.getByRole('slider', { name: /letter spacing/i })).toBeVisible();
  });

  test('should show font size slider with default 32px', async ({ page }) => {
    await expect(page.getByText('32px')).toBeVisible();
  });

  test('should change font size via slider', async ({ page }) => {
    const slider = page.getByRole('slider', { name: /font size/i });
    await slider.fill('48');

    await expect(page.getByText('48px')).toBeVisible();
  });

  test('should show color picker', async ({ page }) => {
    await expect(page.getByLabel('Font Color')).toBeVisible();
  });

  test('should show font weight selector', async ({ page }) => {
    await expect(page.getByText('Weight')).toBeVisible();
  });
});
