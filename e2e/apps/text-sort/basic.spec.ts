import { test, expect } from '@playwright/test';

test.describe('Text Sort - Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/text-sort');
  });

  test('should load the page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Text Sort/i);
  });

  test('should display main UI elements', async ({ page }) => {
    await expect(page.locator('#input')).toBeVisible();
    await expect(page.locator('#output')).toBeVisible();
    await expect(page.getByRole('button', { name: /Clear/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Copy Result/i })).toBeVisible();
  });

  test('should display sort option controls', async ({ page }) => {
    await expect(page.getByRole('button', { name: '昇順' })).toBeVisible();
    await expect(page.getByRole('button', { name: '降順' })).toBeVisible();
  });

  test('should sort lines in ascending order by default', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('banana\napple\ncherry');
    const output = page.locator('#output');
    await expect(output).toHaveValue('apple\nbanana\ncherry');
  });

  test('should sort lines in descending order when selected', async ({ page }) => {
    await page.getByRole('button', { name: '降順' }).click();
    const input = page.locator('#input');
    await input.fill('banana\napple\ncherry');
    const output = page.locator('#output');
    await expect(output).toHaveValue('cherry\nbanana\napple');
  });

  test('should remove duplicate lines when option is checked', async ({ page }) => {
    await page.locator('#removeDuplicates').check();
    const input = page.locator('#input');
    await input.fill('apple\nbanana\napple');
    const output = page.locator('#output');
    const value = await output.inputValue();
    const lines = value.split('\n');
    expect(lines.filter((l) => l === 'apple').length).toBe(1);
  });

  test('should sort numerically when numeric option is checked', async ({ page }) => {
    await page.locator('#numeric').check();
    const input = page.locator('#input');
    await input.fill('10\n2\n1');
    const output = page.locator('#output');
    await expect(output).toHaveValue('1\n2\n10');
  });

  test('should clear input when Clear button is clicked', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('banana\napple');
    await page.getByRole('button', { name: /Clear/i }).click();
    await expect(input).toHaveValue('');
  });

  test('should have Copy Result button disabled when output is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Copy Result/i })).toBeDisabled();
  });

  test('should enable Copy Result button when output is present', async ({ page }) => {
    await page.locator('#input').fill('apple\nbanana');
    await expect(page.getByRole('button', { name: /Copy Result/i })).toBeEnabled();
  });
});
