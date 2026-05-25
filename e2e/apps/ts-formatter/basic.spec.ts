import { test, expect } from '@playwright/test';

test.describe('TypeScript Formatter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ts-formatter');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/TypeScript Formatter/i);
  });

  test('should display input and output textareas', async ({ page }) => {
    await expect(page.locator('#input')).toBeVisible();
    await expect(page.locator('#output')).toBeVisible();
  });

  test('should format minified TypeScript into multi-line', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('interface User{name:string;age:number;}function greet(u:User){return u.name;}');
    await page.getByRole('button', { name: /format/i }).click();
    const value = await page.locator('#output').inputValue();
    expect(value.split('\n').length).toBeGreaterThan(1);
    expect(value).toContain('interface');
  });

  test('should minify TypeScript into single line', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('interface User {\n  name: string;\n  age: number;\n}');
    await page.getByRole('button', { name: /minify/i }).click();
    const value = await page.locator('#output').inputValue();
    expect(value).not.toContain('\n');
    expect(value).toContain('interface');
  });

  test('should preserve TypeScript type annotations after formatting', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('const add=(a:number,b:number):number=>a+b;');
    await page.getByRole('button', { name: /format/i }).click();
    const value = await page.locator('#output').inputValue();
    expect(value).toContain('number');
    expect(value).toContain('add');
  });

  test('should preserve generics after formatting', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('function identity<T>(arg:T):T{return arg;}');
    await page.getByRole('button', { name: /format/i }).click();
    const value = await page.locator('#output').inputValue();
    expect(value).toContain('identity');
    expect(value).toContain('<T>');
  });

  test('should clear input and output on clear button click', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('const x: number = 1;');
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
