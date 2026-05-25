import { test, expect } from '@playwright/test';

test.describe('Binary / Hex / Decimal Converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/encode-binary');
  });

  test('should display the page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Binary.*Converter/i })).toBeVisible();
  });

  test('should show format tabs: Binary, Hex, Decimal', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Binary/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Hex/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Decimal/i })).toBeVisible();
  });

  // Binary format tests
  test('should convert text to Binary', async ({ page }) => {
    const input = page.getByRole('textbox').first();
    await input.fill('hi');
    await page.getByRole('button', { name: /Text to Binary/i }).click();
    const output = page.getByRole('textbox').nth(1);
    // 'h' = 0x68 = 01101000, 'i' = 0x69 = 01101001
    await expect(output).toHaveValue('01101000 01101001');
  });

  test('should convert Binary to text', async ({ page }) => {
    const input = page.getByRole('textbox').first();
    await input.fill('01101000 01101001');
    await page.getByRole('button', { name: /Binary to Text/i }).click();
    const output = page.getByRole('textbox').nth(1);
    await expect(output).toHaveValue('hi');
  });

  // Hex format tests
  test('should convert text to Hex', async ({ page }) => {
    await page.getByRole('button', { name: /Hex/i }).click();
    const input = page.getByRole('textbox').first();
    await input.fill('hi');
    await page.getByRole('button', { name: /Text to Hex/i }).click();
    const output = page.getByRole('textbox').nth(1);
    // 'h' = 68, 'i' = 69
    await expect(output).toHaveValue('68 69');
  });

  test('should convert Hex to text', async ({ page }) => {
    await page.getByRole('button', { name: /Hex/i }).click();
    const input = page.getByRole('textbox').first();
    await input.fill('68 69');
    await page.getByRole('button', { name: /Hex to Text/i }).click();
    const output = page.getByRole('textbox').nth(1);
    await expect(output).toHaveValue('hi');
  });

  // Decimal format tests
  test('should convert text to Decimal', async ({ page }) => {
    await page.getByRole('button', { name: /Decimal/i }).click();
    const input = page.getByRole('textbox').first();
    await input.fill('hi');
    await page.getByRole('button', { name: /Text to Decimal/i }).click();
    const output = page.getByRole('textbox').nth(1);
    // 'h' = 104, 'i' = 105
    await expect(output).toHaveValue('104 105');
  });

  test('should convert Decimal to text', async ({ page }) => {
    await page.getByRole('button', { name: /Decimal/i }).click();
    const input = page.getByRole('textbox').first();
    await input.fill('104 105');
    await page.getByRole('button', { name: /Decimal to Text/i }).click();
    const output = page.getByRole('textbox').nth(1);
    await expect(output).toHaveValue('hi');
  });

  test('should clear input and output when Clear is clicked', async ({ page }) => {
    const input = page.getByRole('textbox').first();
    await input.fill('hi');
    await page.getByRole('button', { name: /Text to Binary/i }).click();
    await page.getByRole('button', { name: /clear/i }).click();
    await expect(input).toHaveValue('');
    const output = page.getByRole('textbox').nth(1);
    await expect(output).toHaveValue('');
  });
});
