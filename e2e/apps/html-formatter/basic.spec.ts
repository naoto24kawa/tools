import { test, expect } from '@playwright/test';

test.describe('HTML Formatter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/html-formatter');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/HTML Formatter/i);
  });

  test('should display input and output textareas', async ({ page }) => {
    await expect(page.locator('#input')).toBeVisible();
    await expect(page.locator('#output')).toBeVisible();
  });

  test('should format inline HTML into multi-line', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('<div><p>hello</p></div>');
    await page.getByRole('button', { name: /format/i }).click();
    const output = page.locator('#output');
    const value = await output.inputValue();
    expect(value).toContain('<div>');
    expect(value.split('\n').length).toBeGreaterThan(1);
  });

  test('should minify HTML into single line', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('<div>\n  <p>hello</p>\n</div>');
    await page.getByRole('button', { name: /minify/i }).click();
    const output = page.locator('#output');
    const value = await output.inputValue();
    expect(value).not.toContain('\n');
    expect(value).toContain('<div>');
    expect(value).toContain('<p>hello</p>');
  });

  test('should preserve tag content after formatting', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('<section><h1>Title</h1><p>Body text</p></section>');
    await page.getByRole('button', { name: /format/i }).click();
    const value = await page.locator('#output').inputValue();
    expect(value).toContain('Title');
    expect(value).toContain('Body text');
  });

  test('should clear input and output on clear button click', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('<div>test</div>');
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

  test('should apply indentation based on selected indent size', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('<div><span>test</span></div>');
    await page.getByRole('button', { name: /format/i }).click();
    const value = await page.locator('#output').inputValue();
    // Default indent size is 2, so child elements should be indented
    const lines = value.split('\n');
    const indentedLine = lines.find((l) => l.startsWith('  '));
    expect(indentedLine).toBeDefined();
  });
});
