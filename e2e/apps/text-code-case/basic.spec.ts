import { test, expect } from '@playwright/test';

test.describe('Code Case Converter - Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/text-code-case');
  });

  test('should load the page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Code Case Converter/i);
  });

  test('should display main UI elements', async ({ page }) => {
    await expect(page.locator('#input')).toBeVisible();
    await expect(page.locator('#output')).toBeVisible();
    await expect(page.getByRole('button', { name: /Clear/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Copy Result/i })).toBeVisible();
  });

  test('should display code case type options', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'camelCase' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'PascalCase' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'snake_case' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'kebab-case' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'CONSTANT_CASE' })).toBeVisible();
  });

  test('should convert to camelCase by default', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('hello world');
    const output = page.locator('#output');
    await expect(output).toHaveValue('helloWorld');
  });

  test('should convert to snake_case when selected', async ({ page }) => {
    await page.getByRole('button', { name: 'snake_case' }).click();
    const input = page.locator('#input');
    await input.fill('hello world');
    const output = page.locator('#output');
    await expect(output).toHaveValue('hello_world');
  });

  test('should convert to kebab-case when selected', async ({ page }) => {
    await page.getByText('kebab-case').click();
    const input = page.locator('#input');
    await input.fill('hello world');
    const output = page.locator('#output');
    await expect(output).toHaveValue('hello-world');
  });

  test('should convert to PascalCase when selected', async ({ page }) => {
    await page.getByText('PascalCase').click();
    const input = page.locator('#input');
    await input.fill('hello world');
    const output = page.locator('#output');
    await expect(output).toHaveValue('HelloWorld');
  });

  test('should convert to CONSTANT_CASE when selected', async ({ page }) => {
    await page.getByText('CONSTANT_CASE').click();
    const input = page.locator('#input');
    await input.fill('hello world');
    const output = page.locator('#output');
    await expect(output).toHaveValue('HELLO_WORLD');
  });

  test('should convert camelCase input to snake_case', async ({ page }) => {
    await page.getByRole('button', { name: 'snake_case' }).click();
    const input = page.locator('#input');
    await input.fill('helloWorld');
    const output = page.locator('#output');
    await expect(output).toHaveValue('hello_world');
  });

  test('should clear input when Clear button is clicked', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('helloWorld');
    await page.getByRole('button', { name: /Clear/i }).click();
    await expect(input).toHaveValue('');
  });

  test('should have Copy Result button disabled when input is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Copy Result/i })).toBeDisabled();
  });

  test('should enable Copy Result button when output is present', async ({ page }) => {
    await page.locator('#input').fill('hello world');
    await expect(page.getByRole('button', { name: /Copy Result/i })).toBeEnabled();
  });
});
