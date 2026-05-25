import { test, expect } from '@playwright/test';

const SAMPLE_SQL = `CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  age INTEGER,
  active BOOLEAN DEFAULT true
);`;

test.describe('SQL to JSON Schema', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sql-to-json-schema');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText('SQL to JSON Schema Converter')).toBeVisible();
  });

  test('should show SQL input textarea', async ({ page }) => {
    await expect(page.locator('#input')).toBeVisible();
  });

  test('should show JSON Schema output textarea', async ({ page }) => {
    await expect(page.locator('#output')).toBeVisible();
  });

  test('should have Convert button disabled when input is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /convert/i })).toBeDisabled();
  });

  test('should convert CREATE TABLE to JSON Schema', async ({ page }) => {
    await page.locator('#input').fill(SAMPLE_SQL);
    await page.getByRole('button', { name: /convert/i }).click();
    const output = page.locator('#output');
    await expect(output).not.toHaveValue('');
    const outputValue = await output.inputValue();
    expect(outputValue).toContain('"$schema"');
    expect(outputValue).toContain('users');
  });

  test('should include required fields from NOT NULL columns', async ({ page }) => {
    await page.locator('#input').fill(SAMPLE_SQL);
    await page.getByRole('button', { name: /convert/i }).click();
    const output = await page.locator('#output').inputValue();
    expect(output).toContain('"required"');
    expect(output).toContain('name');
    expect(output).toContain('email');
  });

  test('should enable Copy Result button after conversion', async ({ page }) => {
    await page.locator('#input').fill(SAMPLE_SQL);
    await page.getByRole('button', { name: /convert/i }).click();
    await expect(page.getByRole('button', { name: /copy result/i })).toBeEnabled();
  });

  test('should have format selector with Pretty Print option', async ({ page }) => {
    await expect(page.getByText('Pretty Print')).toBeVisible();
  });

  test('should clear input and output when Clear button clicked', async ({ page }) => {
    await page.locator('#input').fill(SAMPLE_SQL);
    await page.getByRole('button', { name: /convert/i }).click();
    await page.getByRole('button', { name: /clear/i }).click();
    await expect(page.locator('#input')).toHaveValue('');
    await expect(page.locator('#output')).toHaveValue('');
  });

  test('should map INTEGER type to number in JSON Schema', async ({ page }) => {
    await page.locator('#input').fill('CREATE TABLE items (qty INTEGER NOT NULL);');
    await page.getByRole('button', { name: /convert/i }).click();
    const output = await page.locator('#output').inputValue();
    expect(output).toContain('"integer"');
  });
});
