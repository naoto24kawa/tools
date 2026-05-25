import { test, expect } from '@playwright/test';

test.describe('SQL Formatter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sql-formatter');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/SQL Formatter/i);
  });

  test('should display input and output textareas', async ({ page }) => {
    await expect(page.locator('#input')).toBeVisible();
    await expect(page.locator('#output')).toBeVisible();
  });

  test('should format minified SQL into multi-line', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('SELECT id,name FROM users WHERE active=1 ORDER BY name');
    await page.getByRole('button', { name: /format/i }).click();
    const value = await page.locator('#output').inputValue();
    expect(value.split('\n').length).toBeGreaterThan(1);
    expect(value).toContain('SELECT');
  });

  test('should minify SQL into single line', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('SELECT\n  id,\n  name\nFROM\n  users\nWHERE\n  active = 1');
    await page.getByRole('button', { name: /minify/i }).click();
    const value = await page.locator('#output').inputValue();
    expect(value).not.toContain('\n');
    expect(value).toContain('SELECT');
  });

  test('should preserve table and column names after formatting', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('SELECT user_id,email FROM accounts WHERE status="active"');
    await page.getByRole('button', { name: /format/i }).click();
    const value = await page.locator('#output').inputValue();
    expect(value).toContain('user_id');
    expect(value).toContain('email');
    expect(value).toContain('accounts');
  });

  test('should format JOIN queries correctly', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill(
      'SELECT u.name,o.total FROM users u INNER JOIN orders o ON u.id=o.user_id',
    );
    await page.getByRole('button', { name: /format/i }).click();
    const value = await page.locator('#output').inputValue();
    expect(value).toContain('JOIN');
    expect(value).toContain('users');
  });

  test('should clear input and output on clear button click', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('SELECT 1');
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
