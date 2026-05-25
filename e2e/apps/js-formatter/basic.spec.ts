import { test, expect } from '@playwright/test';

test.describe('JS Formatter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/js-formatter');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/JS Formatter/i);
  });

  test('should display input and output textareas', async ({ page }) => {
    await expect(page.locator('#input')).toBeVisible();
    await expect(page.locator('#output')).toBeVisible();
  });

  test('should format minified JS into multi-line', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('function hello(){const x=1;return x;}');
    await page.getByRole('button', { name: /format/i }).click();
    const value = await page.locator('#output').inputValue();
    expect(value.split('\n').length).toBeGreaterThan(1);
    expect(value).toContain('function');
  });

  test('should minify JS into single line', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('function hello() {\n  const x = 1;\n  return x;\n}');
    await page.getByRole('button', { name: /minify/i }).click();
    const value = await page.locator('#output').inputValue();
    expect(value).not.toContain('\n');
    expect(value).toContain('function');
  });

  test('should preserve function names after formatting', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('const add=(a,b)=>a+b;const result=add(1,2);');
    await page.getByRole('button', { name: /format/i }).click();
    const value = await page.locator('#output').inputValue();
    expect(value).toContain('add');
    expect(value).toContain('result');
  });

  test('should format arrow function correctly', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('const fn=(x)=>{return x*2;};');
    await page.getByRole('button', { name: /format/i }).click();
    const value = await page.locator('#output').inputValue();
    expect(value.split('\n').length).toBeGreaterThan(1);
    expect(value).toContain('fn');
  });

  test('should clear input and output on clear button click', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('const x = 1;');
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
