import { test, expect } from '@playwright/test';

test.describe('JSON Schema Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/json-schema-generator');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/JSON Schema/i);
  });

  test('should show heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'JSON Schema Generator' })).toBeVisible();
  });

  test('should generate schema from simple JSON object', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('{"name":"Alice","age":30,"active":true}');
    await page.getByRole('button', { name: /Generate/ }).click();

    const output = page.locator('#output');
    await expect(output).toHaveValue(/\$schema/);
    await expect(output).toHaveValue(/type.*object/);
    await expect(output).toHaveValue(/\"name\"/);
    await expect(output).toHaveValue(/\"age\"/);
  });

  test('should generate schema with required fields', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('{"id":1,"email":"test@example.com"}');
    await page.getByRole('button', { name: /Generate/ }).click();

    const output = page.locator('#output');
    await expect(output).toHaveValue(/required/);
  });

  test('should generate schema with array type', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('{"tags":["a","b","c"]}');
    await page.getByRole('button', { name: /Generate/ }).click();

    const output = page.locator('#output');
    await expect(output).toHaveValue(/array/);
  });

  test('should show error for invalid JSON input', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('{invalid json}');
    await page.getByRole('button', { name: /Generate/ }).click();

    // Toast or error should appear
    await expect(page.getByText(/failed|error|invalid/i)).toBeVisible();
  });

  test('should disable Generate button for empty input', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('');
    await expect(page.getByRole('button', { name: /Generate/ })).toBeDisabled();
  });

  test('should clear input and output', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('{"x":1}');
    await page.getByRole('button', { name: /Generate/ }).click();

    await page.getByRole('button', { name: /Clear/ }).click();
    await expect(input).toHaveValue('');
    const output = page.locator('#output');
    await expect(output).toHaveValue('');
  });

  test('should generate schema for nested objects', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('{"user":{"name":"Bob","age":25},"scores":[1,2,3]}');
    await page.getByRole('button', { name: /Generate/ }).click();

    const output = page.locator('#output');
    await expect(output).toHaveValue(/properties/);
    await expect(output).toHaveValue(/\"user\"/);
  });

  test('should include example values when option is set', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('{"name":"Alice"}');
    await page.getByRole('button', { name: /Generate/ }).click();

    const output = page.locator('#output');
    await expect(output).toHaveValue(/examples|example/i);
  });
});
