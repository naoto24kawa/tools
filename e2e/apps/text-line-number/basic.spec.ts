import { test, expect } from '@playwright/test';

test.describe('Text Line Number - Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/text-line-number');
  });

  test('should load the page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Line Number/i);
  });

  test('should display main UI elements', async ({ page }) => {
    await expect(page.locator('#input')).toBeVisible();
    await expect(page.locator('#output')).toBeVisible();
    await expect(page.locator('#startNumber')).toBeVisible();
    await expect(page.locator('#separator')).toBeVisible();
    await expect(page.getByRole('button', { name: /Clear/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Copy Result/i })).toBeVisible();
  });

  test('should display option checkboxes', async ({ page }) => {
    await expect(page.locator('#zeroPadding')).toBeVisible();
    await expect(page.locator('#skipEmpty')).toBeVisible();
  });

  test('should add line numbers starting from 1 by default', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('apple\nbanana\ncherry');
    const output = page.locator('#output');
    const value = await output.inputValue();
    expect(value).toContain('1');
    expect(value).toContain('2');
    expect(value).toContain('3');
    expect(value).toContain('apple');
    expect(value).toContain('banana');
    expect(value).toContain('cherry');
  });

  test('should start line numbers from custom start value', async ({ page }) => {
    const startNumber = page.locator('#startNumber');
    await startNumber.fill('10');
    const input = page.locator('#input');
    await input.fill('first\nsecond');
    const output = page.locator('#output');
    const value = await output.inputValue();
    expect(value).toContain('10');
    expect(value).toContain('11');
  });

  test('should use custom separator', async ({ page }) => {
    const separator = page.locator('#separator');
    await separator.fill(') ');
    const input = page.locator('#input');
    await input.fill('line one');
    const output = page.locator('#output');
    const value = await output.inputValue();
    expect(value).toContain(') line one');
  });

  test('should apply zero padding when option is checked', async ({ page }) => {
    await page.locator('#zeroPadding').check();
    const input = page.locator('#input');
    await input.fill('a\nb\nc\nd\ne\nf\ng\nh\ni\nj\nk');
    const output = page.locator('#output');
    const value = await output.inputValue();
    // With zero padding for 11 lines, single-digit lines should be zero-padded
    expect(value).toMatch(/0\d/);
  });

  test('should clear input when Clear button is clicked', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('line1\nline2');
    await page.getByRole('button', { name: /Clear/i }).click();
    await expect(input).toHaveValue('');
  });

  test('should have Copy Result button disabled when input is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Copy Result/i })).toBeDisabled();
  });

  test('should enable Copy Result button when output is present', async ({ page }) => {
    await page.locator('#input').fill('hello');
    await expect(page.getByRole('button', { name: /Copy Result/i })).toBeEnabled();
  });
});
