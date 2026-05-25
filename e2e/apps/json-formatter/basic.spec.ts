import { test, expect } from '@playwright/test';

test.describe('JSON Formatter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/json-formatter');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/JSON Formatter/i);
  });

  test('should show heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'JSON Formatter' })).toBeVisible();
  });

  test('should show Valid JSON indicator for valid input', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('{"name":"Alice","age":30}');
    await expect(page.getByText('Valid JSON')).toBeVisible();
  });

  test('should show Invalid JSON indicator for bad input', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('{bad json}');
    await expect(page.getByText('Invalid JSON')).toBeVisible();
  });

  test('should format JSON with pretty print', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('{"name":"Alice","age":30}');
    await page.getByRole('button', { name: 'Format' }).click();

    const output = page.locator('#output');
    await expect(output).toHaveValue(/\"name\": \"Alice\"/);
    await expect(output).toHaveValue(/\"age\": 30/);
  });

  test('should minify JSON', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('{\n  "name": "Alice",\n  "age": 30\n}');
    await page.getByRole('button', { name: 'Minify' }).click();

    const output = page.locator('#output');
    await expect(output).toHaveValue('{"name":"Alice","age":30}');
  });

  test('should disable Format/Minify buttons for invalid JSON', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('{invalid}');
    await expect(page.getByRole('button', { name: 'Format' })).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Minify' })).toBeDisabled();
  });

  test('should clear input and output', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('{"key":"value"}');
    await page.getByRole('button', { name: 'Format' }).click();

    await page.getByRole('button', { name: /Clear/ }).click();
    await expect(input).toHaveValue('');
    const output = page.locator('#output');
    await expect(output).toHaveValue('');
  });

  test('should change indent size', async ({ page }) => {
    await page.locator('#indent').selectOption('4');
    const input = page.locator('#input');
    await input.fill('{"a":1}');
    await page.getByRole('button', { name: 'Format' }).click();

    const output = page.locator('#output');
    // 4 spaces indent
    await expect(output).toHaveValue(/    \"a\"/);
  });

  test('should format nested JSON', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('{"user":{"name":"Bob","scores":[1,2,3]}}');
    await page.getByRole('button', { name: 'Format' }).click();

    const output = page.locator('#output');
    await expect(output).toHaveValue(/\"user\"/);
    await expect(output).toHaveValue(/\"scores\"/);
  });
});
