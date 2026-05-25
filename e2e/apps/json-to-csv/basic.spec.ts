import { test, expect } from '@playwright/test';

test.describe('JSON to CSV', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/json-to-csv');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/JSON to CSV/i);
  });

  test('should show heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'JSON to CSV' })).toBeVisible();
  });

  test('should convert JSON array to CSV', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('[{"name":"Alice","age":30},{"name":"Bob","age":25}]');
    const output = page.locator('#output');
    await expect(output).toHaveValue('name,age\nAlice,30\nBob,25');
  });

  test('should handle single-item array', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('[{"id":1,"label":"test"}]');
    const output = page.locator('#output');
    await expect(output).toHaveValue('id,label\n1,test');
  });

  test('should escape CSV values that contain commas', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('[{"name":"Doe, John","age":40}]');
    const output = page.locator('#output');
    const value = await output.inputValue();
    expect(value).toContain('"Doe, John"');
  });

  test('should show error for non-array JSON', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('{"name": "Alice"}');
    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.getByText(/array/i)).toBeVisible();
  });

  test('should show error for invalid JSON', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('{bad}');
    await expect(page.getByRole('alert')).toBeVisible();
  });

  test('should show empty output for empty input', async ({ page }) => {
    const output = page.locator('#output');
    await expect(output).toHaveValue('');
  });

  test('should clear input when Clear button is clicked', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('[{"a":1}]');
    await page.getByRole('button', { name: /clear/i }).click();
    await expect(input).toHaveValue('');
  });

  test('should have Copy CSV button disabled when output is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /copy csv/i })).toBeDisabled();
  });

  test('should enable Copy CSV button when conversion succeeds', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('[{"name":"Alice"}]');
    await expect(page.getByRole('button', { name: /copy csv/i })).toBeEnabled();
  });
});
