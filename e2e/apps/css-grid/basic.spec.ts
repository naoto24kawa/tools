import { test, expect } from '@playwright/test';

test.describe('CSS Grid Playground', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/css-grid');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/CSS Grid/i);
  });

  test('should display grid preview area', async ({ page }) => {
    await expect(page.getByLabel('CSS Gridプレビュー')).toBeVisible();
  });

  test('should show display: grid in CSS output', async ({ page }) => {
    await expect(page.getByText(/display: grid/)).toBeVisible();
  });

  test('should display Properties section', async ({ page }) => {
    await expect(page.getByText('Properties')).toBeVisible();
  });

  test('should show grid-template-columns input', async ({ page }) => {
    await expect(page.getByText('grid-template-columns').first()).toBeVisible();
  });

  test('should show grid-template-rows input', async ({ page }) => {
    await expect(page.getByText('grid-template-rows').first()).toBeVisible();
  });

  test('should show gap slider', async ({ page }) => {
    await expect(page.getByLabel('gap')).toBeVisible();
  });

  test('should show Items count slider', async ({ page }) => {
    await expect(page.getByLabel('アイテム数')).toBeVisible();
  });

  test('should show alignment options for justifyItems', async ({ page }) => {
    await expect(page.getByText('justifyItems')).toBeVisible();
    await expect(page.getByRole('button', { name: 'stretch' }).first()).toBeVisible();
  });

  test('should show grid items numbered in preview', async ({ page }) => {
    await expect(page.getByLabel('CSS Gridプレビュー').getByText('1')).toBeVisible();
  });

  test('should show Copy button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Copy/i })).toBeVisible();
  });

  test('should update CSS when column definition changes', async ({ page }) => {
    const columnInput = page.locator('input[type="text"]').first();
    await columnInput.fill('1fr 1fr 1fr');
    await columnInput.blur();
    const cssOutput = page.locator('pre').filter({ hasText: 'grid-template-columns' });
    await expect(cssOutput).toBeVisible();
    const text = await cssOutput.textContent();
    expect(text).toContain('1fr 1fr 1fr');
  });
});
