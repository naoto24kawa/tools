import { test, expect } from '@playwright/test';

test.describe('JSON Editor', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/json-editor');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/JSON Editor/i);
  });

  test('should show JSON Editor heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'JSON Editor' })).toBeVisible();
  });

  test('should pre-populate editor with sample JSON', async ({ page }) => {
    const editor = page.locator('#editor');
    await expect(editor).toHaveValue(/\"name\"/);
  });

  test('should show Valid JSON toast when Validate is clicked on valid JSON', async ({ page }) => {
    const editor = page.locator('#editor');
    await editor.fill('{"key": "value"}');
    await page.getByRole('button', { name: 'Validate' }).click();
    await expect(page.getByText('Valid JSON!', { exact: true }).first()).toBeVisible();
  });

  test('should show error alert when Validate is clicked on invalid JSON', async ({ page }) => {
    const editor = page.locator('#editor');
    await editor.fill('{bad json}');
    await page.getByRole('button', { name: 'Validate' }).click();
    await expect(page.getByRole('alert')).toBeVisible();
  });

  test('should format JSON when Format button is clicked', async ({ page }) => {
    const editor = page.locator('#editor');
    await editor.fill('{"b":2,"a":1}');
    await page.getByRole('button', { name: 'Format' }).click();
    const value = await editor.inputValue();
    // Formatted JSON should have indentation
    expect(value).toContain('\n');
    expect(value).toContain('  ');
  });

  test('should minify JSON when Minify button is clicked', async ({ page }) => {
    const editor = page.locator('#editor');
    await editor.fill('{\n  "key": "value"\n}');
    await page.getByRole('button', { name: 'Minify' }).click();
    await expect(editor).toHaveValue('{"key":"value"}');
  });

  test('should sort keys when Sort Keys button is clicked', async ({ page }) => {
    const editor = page.locator('#editor');
    await editor.fill('{"b": 2, "a": 1}');
    await page.getByRole('button', { name: 'Sort Keys' }).click();
    const value = await editor.inputValue();
    const parsed = JSON.parse(value);
    const keys = Object.keys(parsed);
    expect(keys).toEqual([...keys].sort());
  });

  test('should show error when Format is clicked on invalid JSON', async ({ page }) => {
    const editor = page.locator('#editor');
    await editor.fill('{invalid}');
    await page.getByRole('button', { name: 'Format' }).click();
    await expect(page.getByRole('alert')).toBeVisible();
  });

  test('should clear error after editing to valid JSON', async ({ page }) => {
    const editor = page.locator('#editor');
    await editor.fill('{bad}');
    await page.getByRole('button', { name: 'Validate' }).click();
    await expect(page.getByRole('alert')).toBeVisible();
    await editor.fill('{"ok": true}');
    await expect(page.getByRole('alert')).not.toBeVisible();
  });
});
