import { test, expect } from '@playwright/test';

test.describe('XML to JSON Converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/xml-to-json');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText('XML to JSON Converter')).toBeVisible();
  });

  test('should show options card', async ({ page }) => {
    // "Options" is a shadcn CardTitle (renders as div.text-2xl, not a heading element)
    await expect(page.locator('div.text-2xl', { hasText: 'Options' })).toBeVisible();
    await expect(page.getByText('Include Attributes', { exact: true })).toBeVisible();
  });

  test('should show XML input and JSON output areas', async ({ page }) => {
    await expect(page.locator('textarea#input')).toBeVisible();
    await expect(page.locator('textarea#output')).toBeVisible();
  });

  test('should convert XML to JSON', async ({ page }) => {
    await page.locator('textarea#input').fill('<root><name>Alice</name></root>');
    await page.getByRole('button', { name: /convert/i }).click();

    const output = page.locator('textarea#output');
    await expect(output).not.toHaveValue('');
    const value = await output.inputValue();
    expect(value).toContain('"name"');
    expect(value).toContain('Alice');
  });

  test('should convert XML with attributes', async ({ page }) => {
    await page.locator('textarea#input').fill('<item id="1">Hello</item>');
    await page.getByRole('button', { name: /convert/i }).click();

    const output = page.locator('textarea#output');
    const value = await output.inputValue();
    expect(value).toContain('"@id"');
    expect(value).toContain('"1"');
  });

  test('should convert multiple child elements', async ({ page }) => {
    const xml = '<root>\n  <item id="1">Hello</item>\n  <item id="2">World</item>\n</root>';
    await page.locator('textarea#input').fill(xml);
    await page.getByRole('button', { name: /convert/i }).click();

    const output = page.locator('textarea#output');
    const value = await output.inputValue();
    expect(value).toContain('Hello');
    expect(value).toContain('World');
  });

  test('should show error when XML is invalid', async ({ page }) => {
    await page.locator('textarea#input').fill('<unclosed>');
    await page.getByRole('button', { name: /convert/i }).click();
    // Toast title exact text to avoid strict mode with notification aria element
    await expect(page.getByText('Conversion failed', { exact: true })).toBeVisible({ timeout: 3000 });
  });

  test('should have convert button disabled when input is empty', async ({ page }) => {
    const convertBtn = page.getByRole('button', { name: /convert/i });
    await expect(convertBtn).toBeDisabled();
  });

  test('should clear both input and output with Clear button', async ({ page }) => {
    await page.locator('textarea#input').fill('<root><name>Alice</name></root>');
    await page.getByRole('button', { name: /convert/i }).click();
    await page.getByRole('button', { name: /clear/i }).click();

    await expect(page.locator('textarea#input')).toHaveValue('');
    await expect(page.locator('textarea#output')).toHaveValue('');
  });
});
