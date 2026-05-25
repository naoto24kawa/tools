import { test, expect } from '@playwright/test';

test.describe('Flexbox Playground', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/css-flexbox');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Flexbox/i);
  });

  test('should display flexbox preview area', async ({ page }) => {
    await expect(page.getByLabel('Flexboxプレビュー')).toBeVisible();
  });

  test('should show display: flex in CSS output', async ({ page }) => {
    await expect(page.getByText(/display: flex/)).toBeVisible();
  });

  test('should display Properties section', async ({ page }) => {
    await expect(page.getByText('Properties')).toBeVisible();
  });

  test('should show flex direction option buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'row', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'column', exact: true })).toBeVisible();
  });

  test('should show justify-content option buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'flex-start' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'center' }).first()).toBeVisible();
  });

  test('should display gap slider', async ({ page }) => {
    await expect(page.getByLabel('gap')).toBeVisible();
  });

  test('should display Items count slider', async ({ page }) => {
    await expect(page.getByLabel('アイテム数')).toBeVisible();
  });

  test('should show flex items numbered in preview', async ({ page }) => {
    await expect(page.getByLabel('Flexboxプレビュー').getByText('1')).toBeVisible();
  });

  test('should show Copy button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Copy/i })).toBeVisible();
  });

  test('should update preview when direction changes to column', async ({ page }) => {
    await page.getByRole('button', { name: 'column', exact: true }).click();
    const cssOutput = page.locator('pre').filter({ hasText: 'flex-direction' });
    await expect(cssOutput).toBeVisible();
    const text = await cssOutput.textContent();
    expect(text).toContain('column');
  });
});
