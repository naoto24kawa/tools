import { test, expect } from '@playwright/test';

test.describe('JavaScript Minifier', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/js-minifier');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/JavaScript Minifier/i);
  });

  test('should display input and output textareas', async ({ page }) => {
    await expect(page.locator('#input')).toBeVisible();
    await expect(page.locator('#output')).toBeVisible();
  });

  test('should minify JS by removing whitespace', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('function hello() {\n  const x = 1;\n  return x;\n}');
    await page.getByRole('button', { name: /minify/i }).click();
    const value = await page.locator('#output').inputValue();
    expect(value).not.toContain('\n');
    expect(value).toContain('function');
  });

  test('should remove JS comments when option is enabled', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('// This is a comment\nconst x = 1;');
    await page.getByRole('button', { name: /minify/i }).click();
    const value = await page.locator('#output').inputValue();
    expect(value).not.toContain('// This is a comment');
    expect(value).toContain('const');
  });

  test('should show stats after minification', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('function hello() {\n  const x = 1;\n  return x;\n}');
    await page.getByRole('button', { name: /minify/i }).click();
    await expect(page.getByText(/original:/i)).toBeVisible();
    await expect(page.getByText(/minified:/i)).toBeVisible();
    await expect(page.getByText(/saved:/i)).toBeVisible();
  });

  test('should produce shorter output than input', async ({ page }) => {
    const input = page.locator('#input');
    const js =
      'function add(a, b) {\n  // add two numbers\n  return a + b;\n}\nconst result = add(1, 2);';
    await input.fill(js);
    await page.getByRole('button', { name: /minify/i }).click();
    const value = await page.locator('#output').inputValue();
    expect(value.length).toBeLessThan(js.length);
  });

  test('should clear input and output on clear button click', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('const x = 1;');
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

  test('should toggle remove comments option', async ({ page }) => {
    const checkbox = page.getByRole('checkbox', { name: /remove comments/i });
    await expect(checkbox).toBeChecked();
    await checkbox.click();
    await expect(checkbox).not.toBeChecked();
  });
});
