import { test, expect } from '@playwright/test';

test.describe('SCSS Formatter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/scss-formatter');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/SCSS Formatter/i);
  });

  test('should display input and output textareas', async ({ page }) => {
    await expect(page.locator('#input')).toBeVisible();
    await expect(page.locator('#output')).toBeVisible();
  });

  test('should format minified SCSS into multi-line', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('.nav{color:blue;&:hover{color:red;}}');
    await page.getByRole('button', { name: /format/i }).click();
    const value = await page.locator('#output').inputValue();
    expect(value.split('\n').length).toBeGreaterThan(1);
    expect(value).toContain('color');
  });

  test('should minify SCSS into single line', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('.nav {\n  color: blue;\n  &:hover {\n    color: red;\n  }\n}');
    await page.getByRole('button', { name: /minify/i }).click();
    const value = await page.locator('#output').inputValue();
    expect(value).not.toContain('\n');
    expect(value).toContain('color');
  });

  test('should preserve SCSS variables after formatting', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('$primary:#333;body{color:$primary;}');
    await page.getByRole('button', { name: /format/i }).click();
    const value = await page.locator('#output').inputValue();
    expect(value).toContain('$primary');
  });

  test('should preserve SCSS nesting after formatting', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('.parent{color:red;.child{color:blue;}}');
    await page.getByRole('button', { name: /format/i }).click();
    const value = await page.locator('#output').inputValue();
    expect(value).toContain('.parent');
    expect(value).toContain('.child');
  });

  test('should clear input and output on clear button click', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('.nav { color: blue; }');
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
});
