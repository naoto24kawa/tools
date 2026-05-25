import { test, expect } from '@playwright/test';

test.describe('CSS Formatter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/css-formatter');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/CSS Formatter/i);
  });

  test('should display input and output textareas', async ({ page }) => {
    await expect(page.locator('#input')).toBeVisible();
    await expect(page.locator('#output')).toBeVisible();
  });

  test('should format minified CSS into multi-line', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('body{color:red;background:blue;}p{font-size:14px;}');
    await page.getByRole('button', { name: /format/i }).click();
    const value = await page.locator('#output').inputValue();
    expect(value.split('\n').length).toBeGreaterThan(1);
    expect(value).toContain('color');
    expect(value).toContain('red');
  });

  test('should minify formatted CSS into single line', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('body {\n  color: red;\n  background: blue;\n}');
    await page.getByRole('button', { name: /minify/i }).click();
    const value = await page.locator('#output').inputValue();
    expect(value).not.toContain('\n');
    expect(value).toContain('color');
  });

  test('should preserve CSS property values after formatting', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('.container{margin:0 auto;padding:16px;}');
    await page.getByRole('button', { name: /format/i }).click();
    const value = await page.locator('#output').inputValue();
    expect(value).toContain('margin');
    expect(value).toContain('padding');
  });

  test('should clear input and output on clear button click', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('body { color: red; }');
    await page.getByRole('button', { name: /format/i }).click();
    await page.getByRole('button', { name: /clear/i }).click();
    expect(await input.inputValue()).toBe('');
    expect(await page.locator('#output').inputValue()).toBe('');
  });

  test('should disable format button when input is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /format/i })).toBeDisabled();
  });

  test('should disable copy button when output is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /copy result/i })).toBeDisabled();
  });

  test('should format with 4 spaces indent when selected', async ({ page }) => {
    // Change indent size to 4
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: '4 spaces' }).click();
    const input = page.locator('#input');
    await input.fill('div{color:red;font-size:14px;}');
    await page.getByRole('button', { name: /format/i }).click();
    const value = await page.locator('#output').inputValue();
    const lines = value.split('\n');
    const indentedLine = lines.find((l) => l.startsWith('    '));
    expect(indentedLine).toBeDefined();
  });
});
