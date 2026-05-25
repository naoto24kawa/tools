import { test, expect } from '@playwright/test';

test.describe('HTML to Markdown Converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/html-to-markdown');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText(/HTML to Markdown Converter/i)).toBeVisible();
  });

  test('should show HTML input and Markdown output textareas', async ({ page }) => {
    await expect(page.locator('textarea#input')).toBeVisible();
    await expect(page.locator('textarea#output')).toBeVisible();
  });

  test('should have Convert button disabled when input is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /convert/i })).toBeDisabled();
  });

  test('should convert h1 HTML to markdown heading', async ({ page }) => {
    await page.locator('textarea#input').fill('<h1>Hello World</h1>');
    await page.getByRole('button', { name: /convert/i }).click();
    const output = page.locator('textarea#output');
    await expect(output).toHaveValue(/# Hello World/);
  });

  test('should convert bold tag to markdown bold', async ({ page }) => {
    await page.locator('textarea#input').fill('<p><strong>Bold text</strong></p>');
    await page.getByRole('button', { name: /convert/i }).click();
    await expect(page.locator('textarea#output')).toHaveValue(/\*\*Bold text\*\*/);
  });

  test('should convert anchor tag to markdown link', async ({ page }) => {
    await page.locator('textarea#input').fill('<a href="https://example.com">Example</a>');
    await page.getByRole('button', { name: /convert/i }).click();
    await expect(page.locator('textarea#output')).toHaveValue(/\[Example\]\(https:\/\/example\.com\)/);
  });

  test('should convert unordered list to markdown list', async ({ page }) => {
    await page.locator('textarea#input').fill('<ul><li>Item 1</li><li>Item 2</li></ul>');
    await page.getByRole('button', { name: /convert/i }).click();
    const output = await page.locator('textarea#output').inputValue();
    expect(output).toMatch(/- Item 1/);
    expect(output).toMatch(/- Item 2/);
  });

  test('should clear both fields when clicking Clear', async ({ page }) => {
    await page.locator('textarea#input').fill('<h1>Test</h1>');
    await page.getByRole('button', { name: /convert/i }).click();
    await page.getByRole('button', { name: /clear/i }).click();
    await expect(page.locator('textarea#input')).toHaveValue('');
    await expect(page.locator('textarea#output')).toHaveValue('');
  });

  test('should have Copy Result button disabled when output is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /copy result/i })).toBeDisabled();
  });
});
