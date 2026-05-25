import { test, expect } from '@playwright/test';

test.describe('Bionic Reading - Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/text-bionic-reading');
  });

  test('should load the page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Bionic Reading/i);
  });

  test('should display main UI elements', async ({ page }) => {
    await expect(page.getByRole('textbox', { name: /変換するテキストを入力/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /Bionic Reading形式の出力/i })).toBeVisible();
    await expect(page.locator('#ratio')).toBeVisible();
    await expect(page.getByRole('button', { name: /Clear/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Copy/i })).toBeVisible();
  });

  test('should display output format buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'HTML' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Markdown' })).toBeVisible();
  });

  test('should show bionic preview when text is entered', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /変換するテキストを入力/i });
    await input.fill('hello world');
    // Preview section should appear
    const previewCard = page.getByText('Preview');
    await expect(previewCard).toBeVisible();
    // Bold text in preview
    const bold = page.locator('b').first();
    await expect(bold).toBeVisible();
  });

  test('should generate HTML output by default', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /変換するテキストを入力/i });
    await input.fill('hello');
    const output = page.getByRole('textbox', { name: /Bionic Reading形式の出力/i });
    const value = await output.inputValue();
    expect(value).toContain('<b>');
    expect(value).toContain('</b>');
  });

  test('should generate Markdown output when Markdown format is selected', async ({ page }) => {
    await page.getByRole('button', { name: 'Markdown' }).click();
    const input = page.getByRole('textbox', { name: /変換するテキストを入力/i });
    await input.fill('hello');
    const output = page.getByRole('textbox', { name: /Bionic Reading形式の出力/i });
    const value = await output.inputValue();
    expect(value).toContain('**');
  });

  test('should adjust fixation ratio with range slider', async ({ page }) => {
    const ratioSlider = page.locator('#ratio');
    await ratioSlider.fill('0.8');
    // Check that ratio label updates
    await expect(page.getByText(/80%/)).toBeVisible();
  });

  test('should clear input when Clear button is clicked', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /変換するテキストを入力/i });
    await input.fill('hello world');
    await page.getByRole('button', { name: /Clear/i }).click();
    await expect(input).toHaveValue('');
  });

  test('should clear output after clearing input', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /変換するテキストを入力/i });
    await input.fill('hello world');
    await page.getByRole('button', { name: /Clear/i }).click();
    const output = page.getByRole('textbox', { name: /Bionic Reading形式の出力/i });
    await expect(output).toHaveValue('');
  });

  test('should have Copy button disabled when output is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Copy/i })).toBeDisabled();
  });

  test('should enable Copy button when output is present', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /変換するテキストを入力/i });
    await input.fill('hello');
    await expect(page.getByRole('button', { name: /Copy/i })).toBeEnabled();
  });
});
