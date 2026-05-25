import { test, expect } from '@playwright/test';

test.describe('CSV to JSON Converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/csv-to-json');
  });

  test('should load page with heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /csv to json converter/i })).toBeVisible();
  });

  test('should show CSV Input and JSON Output textareas', async ({ page }) => {
    await expect(page.locator('textarea#input')).toBeVisible();
    await expect(page.locator('textarea#output')).toBeVisible();
  });

  test('should show Options section', async ({ page }) => {
    await expect(page.getByText('Options')).toBeVisible();
    await expect(page.getByText('Header Row')).toBeVisible();
    await expect(page.getByText('Delimiter')).toBeVisible();
  });

  test('should convert basic CSV to JSON', async ({ page }) => {
    const csv = 'name,age,city\nAlice,30,Tokyo\nBob,25,Osaka';
    await page.locator('textarea#input').fill(csv);
    await page.getByRole('button', { name: /convert/i }).click();
    const output = await page.locator('textarea#output').inputValue();
    expect(output).toContain('"name"');
    expect(output).toContain('Alice');
    expect(output).toContain('Tokyo');
  });

  test('should produce valid JSON array output', async ({ page }) => {
    const csv = 'name,age\nAlice,30\nBob,25';
    await page.locator('textarea#input').fill(csv);
    await page.getByRole('button', { name: /convert/i }).click();
    const output = await page.locator('textarea#output').inputValue();
    const parsed = JSON.parse(output);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed).toHaveLength(2);
    expect(parsed[0].name).toBe('Alice');
    expect(parsed[0].age).toBe('30');
  });

  test('should disable Convert button when input is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /convert/i })).toBeDisabled();
  });

  test('should show Download button after conversion', async ({ page }) => {
    await page.locator('textarea#input').fill('a,b\n1,2');
    await page.getByRole('button', { name: /convert/i }).click();
    await expect(page.getByRole('button', { name: /download/i })).toBeEnabled();
  });

  test('should clear both input and output when Clear is clicked', async ({ page }) => {
    await page.locator('textarea#input').fill('name,age\nAlice,30');
    await page.getByRole('button', { name: /convert/i }).click();
    await page.getByRole('button', { name: /clear/i }).click();
    await expect(page.locator('textarea#input')).toHaveValue('');
    await expect(page.locator('textarea#output')).toHaveValue('');
  });

  test('should handle semicolon delimiter option', async ({ page }) => {
    // Change delimiter to semicolon
    await page.getByText(/delimiter/i).locator('..').getByRole('combobox').click();
    await page.getByRole('option', { name: /semicolon/i }).click();
    const csv = 'name;age\nAlice;30';
    await page.locator('textarea#input').fill(csv);
    await page.getByRole('button', { name: /convert/i }).click();
    const output = await page.locator('textarea#output').inputValue();
    expect(output).toContain('Alice');
  });
});
