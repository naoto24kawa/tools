import { test, expect } from '@playwright/test';

test.describe('Markdown to HTML - Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/text-markdown-html');
  });

  test('should load the page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Markdown to HTML/i);
  });

  test('should display main UI elements', async ({ page }) => {
    await expect(page.locator('#markdown-input')).toBeVisible();
    await expect(page.locator('#html-output')).toBeVisible();
    await expect(page.getByRole('button', { name: /Clear/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Copy HTML/i })).toBeVisible();
  });

  test('should convert heading markdown to HTML', async ({ page }) => {
    const input = page.locator('#markdown-input');
    await input.fill('# Hello World');
    const output = page.locator('#html-output');
    const value = await output.inputValue();
    expect(value).toContain('<h1>');
    expect(value).toContain('Hello World');
    expect(value).toContain('</h1>');
  });

  test('should convert bold markdown to HTML', async ({ page }) => {
    const input = page.locator('#markdown-input');
    await input.fill('**bold text**');
    const output = page.locator('#html-output');
    const value = await output.inputValue();
    expect(value).toContain('<strong>');
    expect(value).toContain('bold text');
    expect(value).toContain('</strong>');
  });

  test('should convert italic markdown to HTML', async ({ page }) => {
    const input = page.locator('#markdown-input');
    await input.fill('*italic text*');
    const output = page.locator('#html-output');
    const value = await output.inputValue();
    expect(value).toContain('<em>');
    expect(value).toContain('italic text');
    expect(value).toContain('</em>');
  });

  test('should convert unordered list to HTML', async ({ page }) => {
    const input = page.locator('#markdown-input');
    await input.fill('- item one\n- item two');
    const output = page.locator('#html-output');
    const value = await output.inputValue();
    expect(value).toContain('<ul>');
    expect(value).toContain('<li>');
    expect(value).toContain('item one');
  });

  test('should convert blockquote to HTML', async ({ page }) => {
    const input = page.locator('#markdown-input');
    await input.fill('> this is a quote');
    const output = page.locator('#html-output');
    const value = await output.inputValue();
    expect(value).toContain('<blockquote>');
    expect(value).toContain('this is a quote');
  });

  test('should produce empty output for empty input', async ({ page }) => {
    const output = page.locator('#html-output');
    await expect(output).toHaveValue('');
  });

  test('should clear input when Clear button is clicked', async ({ page }) => {
    const input = page.locator('#markdown-input');
    await input.fill('# Hello');
    await page.getByRole('button', { name: /Clear/i }).click();
    await expect(input).toHaveValue('');
  });

  test('should clear output after clearing input', async ({ page }) => {
    const input = page.locator('#markdown-input');
    await input.fill('# Hello');
    await page.getByRole('button', { name: /Clear/i }).click();
    await expect(page.locator('#html-output')).toHaveValue('');
  });

  test('should have Copy HTML button disabled when output is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Copy HTML/i })).toBeDisabled();
  });

  test('should enable Copy HTML button when output is present', async ({ page }) => {
    await page.locator('#markdown-input').fill('# Hello');
    await expect(page.getByRole('button', { name: /Copy HTML/i })).toBeEnabled();
  });
});
