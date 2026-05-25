import { test, expect } from '@playwright/test';

test.describe('Code to Image', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/code-to-image');
  });

  test('should display the page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Code to Image/i })).toBeVisible();
  });

  test('should show placeholder text before generation', async ({ page }) => {
    await expect(
      page.getByText(/No image generated yet/i)
    ).toBeVisible();
  });

  test('should disable Generate Image button when code is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /generate image/i })).toBeDisabled();
  });

  test('should enable Generate Image button when code is entered', async ({ page }) => {
    await page.getByLabel('Code').fill('console.log("hello");');
    await expect(page.getByRole('button', { name: /generate image/i })).toBeEnabled();
  });

  test('should generate an image and show preview', async ({ page }) => {
    await page.getByLabel('Code').fill('const x = 42;\nconsole.log(x);');
    await page.getByRole('button', { name: /generate image/i }).click();
    // After generation the img element should appear
    const img = page.getByRole('img', { name: /Generated code snippet/i });
    await expect(img).toBeVisible();
  });

  test('should enable Download PNG after image is generated', async ({ page }) => {
    await expect(page.getByRole('button', { name: /download png/i })).toBeDisabled();
    await page.getByLabel('Code').fill('let y = "test";');
    await page.getByRole('button', { name: /generate image/i }).click();
    await expect(page.getByRole('button', { name: /download png/i })).toBeEnabled();
  });

  test('should enable Copy Image button after image is generated', async ({ page }) => {
    await expect(page.getByRole('button', { name: /copy image/i })).toBeDisabled();
    await page.getByLabel('Code').fill('function hello() {}');
    await page.getByRole('button', { name: /generate image/i }).click();
    await expect(page.getByRole('button', { name: /copy image/i })).toBeEnabled();
  });

  test('should allow changing font size', async ({ page }) => {
    const fontSizeInput = page.getByLabel('Font Size (px)');
    await fontSizeInput.fill('20');
    await expect(fontSizeInput).toHaveValue('20');
  });

  test('should clear code and image when Clear is clicked', async ({ page }) => {
    const codeInput = page.getByLabel('Code');
    await codeInput.fill('const a = 1;');
    await page.getByRole('button', { name: /generate image/i }).click();
    await page.getByRole('button', { name: /clear/i }).click();
    await expect(codeInput).toHaveValue('');
    await expect(page.getByText(/No image generated yet/i)).toBeVisible();
  });
});
