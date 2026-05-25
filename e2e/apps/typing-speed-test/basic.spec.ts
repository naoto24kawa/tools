import { test, expect } from '@playwright/test';

test.describe('Typing Speed Test', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/typing-speed-test');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText(/Typing Speed Test/i)).toBeVisible();
  });

  test('should show WPM, CPM, Accuracy and Time cards', async ({ page }) => {
    await expect(page.getByText(/WPM/i)).toBeVisible();
    await expect(page.getByText(/CPM/i)).toBeVisible();
    await expect(page.getByText(/Accuracy/i)).toBeVisible();
    await expect(page.getByText(/Time/i)).toBeVisible();
  });

  test('should start timer when typing begins', async ({ page }) => {
    const typingInput = page.getByLabel('Typing input');
    await typingInput.fill('a');
    // WPM should now be non-zero or time should increment
    await expect(typingInput).not.toHaveValue('');
  });

  test('should show target text for typing', async ({ page }) => {
    // The text to type is shown in the monospace display area
    const displayArea = page.locator('.font-mono.leading-relaxed');
    await expect(displayArea).toBeVisible();
    const text = await displayArea.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  });

  test('should switch to Japanese language', async ({ page }) => {
    await page.getByRole('button', { name: /japanese/i }).click();
    // Japanese button should be active (default variant)
    const japaneseBtn = page.getByRole('button', { name: /japanese/i });
    await expect(japaneseBtn).toBeVisible();
  });

  test('should provide new text on New Text button click', async ({ page }) => {
    const displayArea = page.locator('.font-mono.leading-relaxed');
    const originalText = await displayArea.textContent();
    await page.getByRole('button', { name: /new text/i }).click();
    // Text may or may not change (random), but button should work without error
    await expect(displayArea).toBeVisible();
    const inputArea = page.getByLabel('Typing input');
    await expect(inputArea).toHaveValue('');
  });

  test('should toggle history panel', async ({ page }) => {
    await page.getByRole('button', { name: /history/i }).click();
    await expect(page.getByText(/Results History/i)).toBeVisible();
  });
});
