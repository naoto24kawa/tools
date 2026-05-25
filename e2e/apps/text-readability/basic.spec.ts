import { test, expect } from '@playwright/test';

test.describe('Text Readability', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/text-readability');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Text Readability' })).toBeVisible();
  });

  test('should show text input area', async ({ page }) => {
    await expect(page.locator('textarea#input')).toBeVisible();
  });

  test('should not show scores when input is empty', async ({ page }) => {
    await expect(page.getByText('Readability Scores')).not.toBeVisible();
  });

  test('should show word and sentence counts after entering text', async ({ page }) => {
    const text =
      'The quick brown fox jumps over the lazy dog. The dog barked loudly at the fox.';
    await page.locator('textarea#input').fill(text);
    await expect(page.getByText('Words')).toBeVisible();
    await expect(page.getByText('Sentences')).toBeVisible();
  });

  test('should display Flesch Reading Ease score for English text', async ({ page }) => {
    const text =
      'The quick brown fox jumps over the lazy dog. Simple sentences are easy to read. Short words help too.';
    await page.locator('textarea#input').fill(text);
    await expect(page.getByText('Flesch Reading Ease')).toBeVisible();
    await expect(page.getByText('Readability Scores')).toBeVisible();
  });

  test('should display Flesch-Kincaid Grade Level for English text', async ({ page }) => {
    const text =
      'The implementation of sophisticated algorithms requires substantial computational resources. Complex systems exhibit emergent behavior.';
    await page.locator('textarea#input').fill(text);
    await expect(page.getByText('Flesch-Kincaid Grade Level')).toBeVisible();
  });

  test('should show average sentence length metric', async ({ page }) => {
    const text = 'This is a test sentence. Another sentence here. And one more.';
    await page.locator('textarea#input').fill(text);
    await expect(page.getByText(/avg sentence length/i)).toBeVisible();
    await expect(page.getByText(/words$/i)).toBeVisible();
  });

  test('should show improvement tips', async ({ page }) => {
    const text =
      'The quick brown fox jumped over the lazy dog. It was a sunny day. The birds were singing.';
    await page.locator('textarea#input').fill(text);
    await expect(page.getByText('Improvement Tips')).toBeVisible();
  });

  test('should show syllable count for English text', async ({ page }) => {
    const text = 'Simple text with multiple syllables in each sentence here today.';
    await page.locator('textarea#input').fill(text);
    await expect(page.getByText('Syllables')).toBeVisible();
  });
});
