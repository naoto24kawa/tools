import { test, expect } from '@playwright/test';

test.describe('BIP39 Mnemonic Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/bip39-generator');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText('BIP39 Mnemonic Generator')).toBeVisible();
  });

  test('should show word count buttons (12, 15, 18, 21, 24)', async ({ page }) => {
    for (const count of [12, 15, 18, 21, 24]) {
      await expect(page.getByRole('button', { name: String(count) })).toBeVisible();
    }
  });

  test('should generate 12-word mnemonic by default', async ({ page }) => {
    await page.getByRole('button', { name: 'Generate' }).click();
    // 12 word cells should appear
    const wordCells = page.locator('.grid .rounded-md.border.bg-white');
    await expect(wordCells).toHaveCount(12);
  });

  test('should generate 24-word mnemonic when 24 selected', async ({ page }) => {
    await page.getByRole('button', { name: '24' }).click();
    await page.getByRole('button', { name: 'Generate' }).click();
    const wordCells = page.locator('.grid .rounded-md.border.bg-white');
    await expect(wordCells).toHaveCount(24);
  });

  test('should show copy button after mnemonic generation', async ({ page }) => {
    await page.getByRole('button', { name: 'Generate' }).click();
    await expect(page.getByRole('button', { name: /copy/i })).toBeVisible();
  });

  test('should show validate section', async ({ page }) => {
    await expect(page.getByText('Validate Mnemonic')).toBeVisible();
  });

  test('should validate a correct mnemonic phrase', async ({ page }) => {
    // Generate first
    await page.getByRole('button', { name: 'Generate' }).click();
    // Get all word cell texts
    const wordCells = page.locator('.grid .rounded-md.border.bg-white');
    const words: string[] = [];
    const count = await wordCells.count();
    for (let i = 0; i < count; i++) {
      const text = await wordCells.nth(i).textContent();
      // Strip leading number like "1."
      const word = text?.replace(/^\d+\.\s*/, '').trim() ?? '';
      words.push(word);
    }
    const phrase = words.join(' ');

    await page.locator('textarea#validate-input').fill(phrase);
    await page.getByRole('button', { name: /validate/i }).click();
    await expect(page.getByRole('alert')).toContainText(/valid mnemonic/i);
  });

  test('should show invalid for wrong mnemonic', async ({ page }) => {
    await page.locator('textarea#validate-input').fill('abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about');
    await page.getByRole('button', { name: /validate/i }).click();
    // "about" at position 12 makes it valid BIP39, so use clearly invalid input
    await page.locator('textarea#validate-input').fill('invalid phrase that is not bip39 compatible at all notaword');
    await page.getByRole('button', { name: /validate/i }).click();
    await expect(page.getByRole('alert')).toContainText(/invalid/i);
  });
});
