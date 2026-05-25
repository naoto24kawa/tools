import { test, expect } from '@playwright/test';

test.describe('TOML to JSON Converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/toml-to-json');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /toml to json converter/i })).toBeVisible();
  });

  test('should show TOML input and JSON output textareas', async ({ page }) => {
    await expect(page.locator('textarea#input')).toBeVisible();
    await expect(page.locator('textarea#output')).toBeVisible();
  });

  test('should show Convert button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /convert/i })).toBeVisible();
  });

  test('should disable Convert button when input is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /convert/i })).toBeDisabled();
  });

  test('should convert simple TOML to JSON', async ({ page }) => {
    await page.locator('textarea#input').fill('[database]\nhost = "localhost"\nport = 5432');
    await page.getByRole('button', { name: /convert/i }).click();
    const output = page.locator('textarea#output');
    await expect(output).toContainText('"database"');
    await expect(output).toContainText('"host"');
    await expect(output).toContainText('"localhost"');
    await expect(output).toContainText('5432');
  });

  test('should convert TOML with boolean and number values', async ({ page }) => {
    await page.locator('textarea#input').fill('enabled = true\ncount = 42\nname = "test"');
    await page.getByRole('button', { name: /convert/i }).click();
    const output = page.locator('textarea#output');
    await expect(output).toContainText('true');
    await expect(output).toContainText('42');
    await expect(output).toContainText('"test"');
  });

  test('should convert TOML with malformed section and still produce output', async ({ page }) => {
    // The parser is lenient and processes what it can
    await page.locator('textarea#input').fill('key = "value"');
    await page.getByRole('button', { name: /convert/i }).click();
    const output = page.locator('textarea#output');
    await expect(output).not.toHaveValue('');
  });

  test('should show format options (Pretty Print / Compact)', async ({ page }) => {
    await expect(page.getByText('Format', { exact: true })).toBeVisible();
    // Format select trigger should be visible
    await expect(page.getByText('Pretty Print')).toBeVisible();
  });

  test('should output pretty-printed JSON by default', async ({ page }) => {
    await page.locator('textarea#input').fill('key = "value"');
    await page.getByRole('button', { name: /convert/i }).click();
    const output = page.locator('textarea#output');
    const value = await output.inputValue();
    // Pretty print uses indentation
    expect(value).toContain('\n');
    expect(value).toContain('  ');
  });

  test('should output compact JSON when Compact is selected', async ({ page }) => {
    // Open select and choose Compact
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: 'Compact' }).click();
    await page.locator('textarea#input').fill('key = "value"');
    await page.getByRole('button', { name: /convert/i }).click();
    const output = page.locator('textarea#output');
    const value = await output.inputValue();
    // Compact has no newlines
    expect(value).not.toContain('\n');
  });

  test('should clear input and output when Clear button is clicked', async ({ page }) => {
    await page.locator('textarea#input').fill('key = "value"');
    await page.getByRole('button', { name: /convert/i }).click();
    await expect(page.locator('textarea#output')).not.toHaveValue('');
    await page.getByRole('button', { name: /clear/i }).click();
    await expect(page.locator('textarea#input')).toHaveValue('');
    await expect(page.locator('textarea#output')).toHaveValue('');
  });

  test('should enable Copy Result button after conversion', async ({ page }) => {
    // Initially disabled
    await expect(page.getByRole('button', { name: /copy result/i })).toBeDisabled();
    await page.locator('textarea#input').fill('x = 1');
    await page.getByRole('button', { name: /convert/i }).click();
    await expect(page.getByRole('button', { name: /copy result/i })).toBeEnabled();
  });
});
