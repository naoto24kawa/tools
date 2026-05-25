import { test, expect } from '@playwright/test';

test.describe('Markdown Preview - Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/text-markdown-preview');
  });

  test('should load the page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Markdown Preview/i);
  });

  test('should display main UI elements', async ({ page }) => {
    await expect(page.getByRole('textbox', { name: /Markdownテキスト入力/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /HTML出力プレビュー/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /HTML/i })).toBeVisible();
  });

  test('should pre-populate with sample markdown content', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /Markdownテキスト入力/i });
    const value = await input.inputValue();
    expect(value).toContain('# Hello World');
    expect(value).toContain('**bold**');
  });

  test('should show HTML output for sample content', async ({ page }) => {
    const output = page.getByRole('textbox', { name: /HTML出力プレビュー/i });
    const value = await output.inputValue();
    expect(value.length).toBeGreaterThan(0);
    expect(value).toContain('<h1>');
  });

  test('should update HTML output when markdown changes', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /Markdownテキスト入力/i });
    await input.fill('# My Custom Heading');
    const output = page.getByRole('textbox', { name: /HTML出力プレビュー/i });
    const value = await output.inputValue();
    expect(value).toContain('<h1>');
    expect(value).toContain('My Custom Heading');
  });

  test('should convert bold markdown to HTML in real time', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /Markdownテキスト入力/i });
    await input.fill('**bold text**');
    const output = page.getByRole('textbox', { name: /HTML出力プレビュー/i });
    const value = await output.inputValue();
    expect(value).toContain('<strong>');
    expect(value).toContain('bold text');
  });

  test('should convert unordered list to HTML', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /Markdownテキスト入力/i });
    await input.fill('- item 1\n- item 2\n- item 3');
    const output = page.getByRole('textbox', { name: /HTML出力プレビュー/i });
    const value = await output.inputValue();
    expect(value).toContain('<ul>');
    expect(value).toContain('<li>');
    expect(value).toContain('item 1');
  });

  test('should display panel titles', async ({ page }) => {
    await expect(page.getByText('Markdown').first()).toBeVisible();
    await expect(page.getByText('Preview').first()).toBeVisible();
  });

  test('should show empty HTML output when input is cleared', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /Markdownテキスト入力/i });
    await input.fill('');
    const output = page.getByRole('textbox', { name: /HTML出力プレビュー/i });
    await expect(output).toHaveValue('');
  });

  test('should have Copy HTML button visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: /HTML/i })).toBeVisible();
  });
});
