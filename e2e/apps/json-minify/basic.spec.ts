import { test, expect } from '@playwright/test';

test.describe('JSON Minify', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/json-minify');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/JSON Minify/i);
  });

  test('should show heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'JSON Minify' })).toBeVisible();
  });

  test('should minify valid JSON', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('{\n  "name": "test",\n  "value": 42\n}');
    const output = page.locator('#output');
    await expect(output).toHaveValue('{"name":"test","value":42}');
  });

  test('should minify nested JSON', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('{\n  "a": {\n    "b": 1\n  }\n}');
    const output = page.locator('#output');
    await expect(output).toHaveValue('{"a":{"b":1}}');
  });

  test('should show error alert for invalid JSON', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('{invalid json}');
    await expect(page.getByRole('alert')).toBeVisible();
  });

  test('should clear output when invalid JSON is entered', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('{"key": "value"}');
    const output = page.locator('#output');
    await expect(output).toHaveValue('{"key":"value"}');

    await input.fill('{bad}');
    await expect(output).toHaveValue('');
  });

  test('should show empty output for empty input', async ({ page }) => {
    const output = page.locator('#output');
    await expect(output).toHaveValue('');
  });

  test('should clear input when Clear button is clicked', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('{"key": "value"}');
    await page.getByRole('button', { name: /clear/i }).click();
    await expect(input).toHaveValue('');
  });

  test('should have Copy button disabled when output is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /copy/i })).toBeDisabled();
  });

  test('should enable Copy button when output has content', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('{"key": "value"}');
    await expect(page.getByRole('button', { name: /copy/i })).toBeEnabled();
  });
});
