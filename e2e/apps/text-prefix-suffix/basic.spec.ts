import { test, expect } from '@playwright/test';

test.describe('Text Prefix / Suffix - Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/text-prefix-suffix');
  });

  test('should load the page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Prefix Suffix/i);
  });

  test('should display main UI elements', async ({ page }) => {
    await expect(page.locator('#input')).toBeVisible();
    await expect(page.locator('#output')).toBeVisible();
    await expect(page.locator('#prefix')).toBeVisible();
    await expect(page.locator('#suffix')).toBeVisible();
    await expect(page.locator('#skipEmpty')).toBeVisible();
    await expect(page.getByRole('button', { name: /Clear/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Copy Result/i })).toBeVisible();
  });

  test('should add prefix to each line', async ({ page }) => {
    await page.locator('#prefix').fill('- ');
    await page.locator('#input').fill('apple\nbanana\ncherry');
    const output = page.locator('#output');
    await expect(output).toHaveValue('- apple\n- banana\n- cherry');
  });

  test('should add suffix to each line', async ({ page }) => {
    await page.locator('#suffix').fill(';');
    await page.locator('#input').fill('apple\nbanana\ncherry');
    const output = page.locator('#output');
    await expect(output).toHaveValue('apple;\nbanana;\ncherry;');
  });

  test('should add both prefix and suffix to each line', async ({ page }) => {
    await page.locator('#prefix').fill('[');
    await page.locator('#suffix').fill(']');
    await page.locator('#input').fill('apple\nbanana');
    const output = page.locator('#output');
    await expect(output).toHaveValue('[apple]\n[banana]');
  });

  test('should skip empty lines by default', async ({ page }) => {
    await page.locator('#prefix').fill('- ');
    await page.locator('#input').fill('apple\n\ncherry');
    const output = page.locator('#output');
    const value = await output.inputValue();
    // Empty line should not have prefix "- "
    const lines = value.split('\n');
    expect(lines[1]).toBe('');
  });

  test('should apply prefix to empty lines when skip is unchecked', async ({ page }) => {
    await page.locator('#skipEmpty').uncheck();
    await page.locator('#prefix').fill('X');
    await page.locator('#input').fill('a\n\nb');
    const output = page.locator('#output');
    const value = await output.inputValue();
    const lines = value.split('\n');
    expect(lines[1]).toBe('X');
  });

  test('should clear input when Clear button is clicked', async ({ page }) => {
    await page.locator('#input').fill('apple\nbanana');
    await page.getByRole('button', { name: /Clear/i }).click();
    await expect(page.locator('#input')).toHaveValue('');
  });

  test('should have Copy Result button disabled when output is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Copy Result/i })).toBeDisabled();
  });

  test('should enable Copy Result button when output is present', async ({ page }) => {
    await page.locator('#prefix').fill('- ');
    await page.locator('#input').fill('item');
    await expect(page.getByRole('button', { name: /Copy Result/i })).toBeEnabled();
  });
});
