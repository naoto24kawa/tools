import { test, expect } from '@playwright/test';

test.describe('YAML to JSON Converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/yaml-to-json');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText('YAML to JSON Converter')).toBeVisible();
  });

  test('should show YAML input and JSON output areas', async ({ page }) => {
    await expect(page.locator('textarea#input')).toBeVisible();
    await expect(page.locator('textarea#output')).toBeVisible();
  });

  test('should convert YAML to JSON', async ({ page }) => {
    await page.locator('textarea#input').fill('name: Alice\nage: 30');
    await page.getByRole('button', { name: /convert/i }).click();

    const output = page.locator('textarea#output');
    await expect(output).not.toHaveValue('');
    const value = await output.inputValue();
    expect(value).toContain('"name"');
    expect(value).toContain('"Alice"');
    expect(value).toContain('"age"');
    expect(value).toContain('30');
  });

  test('should convert YAML array to JSON array', async ({ page }) => {
    await page.locator('textarea#input').fill('hobbies:\n  - reading\n  - coding');
    await page.getByRole('button', { name: /convert/i }).click();

    const output = page.locator('textarea#output');
    const value = await output.inputValue();
    expect(value).toContain('"hobbies"');
    expect(value).toContain('"reading"');
    expect(value).toContain('"coding"');
  });

  test('should convert YAML boolean values', async ({ page }) => {
    await page.locator('textarea#input').fill('active: true\ndebug: false');
    await page.getByRole('button', { name: /convert/i }).click();

    const output = page.locator('textarea#output');
    const value = await output.inputValue();
    expect(value).toContain('true');
    expect(value).toContain('false');
  });

  test('should have convert button disabled when input is empty', async ({ page }) => {
    const convertBtn = page.getByRole('button', { name: /convert/i });
    await expect(convertBtn).toBeDisabled();
  });

  test('should clear input and output', async ({ page }) => {
    await page.locator('textarea#input').fill('name: Alice');
    await page.getByRole('button', { name: /convert/i }).click();
    await page.getByRole('button', { name: /clear/i }).click();

    await expect(page.locator('textarea#input')).toHaveValue('');
    await expect(page.locator('textarea#output')).toHaveValue('');
  });

  test('should show options card with format selector', async ({ page }) => {
    await expect(page.getByText('Options')).toBeVisible();
    await expect(page.getByText('Format')).toBeVisible();
  });
});
