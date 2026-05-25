import { test, expect } from '@playwright/test';

test.describe('JSONPath Tester', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/jsonpath-tester');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/JSONPath Tester/i);
  });

  test('should show JSONPath Tester heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'JSONPath Tester' })).toBeVisible();
  });

  test('should pre-populate with sample JSON and path', async ({ page }) => {
    const pathInput = page.locator('#path');
    await expect(pathInput).toHaveValue('$.store.books[0].title');
    const jsonInput = page.locator('#json');
    const value = await jsonInput.inputValue();
    expect(value).toContain('store');
  });

  test('should show result for default sample path', async ({ page }) => {
    // The default path $.store.books[0].title should return ["Book A"]
    const result = page.getByLabel('JSONPath query result');
    await expect(result).toHaveValue(/Book A/);
  });

  test('should evaluate root path expression', async ({ page }) => {
    const pathInput = page.locator('#path');
    await pathInput.fill('$.store.name');
    const result = page.getByLabel('JSONPath query result');
    await expect(result).toHaveValue(/My Store/);
  });

  test('should evaluate array index path', async ({ page }) => {
    const pathInput = page.locator('#path');
    await pathInput.fill('$.store.books[1].title');
    const result = page.getByLabel('JSONPath query result');
    await expect(result).toHaveValue(/Book B/);
  });

  test('should show error for invalid JSON in input', async ({ page }) => {
    const jsonInput = page.locator('#json');
    await jsonInput.fill('{bad json}');
    await expect(page.getByRole('alert')).toBeVisible();
  });

  test('should update result when JSON is changed', async ({ page }) => {
    const jsonInput = page.locator('#json');
    const pathInput = page.locator('#path');
    await pathInput.fill('$.name');
    await jsonInput.fill('{"name": "Charlie"}');
    const result = page.getByLabel('JSONPath query result');
    await expect(result).toHaveValue(/Charlie/);
  });

  test('should return empty array for non-matching path', async ({ page }) => {
    const pathInput = page.locator('#path');
    await pathInput.fill('$.nonexistent');
    const result = page.getByLabel('JSONPath query result');
    await expect(result).toHaveValue('[]');
  });

  test('should have Copy button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /copy/i })).toBeVisible();
  });

  test('should have Copy button disabled when result is empty', async ({ page }) => {
    // Enter invalid JSON so result is empty (error state shown instead of textarea)
    const jsonInput = page.locator('#json');
    await jsonInput.fill('{bad}');
    // Copy button should be disabled when there is no value
    await expect(page.getByRole('button', { name: /copy/i })).toBeDisabled();
  });
});
