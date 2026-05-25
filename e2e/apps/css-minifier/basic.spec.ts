import { test, expect } from '@playwright/test';

test.describe('CSS Minifier', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/css-minifier');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/CSS Minifier/i);
  });

  test('should display input and output textareas', async ({ page }) => {
    await expect(page.locator('#input')).toBeVisible();
    await expect(page.locator('#output')).toBeVisible();
  });

  test('should minify CSS by removing whitespace', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('body {\n  color: red;\n  background: blue;\n}');
    await page.getByRole('button', { name: /minify/i }).click();
    const value = await page.locator('#output').inputValue();
    expect(value).not.toContain('\n');
    expect(value).toContain('color');
  });

  test('should remove CSS comments when option is enabled', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('/* main styles */\nbody { color: red; }');
    await page.getByRole('button', { name: /minify/i }).click();
    const value = await page.locator('#output').inputValue();
    expect(value).not.toContain('/* main styles */');
    expect(value).toContain('color');
  });

  test('should show stats after minification', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('body {\n  color: red;\n  font-size: 14px;\n}');
    await page.getByRole('button', { name: /minify/i }).click();
    await expect(page.getByText(/original/i)).toBeVisible();
    await expect(page.getByText(/minified/i)).toBeVisible();
    await expect(page.getByText(/saved/i)).toBeVisible();
  });

  test('should produce shorter output than input', async ({ page }) => {
    const input = page.locator('#input');
    const css = 'body {\n  color: red;\n  background: blue;\n  font-size: 14px;\n}';
    await input.fill(css);
    await page.getByRole('button', { name: /minify/i }).click();
    const value = await page.locator('#output').inputValue();
    expect(value.length).toBeLessThan(css.length);
  });

  test('should clear input and output on clear button click', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('body { color: red; }');
    await page.getByRole('button', { name: /minify/i }).click();
    await page.getByRole('button', { name: /clear/i }).click();
    expect(await input.inputValue()).toBe('');
    expect(await page.locator('#output').inputValue()).toBe('');
  });

  test('should disable minify button when input is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /minify/i })).toBeDisabled();
  });

  test('should disable copy button when output is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /copy result/i })).toBeDisabled();
  });

  test('should toggle remove whitespace option', async ({ page }) => {
    const checkbox = page.getByRole('checkbox', { name: /remove whitespace/i });
    await expect(checkbox).toBeChecked();
    await checkbox.click();
    await expect(checkbox).not.toBeChecked();
  });
});
