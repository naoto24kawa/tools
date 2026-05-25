import { test, expect } from '@playwright/test';

test.describe('.env File Editor', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/env-file-editor');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText('.env File Editor')).toBeVisible();
  });

  test('should show Editor and Compare tabs', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Editor' })).toBeVisible();
    await expect(page.getByRole('button', { name: /Compare/i })).toBeVisible();
  });

  test('should show Import section', async ({ page }) => {
    await expect(page.getByText('Import')).toBeVisible();
    await expect(page.getByPlaceholder(/Paste .env content here/i)).toBeVisible();
  });

  test('should show Parse button', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Parse' })).toBeVisible();
  });

  test('should parse .env content and show entries', async ({ page }) => {
    const textarea = page.getByPlaceholder(/Paste .env content here/i);
    await textarea.fill('DATABASE_URL=postgres://localhost:5432/mydb\nAPI_KEY=secret123\nPORT=3000');
    await page.getByRole('button', { name: 'Parse' }).click();
    await expect(page.getByText('Parsed 3 entries', { exact: true })).toBeVisible();
  });

  test('should show key-value entries after parsing', async ({ page }) => {
    const textarea = page.getByPlaceholder(/Paste .env content here/i);
    await textarea.fill('DATABASE_URL=postgres://localhost\nAPI_KEY=abc123');
    await page.getByRole('button', { name: 'Parse' }).click();
    // Entries with those key names should appear
    const keyInputs = page.locator('input[placeholder="KEY"]');
    await expect(keyInputs.first()).toBeVisible();
  });

  test('should show Add button to add new entries', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Add/i }).first()).toBeVisible();
  });

  test('should add empty entry when Add button is clicked', async ({ page }) => {
    await page.getByRole('button', { name: /Add/i }).first().click();
    const keyInputs = page.locator('input[placeholder="KEY"]');
    await expect(keyInputs).toHaveCount(1);
  });

  test('should generate output from parsed entries', async ({ page }) => {
    const textarea = page.getByPlaceholder(/Paste .env content here/i);
    await textarea.fill('FOO=bar\nBAZ=qux');
    await page.getByRole('button', { name: 'Parse' }).click();
    const output = page.locator('pre');
    await expect(output).toContainText('FOO=bar');
    await expect(output).toContainText('BAZ=qux');
  });

  test('should show Compare tab content when clicked', async ({ page }) => {
    await page.getByRole('button', { name: /Compare/i }).click();
    await expect(page.getByText('File A')).toBeVisible();
    await expect(page.getByText('File B')).toBeVisible();
  });

  test('should show diff result when both files have different keys', async ({ page }) => {
    await page.getByRole('button', { name: /Compare/i }).click();
    const textareas = page.locator('textarea');
    await textareas.nth(0).fill('KEY_A=value1\nSHARED=same');
    await textareas.nth(1).fill('KEY_B=value2\nSHARED=same');
    // Diff should highlight only in A and only in B
    await expect(page.getByText('Only in File A:')).toBeVisible();
    await expect(page.getByText('Only in File B:')).toBeVisible();
  });

  test('should show identical message when both files are same', async ({ page }) => {
    await page.getByRole('button', { name: /Compare/i }).click();
    const textareas = page.locator('textarea');
    await textareas.nth(0).fill('KEY=value');
    await textareas.nth(1).fill('KEY=value');
    await expect(page.getByText('Files are identical.')).toBeVisible();
  });
});
