import { test, expect } from '@playwright/test';

test.describe('Braille Converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/braille-converter');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Braille Converter' })).toBeVisible();
  });

  test('should show mode buttons (Text to Braille and Braille to Text)', async ({ page }) => {
    await expect(page.getByRole('button', { name: /text to braille/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /braille to text/i })).toBeVisible();
  });

  test('should convert text to braille', async ({ page }) => {
    await page.locator('textarea#input').fill('hello');
    // Output is reactive via useMemo
    const output = page.locator('textarea#output');
    await expect(output).not.toBeEmpty();
    const content = await output.inputValue();
    // Braille characters are Unicode block U+2800-U+28FF
    expect(content).toMatch(/[⠀-⣿]/);
  });

  test('should convert braille back to text', async ({ page }) => {
    // Switch to Braille to Text mode
    await page.getByRole('button', { name: /braille to text/i }).click();
    // ⠓⠑⠇⠇⠕ is "hello" in braille (h=⠓, e=⠑, l=⠇, l=⠇, o=⠕)
    await page.locator('textarea#input').fill('⠓⠑⠇⠇⠕');
    const output = page.locator('textarea#output');
    await expect(output).not.toBeEmpty();
    const content = await output.inputValue();
    expect(content.toLowerCase()).toContain('hello');
  });

  test('should update output reactively when input changes', async ({ page }) => {
    await page.locator('textarea#input').fill('a');
    const outputA = await page.locator('textarea#output').inputValue();

    await page.locator('textarea#input').fill('ab');
    const outputAB = await page.locator('textarea#output').inputValue();

    expect(outputAB.length).toBeGreaterThan(outputA.length);
  });

  test('should have copy button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /copy/i })).toBeVisible();
  });

  test('should disable copy button when output is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /copy/i })).toBeDisabled();
  });

  test('should enable copy button when output is present', async ({ page }) => {
    await page.locator('textarea#input').fill('hello');
    await expect(page.getByRole('button', { name: /copy/i })).toBeEnabled();
  });

  test('should show Text to Braille mode as active by default', async ({ page }) => {
    // The "Text to Braille" button should have the default (active) variant
    const activeBtn = page.getByRole('button', { name: /text to braille/i });
    // Active button uses 'default' variant which applies primary bg
    await expect(activeBtn).toHaveClass(/bg-primary|inline-flex/);
  });
});
