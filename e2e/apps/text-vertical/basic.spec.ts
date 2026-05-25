import { test, expect } from '@playwright/test';

test.describe('Text Vertical', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/text-vertical');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Text Vertical' })).toBeVisible();
  });

  test('should show text input area', async ({ page }) => {
    await expect(page.locator('textarea#input')).toBeVisible();
  });

  test('should show preview panel', async ({ page }) => {
    await expect(page.getByText('Preview', { exact: true })).toBeVisible();
  });

  test('should show placeholder in preview when input is empty', async ({ page }) => {
    await expect(page.getByText('Preview will appear here...')).toBeVisible();
  });

  test('should display entered text in preview area', async ({ page }) => {
    await page.locator('textarea#input').fill('縦書きテスト');
    await expect(page.getByText('縦書きテスト').nth(1)).toBeVisible();
  });

  test('should show font size slider', async ({ page }) => {
    await expect(page.locator('input#fontSize')).toBeVisible();
    await expect(page.getByText(/font size:/i)).toBeVisible();
  });

  test('should show line height slider', async ({ page }) => {
    await expect(page.locator('input#lineHeight')).toBeVisible();
    await expect(page.getByText(/line height:/i)).toBeVisible();
  });

  test('should show font family selector', async ({ page }) => {
    await expect(page.locator('select#fontFamily')).toBeVisible();
  });

  test('should have serif, sans-serif, and monospace font options', async ({ page }) => {
    const select = page.locator('select#fontFamily');
    await expect(select.locator('option[value="serif"]')).toBeAttached();
    await expect(select.locator('option[value="sans-serif"]')).toBeAttached();
    await expect(select.locator('option[value="monospace"]')).toBeAttached();
  });

  test('should update font size label when slider is changed', async ({ page }) => {
    const slider = page.locator('input#fontSize');
    await slider.fill('24');
    await slider.dispatchEvent('input');
    await expect(page.getByText('Font Size: 24px')).toBeVisible();
  });

  test('should have Print button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /print/i })).toBeVisible();
  });

  test('should have Copy as Image button that is disabled when no text', async ({ page }) => {
    await expect(page.getByRole('button', { name: /copy as image/i })).toBeDisabled();
  });

  test('should enable Copy as Image button when text is entered', async ({ page }) => {
    await page.locator('textarea#input').fill('テスト');
    await expect(page.getByRole('button', { name: /copy as image/i })).toBeEnabled();
  });
});
