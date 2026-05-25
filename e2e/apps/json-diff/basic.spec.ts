import { test, expect } from '@playwright/test';

test.describe('JSON Diff', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/json-diff');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/JSON Diff/i);
  });

  test('should show heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'JSON Diff' })).toBeVisible();
  });

  test('should show two input panels', async ({ page }) => {
    await expect(page.locator('#json-a')).toBeVisible();
    await expect(page.locator('#json-b')).toBeVisible();
  });

  test('should show no differences for identical JSON', async ({ page }) => {
    const jsonA = page.locator('#json-a');
    const jsonB = page.locator('#json-b');
    await jsonA.fill('{"name": "Alice", "age": 30}');
    await jsonB.fill('{"name": "Alice", "age": 30}');
    await expect(page.getByText('差分なし - JSONは同一です')).toBeVisible();
  });

  test('should detect changed value', async ({ page }) => {
    const jsonA = page.locator('#json-a');
    const jsonB = page.locator('#json-b');
    await jsonA.fill('{"name": "Alice"}');
    await jsonB.fill('{"name": "Bob"}');
    // Should show the changed path
    await expect(page.getByText('~ name')).toBeVisible();
  });

  test('should detect added key', async ({ page }) => {
    const jsonA = page.locator('#json-a');
    const jsonB = page.locator('#json-b');
    await jsonA.fill('{"name": "Alice"}');
    await jsonB.fill('{"name": "Alice", "age": 30}');
    // Added key marker
    await expect(page.getByText(/\+/)).toBeVisible();
  });

  test('should detect removed key', async ({ page }) => {
    const jsonA = page.locator('#json-a');
    const jsonB = page.locator('#json-b');
    await jsonA.fill('{"name": "Alice", "age": 30}');
    await jsonB.fill('{"name": "Alice"}');
    // Removed key marker
    await expect(page.getByText(/-/)).toBeVisible();
  });

  test('should show error for invalid JSON A', async ({ page }) => {
    const jsonA = page.locator('#json-a');
    const jsonB = page.locator('#json-b');
    await jsonA.fill('{invalid}');
    await jsonB.fill('{"key": "value"}');
    await expect(page.getByRole('alert')).toBeVisible();
  });

  test('should show placeholder text when both inputs are empty', async ({ page }) => {
    await expect(page.getByText('両方のJSONを入力してください')).toBeVisible();
  });

  test('should show diff count in heading', async ({ page }) => {
    const jsonA = page.locator('#json-a');
    const jsonB = page.locator('#json-b');
    await jsonA.fill('{"a": 1, "b": 2}');
    await jsonB.fill('{"a": 99, "b": 2}');
    // Differences heading shows count
    await expect(page.getByText(/Differences \(1\)/)).toBeVisible();
  });
});
