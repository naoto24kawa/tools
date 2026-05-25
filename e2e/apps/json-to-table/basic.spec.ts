import { test, expect } from '@playwright/test';

test.describe('JSON to Table', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/json-to-table');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/JSON to Table/i);
  });

  test('should show heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'JSON to Table' })).toBeVisible();
  });

  test('should render table with headers for valid JSON array', async ({ page }) => {
    const input = page.locator('#json-input');
    await input.fill('[{"name":"Alice","age":30},{"name":"Bob","age":25}]');
    await expect(page.getByRole('table')).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'name' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'age' })).toBeVisible();
  });

  test('should render correct row data', async ({ page }) => {
    const input = page.locator('#json-input');
    await input.fill('[{"name":"Alice","age":30}]');
    await expect(page.getByRole('cell', { name: 'Alice' })).toBeVisible();
    await expect(page.getByRole('cell', { name: '30' })).toBeVisible();
  });

  test('should show row count in table heading', async ({ page }) => {
    const input = page.locator('#json-input');
    await input.fill('[{"a":1},{"a":2},{"a":3}]');
    await expect(page.getByRole('heading', { name: /Table \(3 rows\)/ })).toBeVisible();
  });

  test('should handle single-row JSON array', async ({ page }) => {
    const input = page.locator('#json-input');
    await input.fill('[{"id": 1, "label": "test"}]');
    await expect(page.getByRole('table')).toBeVisible();
    await expect(page.getByRole('heading', { name: /Table \(1 rows?\)/ })).toBeVisible();
  });

  test('should show error for non-array JSON', async ({ page }) => {
    const input = page.locator('#json-input');
    await input.fill('{"name": "Alice"}');
    await expect(page.getByRole('alert')).toBeVisible();
  });

  test('should show error for invalid JSON', async ({ page }) => {
    const input = page.locator('#json-input');
    await input.fill('{bad}');
    await expect(page.getByRole('alert')).toBeVisible();
  });

  test('should not show table when input is empty', async ({ page }) => {
    await expect(page.getByRole('table')).not.toBeVisible();
  });

  test('should handle objects with different keys (sparse columns)', async ({ page }) => {
    const input = page.locator('#json-input');
    await input.fill('[{"a":1,"b":2},{"a":3}]');
    await expect(page.getByRole('table')).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'a' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'b' })).toBeVisible();
  });
});
