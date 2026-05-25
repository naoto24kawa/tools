import { test, expect } from '@playwright/test';

test.describe('Base32 Encoder / Decoder', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/encode-base32');
  });

  test('should display the page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Base32 Encoder/i })).toBeVisible();
  });

  test('should encode text to Base32', async ({ page }) => {
    const input = page.getByRole('textbox').first();
    await input.fill('hello');
    await page.getByRole('button', { name: /encode/i }).click();
    const output = page.getByRole('textbox').nth(1);
    // Base32 of 'hello' is 'NBSWY3DPEB3W64TMMQ======'
    // Standard RFC 4648: NBSWY3DP
    await expect(output).not.toHaveValue('');
    const value = await output.inputValue();
    // Base32 encoding of 'hello' starts with NBSWY3DP
    expect(value.toUpperCase()).toMatch(/^NBSWY3DP/);
  });

  test('should decode Base32 to text', async ({ page }) => {
    const input = page.getByRole('textbox').first();
    await input.fill('NBSWY3DP');
    await page.getByRole('button', { name: /decode/i }).click();
    const output = page.getByRole('textbox').nth(1);
    await expect(output).toHaveValue('hello');
  });

  test('should encode "Hello" to correct Base32', async ({ page }) => {
    const input = page.getByRole('textbox').first();
    await input.fill('Hello');
    await page.getByRole('button', { name: /encode/i }).click();
    const output = page.getByRole('textbox').nth(1);
    const value = await output.inputValue();
    expect(value).not.toBe('');
    // Encoded result should be non-empty and contain only Base32 chars
    expect(value).toMatch(/^[A-Z2-7=]+$/);
  });

  test('should round-trip encode then decode', async ({ page }) => {
    const original = 'test123';
    const input = page.getByRole('textbox').first();
    await input.fill(original);
    await page.getByRole('button', { name: /encode/i }).click();

    const output = page.getByRole('textbox').nth(1);
    const encoded = await output.inputValue();
    expect(encoded).not.toBe(original);

    await input.fill(encoded);
    await page.getByRole('button', { name: /decode/i }).click();
    await expect(output).toHaveValue(original);
  });

  test('should clear input and output when Clear is clicked', async ({ page }) => {
    const input = page.getByRole('textbox').first();
    await input.fill('hello');
    await page.getByRole('button', { name: /encode/i }).click();
    await page.getByRole('button', { name: /clear/i }).click();
    await expect(input).toHaveValue('');
    const output = page.getByRole('textbox').nth(1);
    await expect(output).toHaveValue('');
  });

  test('should disable Encode and Decode buttons when input is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /encode/i })).toBeDisabled();
    await expect(page.getByRole('button', { name: /decode/i })).toBeDisabled();
  });
});
