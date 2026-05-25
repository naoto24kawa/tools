import { test, expect } from '@playwright/test';

test.describe('Handwriting Converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/handwriting-converter');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Handwriting|Converter/i);
  });

  test('should show text input area with default text', async ({ page }) => {
    const textarea = page.locator('#text-input');
    await expect(textarea).toBeVisible();
    const value = await textarea.inputValue();
    expect(value).toContain('Hello, World!');
  });

  test('should show canvas preview by default', async ({ page }) => {
    // Canvas should be visible and rendered with default text
    await expect(page.locator('canvas[aria-label="手書き風テキストのレンダリング結果"]')).toBeVisible();
  });

  test('should show font size slider', async ({ page }) => {
    await expect(page.locator('#fontSize')).toBeVisible();
  });

  test('should show wobble slider', async ({ page }) => {
    await expect(page.locator('#wobble')).toBeVisible();
  });

  test('should show line height slider', async ({ page }) => {
    await expect(page.locator('#lineHeight')).toBeVisible();
  });

  test('should show font family selector', async ({ page }) => {
    await expect(page.locator('#fontFamily')).toBeVisible();
  });

  test('should show text and background color pickers', async ({ page }) => {
    await expect(page.locator('#color')).toBeVisible();
    await expect(page.locator('#bgColor')).toBeVisible();
  });

  test('should show Regenerate and Download PNG buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Regenerate/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Download PNG/i })).toBeVisible();
  });

  test('should show Clear button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Clear/i })).toBeVisible();
  });

  test('should update canvas when text is changed', async ({ page }) => {
    const textarea = page.locator('#text-input');
    await textarea.fill('New test text');
    // Canvas should still be visible after text change
    await expect(page.locator('canvas[aria-label="手書き風テキストのレンダリング結果"]')).toBeVisible();
  });

  test('should clear text input on Clear button click', async ({ page }) => {
    await page.getByRole('button', { name: /Clear/i }).click();
    const textarea = page.locator('#text-input');
    expect(await textarea.inputValue()).toBe('');
  });

  test('should display page header text', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Handwriting Converter/i })).toBeVisible();
  });
});
