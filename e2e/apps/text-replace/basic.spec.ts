import { test, expect } from '@playwright/test';

test.describe('Text Replace - Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/text-replace');
  });

  test('should load the page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Text Replace/i);
  });

  test('should display main UI elements', async ({ page }) => {
    await expect(page.locator('#input')).toBeVisible();
    await expect(page.locator('#output')).toBeVisible();
    await expect(page.locator('#search')).toBeVisible();
    await expect(page.locator('#replace')).toBeVisible();
    await expect(page.getByRole('button', { name: /Clear/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Copy Result/i })).toBeVisible();
  });

  test('should display option checkboxes', async ({ page }) => {
    await expect(page.locator('#useRegex')).toBeVisible();
    await expect(page.locator('#caseSensitive')).toBeVisible();
    await expect(page.locator('#global')).toBeVisible();
  });

  test('should replace text globally by default', async ({ page }) => {
    await page.locator('#input').fill('hello hello hello');
    await page.locator('#search').fill('hello');
    await page.locator('#replace').fill('world');
    await expect(page.locator('#output')).toHaveValue('world world world');
  });

  test('should replace only first occurrence when global is unchecked', async ({ page }) => {
    await page.locator('#global').uncheck();
    await page.locator('#input').fill('hello hello hello');
    await page.locator('#search').fill('hello');
    await page.locator('#replace').fill('world');
    await expect(page.locator('#output')).toHaveValue('world hello hello');
  });

  test('should show match count', async ({ page }) => {
    await page.locator('#input').fill('hello hello hello');
    await page.locator('#search').fill('hello');
    await expect(page.getByText(/3 件マッチ/)).toBeVisible();
  });

  test('should support regex replacement', async ({ page }) => {
    await page.locator('#useRegex').check();
    await page.locator('#input').fill('foo123bar456');
    await page.locator('#search').fill('\\d+');
    await page.locator('#replace').fill('NUM');
    await expect(page.locator('#output')).toHaveValue('fooNUMbarNUM');
  });

  test('should be case sensitive by default', async ({ page }) => {
    await page.locator('#input').fill('Hello hello HELLO');
    await page.locator('#search').fill('hello');
    await page.locator('#replace').fill('world');
    await expect(page.locator('#output')).toHaveValue('Hello world HELLO');
  });

  test('should be case insensitive when option is unchecked', async ({ page }) => {
    await page.locator('#caseSensitive').uncheck();
    await page.locator('#input').fill('Hello hello HELLO');
    await page.locator('#search').fill('hello');
    await page.locator('#replace').fill('world');
    await expect(page.locator('#output')).toHaveValue('world world world');
  });

  test('should clear all fields when Clear button is clicked', async ({ page }) => {
    await page.locator('#input').fill('hello world');
    await page.locator('#search').fill('hello');
    await page.locator('#replace').fill('hi');
    await page.getByRole('button', { name: /Clear/i }).click();
    await expect(page.locator('#input')).toHaveValue('');
    await expect(page.locator('#search')).toHaveValue('');
    await expect(page.locator('#replace')).toHaveValue('');
  });

  test('should show original text in output when search is empty', async ({ page }) => {
    await page.locator('#input').fill('hello world');
    await expect(page.locator('#output')).toHaveValue('hello world');
  });
});
