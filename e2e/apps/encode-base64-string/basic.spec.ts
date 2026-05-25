import { test, expect } from '@playwright/test';

test.describe('Base64 String Encoder / Decoder', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/encode-base64-string');
  });

  test('should display the page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Base64 Encoder/i })).toBeVisible();
  });

  test('should encode text to Base64', async ({ page }) => {
    const input = page.getByRole('textbox').first();
    await input.fill('hello');
    await page.getByRole('button', { name: /encode/i }).click();
    const output = page.getByRole('textbox').nth(1);
    await expect(output).toHaveValue('aGVsbG8=');
  });

  test('should decode Base64 to text', async ({ page }) => {
    const input = page.getByRole('textbox').first();
    await input.fill('aGVsbG8=');
    await page.getByRole('button', { name: /decode/i }).click();
    const output = page.getByRole('textbox').nth(1);
    await expect(output).toHaveValue('hello');
  });

  test('should encode multi-word text to Base64', async ({ page }) => {
    const input = page.getByRole('textbox').first();
    await input.fill('Hello, World!');
    await page.getByRole('button', { name: /encode/i }).click();
    const output = page.getByRole('textbox').nth(1);
    await expect(output).toHaveValue('SGVsbG8sIFdvcmxkIQ==');
  });

  test('should decode Base64 multi-word string back to text', async ({ page }) => {
    const input = page.getByRole('textbox').first();
    await input.fill('SGVsbG8sIFdvcmxkIQ==');
    await page.getByRole('button', { name: /decode/i }).click();
    const output = page.getByRole('textbox').nth(1);
    await expect(output).toHaveValue('Hello, World!');
  });

  test('should round-trip encode then decode', async ({ page }) => {
    const original = 'round-trip test 123';
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

  test('should disable Encode button when input is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /encode/i })).toBeDisabled();
  });
});
