import { test, expect } from '@playwright/test';

test.describe('Text Ruby Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/text-ruby');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Text Ruby Generator' })).toBeVisible();
  });

  test('should show text input area', async ({ page }) => {
    await expect(page.locator('textarea#input')).toBeVisible();
  });

  test('should not show preview when input is empty', async ({ page }) => {
    await expect(page.getByText('Preview')).not.toBeVisible();
  });

  test('should show preview and HTML output when text is entered', async ({ page }) => {
    await page.locator('textarea#input').fill('こんにちは');
    await expect(page.getByText('Preview')).toBeVisible();
    await expect(page.getByText('Generated HTML')).toBeVisible();
  });

  test('should generate ruby HTML from {kanji|reading} notation', async ({ page }) => {
    await page.locator('textarea#input').fill('{漢字|かんじ}');
    await expect(page.getByText('Preview')).toBeVisible();
    // HTML output should contain <ruby> tag
    const htmlPre = page.locator('pre');
    await expect(htmlPre).toContainText('<ruby>');
    await expect(htmlPre).toContainText('<rt>');
    await expect(htmlPre).toContainText('かんじ');
  });

  test('should show live ruby preview with furigana', async ({ page }) => {
    await page.locator('textarea#input').fill('この{漢字|かんじ}は{面白|おもしろ}い');
    // Preview div should contain the rendered ruby annotation
    const previewDiv = page.locator('.text-lg.leading-relaxed');
    await expect(previewDiv).toBeVisible();
    // The preview should render ruby tags
    const rubyElements = previewDiv.locator('ruby');
    await expect(rubyElements.first()).toBeVisible();
  });

  test('should show Copy HTML button', async ({ page }) => {
    await page.locator('textarea#input').fill('{日本語|にほんご}');
    await expect(page.getByRole('button', { name: /copy html/i })).toBeVisible();
  });

  test('should show Clear button and clear input when clicked', async ({ page }) => {
    await page.locator('textarea#input').fill('{テスト|てすと}');
    await expect(page.getByText('Preview')).toBeVisible();
    await page.getByRole('button', { name: /clear/i }).click();
    await expect(page.locator('textarea#input')).toHaveValue('');
    await expect(page.getByText('Preview')).not.toBeVisible();
  });

  test('should handle plain text without ruby notation', async ({ page }) => {
    await page.locator('textarea#input').fill('Hello World');
    const htmlPre = page.locator('pre');
    await expect(htmlPre).toContainText('Hello World');
    await expect(htmlPre).not.toContainText('<ruby>');
  });
});
