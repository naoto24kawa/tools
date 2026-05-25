import { test, expect } from '@playwright/test';

test.describe('JSON to TOML', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/json-to-toml');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/JSON to TOML/i);
  });

  test('should show heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'JSON to TOML' })).toBeVisible();
  });

  test('should convert simple JSON object to TOML', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('{"name": "Alice", "age": 30}');
    const output = page.locator('#toml-output');
    await expect(output).toHaveValue('name = "Alice"\nage = 30');
  });

  test('should convert nested JSON object to TOML sections', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('{"server": {"host": "localhost", "port": 8080}}');
    const output = page.locator('#toml-output');
    const value = await output.inputValue();
    expect(value).toContain('[server]');
    expect(value).toContain('host = "localhost"');
    expect(value).toContain('port = 8080');
  });

  test('should show error for non-object JSON (array)', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('[1, 2, 3]');
    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.getByText(/TOML root must be an object/i)).toBeVisible();
  });

  test('should show error for invalid JSON', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('{bad json}');
    await expect(page.getByRole('alert')).toBeVisible();
  });

  test('should show empty output for empty input', async ({ page }) => {
    const output = page.locator('#toml-output');
    await expect(output).toHaveValue('');
  });

  test('should clear input when Clear button is clicked', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('{"key": "value"}');
    await page.getByRole('button', { name: /clear/i }).click();
    await expect(input).toHaveValue('');
  });

  test('should have Copy TOML button disabled when output is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /copy toml/i })).toBeDisabled();
  });

  test('should enable Copy TOML button when conversion succeeds', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('{"key": "value"}');
    await expect(page.getByRole('button', { name: /copy toml/i })).toBeEnabled();
  });

  test('should handle boolean and number values', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('{"active": true, "count": 5}');
    const output = page.locator('#toml-output');
    const value = await output.inputValue();
    expect(value).toContain('active = true');
    expect(value).toContain('count = 5');
  });
});
