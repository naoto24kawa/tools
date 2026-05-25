import { test, expect } from '@playwright/test';

test.describe('Text Reading Time', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/text-reading-time');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Text Reading Time' })).toBeVisible();
  });

  test('should show text input area', async ({ page }) => {
    await expect(page.locator('textarea#input')).toBeVisible();
  });

  test('should show character count as 0 when input is empty', async ({ page }) => {
    await expect(page.getByText('Characters')).toBeVisible();
    await expect(page.getByText('0').first()).toBeVisible();
  });

  test('should update character count when text is entered', async ({ page }) => {
    await page.locator('textarea#input').fill('Hello World');
    const charCard = page.locator('p.text-2xl').first();
    await expect(charCard).toContainText('11');
  });

  test('should estimate reading time for English text (200 words)', async ({ page }) => {
    const longText = 'word '.repeat(200).trim();
    await page.locator('textarea#input').fill(longText);
    await expect(page.getByText('Reading Time')).toBeVisible();
    // 200 words at ~200 wpm = ~1 min
    const readingCard = page.getByText(/\d+ min/i).first();
    await expect(readingCard).toBeVisible();
  });

  test('should show speaking time', async ({ page }) => {
    const text = 'word '.repeat(150).trim();
    await page.locator('textarea#input').fill(text);
    await expect(page.getByText('Speaking Time')).toBeVisible();
  });

  test('should show word count', async ({ page }) => {
    const text = 'one two three four five';
    await page.locator('textarea#input').fill(text);
    await expect(page.getByText('Words')).toBeVisible();
  });

  test('should detect language', async ({ page }) => {
    await page.locator('textarea#input').fill('This is an English sentence for language detection.');
    await expect(page.getByText('Detected Language')).toBeVisible();
    await expect(page.getByText('English')).toBeVisible();
  });

  test('should show time in seconds for very short text', async ({ page }) => {
    await page.locator('textarea#input').fill('Hi.');
    await expect(page.getByText(/sec/i)).toBeVisible();
  });
});
