import { test, expect } from '@playwright/test';

test.describe('Text Slugify - Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/text-slugify');
  });

  test('should load the page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Slugify/i);
  });

  test('should display main UI elements', async ({ page }) => {
    await expect(page.locator('#input')).toBeVisible();
    await expect(page.locator('#separator')).toBeVisible();
    await expect(page.locator('#maxLength')).toBeVisible();
    await expect(page.getByRole('button', { name: /Clear/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Copy/i })).toBeVisible();
  });

  test('should convert text to slug with hyphens by default', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('Hello World');
    // The output is rendered as a div with text content, not a textarea
    const output = page.locator('.font-mono.break-all');
    await expect(output).toContainText('hello-world');
  });

  test('should convert spaces to hyphens', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('foo bar baz');
    const output = page.locator('.font-mono.break-all');
    await expect(output).toContainText('foo-bar-baz');
  });

  test('should convert to lowercase by default', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('HELLO WORLD');
    const output = page.locator('.font-mono.break-all');
    const text = await output.textContent();
    expect(text?.toLowerCase()).toBe(text);
  });

  test('should use custom separator', async ({ page }) => {
    await page.locator('#separator').fill('_');
    await page.locator('#input').fill('hello world');
    const output = page.locator('.font-mono.break-all');
    await expect(output).toContainText('hello_world');
  });

  test('should limit slug length when maxLength is set', async ({ page }) => {
    await page.locator('#maxLength').fill('5');
    await page.locator('#input').fill('hello world');
    const output = page.locator('.font-mono.break-all');
    const text = await output.textContent();
    expect(text?.replace('slug-will-appear-here', '').length).toBeLessThanOrEqual(5);
  });

  test('should show placeholder when input is empty', async ({ page }) => {
    await expect(page.locator('.font-mono.break-all')).toContainText('slug-will-appear-here');
  });

  test('should clear input when Clear button is clicked', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('hello world');
    await page.getByRole('button', { name: /Clear/i }).click();
    await expect(input).toHaveValue('');
  });

  test('should have Copy button disabled when output is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Copy/i })).toBeDisabled();
  });

  test('should enable Copy button when output is present', async ({ page }) => {
    await page.locator('#input').fill('hello world');
    await expect(page.getByRole('button', { name: /Copy/i })).toBeEnabled();
  });
});
