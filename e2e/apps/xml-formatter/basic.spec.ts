import { test, expect } from '@playwright/test';

test.describe('XML Formatter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/xml-formatter');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/XML Formatter/i);
  });

  test('should display input and output textareas', async ({ page }) => {
    await expect(page.locator('#input')).toBeVisible();
    await expect(page.locator('#output')).toBeVisible();
  });

  test('should format inline XML into multi-line', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('<root><child>value</child></root>');
    await page.getByRole('button', { name: /format/i }).click();
    const value = await page.locator('#output').inputValue();
    expect(value.split('\n').length).toBeGreaterThan(1);
    expect(value).toContain('<root>');
  });

  test('should minify XML into single line', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('<root>\n  <child>value</child>\n</root>');
    await page.getByRole('button', { name: /minify/i }).click();
    const value = await page.locator('#output').inputValue();
    expect(value).not.toContain('\n');
    expect(value).toContain('<root>');
    expect(value).toContain('<child>value</child>');
  });

  test('should preserve XML attributes after formatting', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('<book id="1" lang="en"><title>Hello</title></book>');
    await page.getByRole('button', { name: /format/i }).click();
    const value = await page.locator('#output').inputValue();
    expect(value).toContain('id="1"');
    expect(value).toContain('lang="en"');
  });

  test('should preserve XML text content after formatting', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('<items><item>Apple</item><item>Banana</item></items>');
    await page.getByRole('button', { name: /format/i }).click();
    const value = await page.locator('#output').inputValue();
    expect(value).toContain('Apple');
    expect(value).toContain('Banana');
  });

  test('should clear input and output on clear button click', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('<root><child/></root>');
    await page.getByRole('button', { name: /format/i }).click();
    await page.getByRole('button', { name: /clear/i }).click();
    expect(await input.inputValue()).toBe('');
    expect(await page.locator('#output').inputValue()).toBe('');
  });

  test('should disable format button when input is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /format/i })).toBeDisabled();
  });

  test('should disable copy button when output is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /copy result/i })).toBeDisabled();
  });
});
