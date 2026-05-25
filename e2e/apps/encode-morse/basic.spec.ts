import { test, expect } from '@playwright/test';

test.describe('Morse Code Converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/encode-morse');
  });

  test('should display the page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Morse Code/i })).toBeVisible();
  });

  test('should encode text to Morse code', async ({ page }) => {
    const input = page.getByRole('textbox').first();
    await input.fill('SOS');
    await page.getByRole('button', { name: /Text to Morse/i }).click();
    const output = page.getByRole('textbox').nth(1);
    // S = '...' O = '---' S = '...'
    await expect(output).toHaveValue('... --- ...');
  });

  test('should decode Morse code to text', async ({ page }) => {
    const input = page.getByRole('textbox').first();
    await input.fill('... --- ...');
    await page.getByRole('button', { name: /Morse to Text/i }).click();
    const output = page.getByRole('textbox').nth(1);
    await expect(output).toHaveValue('SOS');
  });

  test('should encode single letter to Morse', async ({ page }) => {
    const input = page.getByRole('textbox').first();
    await input.fill('E');
    await page.getByRole('button', { name: /Text to Morse/i }).click();
    const output = page.getByRole('textbox').nth(1);
    await expect(output).toHaveValue('.');
  });

  test('should encode "HELLO" to Morse code', async ({ page }) => {
    const input = page.getByRole('textbox').first();
    await input.fill('HELLO');
    await page.getByRole('button', { name: /Text to Morse/i }).click();
    const output = page.getByRole('textbox').nth(1);
    // H='....' E='.' L='.-..' L='.-..' O='---'
    await expect(output).toHaveValue('.... . .-.. .-.. ---');
  });

  test('should decode ".... . .-.. .-.. ---" to HELLO', async ({ page }) => {
    const input = page.getByRole('textbox').first();
    await input.fill('.... . .-.. .-.. ---');
    await page.getByRole('button', { name: /Morse to Text/i }).click();
    const output = page.getByRole('textbox').nth(1);
    await expect(output).toHaveValue('HELLO');
  });

  test('should encode multi-word text with word separator', async ({ page }) => {
    const input = page.getByRole('textbox').first();
    await input.fill('HI HI');
    await page.getByRole('button', { name: /Text to Morse/i }).click();
    const output = page.getByRole('textbox').nth(1);
    // H='....' I='..' space='/' H='....' I='..'
    await expect(output).toHaveValue('.... .. / .... ..');
  });

  test('should decode multi-word Morse with slash separator', async ({ page }) => {
    const input = page.getByRole('textbox').first();
    await input.fill('.... .. / .... ..');
    await page.getByRole('button', { name: /Morse to Text/i }).click();
    const output = page.getByRole('textbox').nth(1);
    await expect(output).toHaveValue('HI HI');
  });

  test('should clear input and output when Clear is clicked', async ({ page }) => {
    const input = page.getByRole('textbox').first();
    await input.fill('SOS');
    await page.getByRole('button', { name: /Text to Morse/i }).click();
    await page.getByRole('button', { name: /clear/i }).click();
    await expect(input).toHaveValue('');
    const output = page.getByRole('textbox').nth(1);
    await expect(output).toHaveValue('');
  });

  test('should disable encode/decode buttons when input is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Text to Morse/i })).toBeDisabled();
    await expect(page.getByRole('button', { name: /Morse to Text/i })).toBeDisabled();
  });
});
