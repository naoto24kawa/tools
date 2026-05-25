import { test, expect } from '@playwright/test';

test.describe('HTML Entity Encoder / Decoder', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/encode-html-entity');
  });

  test('should display the page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /HTML Entity/i })).toBeVisible();
  });

  test('should encode HTML special characters', async ({ page }) => {
    const input = page.getByRole('textbox').first();
    await input.fill('<div class="hello">');
    await page.getByRole('button', { name: /encode/i }).click();
    const output = page.getByRole('textbox').nth(1);
    await expect(output).toHaveValue('&lt;div class=&quot;hello&quot;&gt;');
  });

  test('should encode ampersand', async ({ page }) => {
    const input = page.getByRole('textbox').first();
    await input.fill('a & b');
    await page.getByRole('button', { name: /encode/i }).click();
    const output = page.getByRole('textbox').nth(1);
    await expect(output).toHaveValue('a &amp; b');
  });

  test('should decode HTML entities back to text', async ({ page }) => {
    const input = page.getByRole('textbox').first();
    await input.fill('&lt;div&gt;');
    await page.getByRole('button', { name: /decode/i }).click();
    const output = page.getByRole('textbox').nth(1);
    await expect(output).toHaveValue('<div>');
  });

  test('should decode ampersand entity', async ({ page }) => {
    const input = page.getByRole('textbox').first();
    await input.fill('a &amp; b');
    await page.getByRole('button', { name: /decode/i }).click();
    const output = page.getByRole('textbox').nth(1);
    await expect(output).toHaveValue('a & b');
  });

  test('should round-trip encode then decode', async ({ page }) => {
    const original = '<script>alert("xss")</script>';
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
    await input.fill('<hello>');
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
