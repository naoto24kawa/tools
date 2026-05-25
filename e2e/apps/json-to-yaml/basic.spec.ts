import { test, expect } from '@playwright/test';

test.describe('JSON to YAML', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/json-to-yaml');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/JSON to YAML/i);
  });

  test('should show heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'JSON to YAML' })).toBeVisible();
  });

  test('should convert simple JSON object to YAML', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('{"name": "Alice", "age": 30}');
    const output = page.locator('#output');
    await expect(output).toHaveValue('name: Alice\nage: 30');
  });

  test('should convert nested JSON to YAML', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('{"user": {"id": 1}}');
    const output = page.locator('#output');
    const value = await output.inputValue();
    expect(value).toContain('user:');
    expect(value).toContain('id: 1');
  });

  test('should convert JSON array to YAML list', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('{"items": [1, 2, 3]}');
    const output = page.locator('#output');
    const value = await output.inputValue();
    expect(value).toContain('items:');
    expect(value).toContain('- 1');
  });

  test('should show error for invalid JSON', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('{bad json}');
    await expect(page.getByRole('alert')).toBeVisible();
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

  test('should have Copy YAML button disabled when output is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /copy yaml/i })).toBeDisabled();
  });

  test('should enable Copy YAML button when conversion succeeds', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('{"key": "value"}');
    await expect(page.getByRole('button', { name: /copy yaml/i })).toBeEnabled();
  });
});
