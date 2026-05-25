import { test, expect } from '@playwright/test';

test.describe('Text Case Converter - Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/text-case-converter');
  });

  test('should load the page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Text Case Converter/i);
  });

  test('should display main UI elements', async ({ page }) => {
    await expect(page.locator('#input')).toBeVisible();
    await expect(page.locator('#output')).toBeVisible();
    await expect(page.getByRole('button', { name: /Clear/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Copy Result/i })).toBeVisible();
  });

  test('should display conversion type options', async ({ page }) => {
    await expect(page.getByText('UPPER CASE')).toBeVisible();
    await expect(page.getByText('lower case')).toBeVisible();
    await expect(page.getByText('Title Case')).toBeVisible();
  });

  test('should convert to uppercase by default', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('hello world');
    const output = page.locator('#output');
    await expect(output).toHaveValue('HELLO WORLD');
  });

  test('should convert to lowercase when selected', async ({ page }) => {
    await page.getByText('lower case').click();
    const input = page.locator('#input');
    await input.fill('HELLO WORLD');
    const output = page.locator('#output');
    await expect(output).toHaveValue('hello world');
  });

  test('should convert to title case when selected', async ({ page }) => {
    await page.getByText('Title Case').click();
    const input = page.locator('#input');
    await input.fill('hello world');
    const output = page.locator('#output');
    await expect(output).toHaveValue('Hello World');
  });

  test('should convert to sentence case when selected', async ({ page }) => {
    await page.getByText('Sentence case').click();
    const input = page.locator('#input');
    await input.fill('hello world. foo bar.');
    const output = page.locator('#output');
    const value = await output.inputValue();
    expect(value).toMatch(/^Hello/);
  });

  test('should clear input when Clear button is clicked', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('hello world');
    await page.getByRole('button', { name: /Clear/i }).click();
    await expect(input).toHaveValue('');
  });

  test('should show empty output when input is cleared', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('hello');
    await page.getByRole('button', { name: /Clear/i }).click();
    await expect(page.locator('#output')).toHaveValue('');
  });

  test('should have Copy Result button disabled when output is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Copy Result/i })).toBeDisabled();
  });

  test('should enable Copy Result button when output is present', async ({ page }) => {
    await page.locator('#input').fill('hello');
    await expect(page.getByRole('button', { name: /Copy Result/i })).toBeEnabled();
  });
});
