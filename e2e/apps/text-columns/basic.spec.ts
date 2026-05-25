import { test, expect } from '@playwright/test';

test.describe('Text Columns', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/text-columns');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Text Columns' })).toBeVisible();
  });

  test('should show input textarea', async ({ page }) => {
    const input = page.getByLabel('Text input');
    await expect(input).toBeVisible();
  });

  test('should display column preview when text is entered', async ({ page }) => {
    const input = page.getByLabel('Text input');
    await input.fill(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    );
    await expect(page.getByText('Column Preview')).toBeVisible();
  });

  test('should not show column preview when input is empty', async ({ page }) => {
    await expect(page.getByText('Column Preview')).not.toBeVisible();
  });

  test('should show settings panel with column count slider', async ({ page }) => {
    await expect(page.getByText('Settings')).toBeVisible();
    await expect(page.getByText(/Columns:/)).toBeVisible();
  });

  test('should show column count description after entering text', async ({ page }) => {
    const input = page.getByLabel('Text input');
    await input.fill('Some sample text for testing column layout display.');
    const description = page.getByText(/columns/i).nth(1);
    await expect(description).toBeVisible();
  });

  test('should have column rule style selector', async ({ page }) => {
    const select = page.locator('select');
    await expect(select).toBeVisible();
    await select.selectOption('solid');
    await expect(page.getByText(/Rule Width:/)).toBeVisible();
  });

  test('should have print button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /print/i })).toBeVisible();
  });
});
