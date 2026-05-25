import { test, expect } from '@playwright/test';

test.describe('UUEncode / UUDecode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/uuencode');
  });

  test('should display the page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /UUEncode/i })).toBeVisible();
  });

  test('should show Encode and Decode mode buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: /^Encode$/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /^Decode$/i })).toBeVisible();
  });

  test('should encode text to UUEncoded format', async ({ page }) => {
    // Default mode is "encode"
    const input = page.locator('#input');
    await input.fill('hello');
    const output = page.locator('#output');
    // UUEncoded 'hello' starts with 'begin 644 data'
    await expect(output).toContainText('begin 644 data');
    await expect(output).toContainText('end');
  });

  test('should decode UUEncoded text back to original', async ({ page }) => {
    // Switch to decode mode
    await page.getByRole('button', { name: /^Decode$/i }).click();

    const uuencoded = `begin 644 data\n%:&5L;&\\`\n\`\nend`;
    const input = page.locator('#input');
    await input.fill(uuencoded);
    const output = page.locator('#output');
    await expect(output).toHaveValue('hello');
  });

  test('should output empty string when input is empty in encode mode', async ({ page }) => {
    const output = page.locator('#output');
    await expect(output).toHaveValue('');
  });

  test('should switch to Decode mode when Decode button is clicked', async ({ page }) => {
    await page.getByRole('button', { name: /^Decode$/i }).click();
    // Placeholder should change for decode mode
    const input = page.locator('#input');
    await expect(input).toHaveAttribute('placeholder', /UU-encoded/i);
  });

  test('should switch to Encode mode when Encode button is clicked', async ({ page }) => {
    // Start in encode mode already
    const input = page.locator('#input');
    await expect(input).toHaveAttribute('placeholder', /encode/i);
  });

  test('should round-trip encode then decode', async ({ page }) => {
    const original = 'hello world';

    // Encode
    const input = page.locator('#input');
    await input.fill(original);
    const output = page.locator('#output');
    const encoded = await output.inputValue();
    expect(encoded).toContain('begin 644 data');

    // Switch to decode and paste encoded
    await page.getByRole('button', { name: /^Decode$/i }).click();
    await input.fill(encoded);
    await expect(output).toHaveValue(original);
  });
});
