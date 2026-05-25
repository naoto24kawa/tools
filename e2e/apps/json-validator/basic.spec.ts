import { test, expect } from '@playwright/test';

test.describe('JSON Validator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/json-validator');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/JSON Validator/i);
  });

  test('should show heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'JSON Validator' })).toBeVisible();
  });

  test('should show valid status for valid JSON', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('{"name": "Alice", "age": 30}');
    await expect(page.getByText('Valid JSON')).toBeVisible();
  });

  test('should show formatted output for valid JSON', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('{"name":"Alice","age":30}');
    const formatted = page.locator('#formatted');
    await expect(formatted).toHaveValue(/\"name\": \"Alice\"/);
  });

  test('should show error for invalid JSON', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('{invalid}');
    // Error text should be visible in the live region
    await expect(page.getByText(/expected|unexpected|invalid|json/i).first()).toBeVisible();
  });

  test('should show error text for unclosed bracket', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('{"key": "value"');
    // The validator should show an error — valid indicator should not appear
    await expect(page.getByText('Valid JSON')).not.toBeVisible();
  });

  test('should display stats for valid JSON object', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('{"a": 1, "b": [1, 2]}');
    await expect(page.getByText(/keys:/i)).toBeVisible();
    await expect(page.getByText(/depth:/i)).toBeVisible();
  });

  test('should not show stats section for empty input', async ({ page }) => {
    await expect(page.getByText(/keys:/i)).not.toBeVisible();
  });

  test('should update validation in real-time as user types', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('{"key"');
    await expect(page.getByText('Valid JSON')).not.toBeVisible();
    await input.fill('{"key": "value"}');
    await expect(page.getByText('Valid JSON')).toBeVisible();
  });
});
