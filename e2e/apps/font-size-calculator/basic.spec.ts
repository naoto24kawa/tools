import { test, expect } from '@playwright/test';

test.describe('Font Size Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/font-size-calculator');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page).toHaveTitle(/Font Size Calculator/i);
    await expect(page.getByText('Font Size Calculator')).toBeVisible();
  });

  test('should show Convert section with inputs', async ({ page }) => {
    await expect(page.getByText('Convert')).toBeVisible();
    await expect(page.locator('#value')).toBeVisible();
    await expect(page.locator('#unit')).toBeVisible();
    await expect(page.locator('#basePx')).toBeVisible();
  });

  test('should show default value of 16px', async ({ page }) => {
    await expect(page.locator('#value')).toHaveValue('16');
    await expect(page.locator('#basePx')).toHaveValue('16');
  });

  test('should show Result section with converted values', async ({ page }) => {
    await expect(page.getByText('Result')).toBeVisible();
    // 16px = 1rem at base 16
    await expect(page.getByText(/16 px/)).toBeVisible();
    await expect(page.getByText(/1 rem/)).toBeVisible();
    await expect(page.getByText(/1 em/)).toBeVisible();
  });

  test('should convert 32px to 2rem', async ({ page }) => {
    await page.locator('#value').fill('32');

    await expect(page.getByText(/32 px/)).toBeVisible();
    await expect(page.getByText(/2 rem/)).toBeVisible();
  });

  test('should convert 1.5rem to px with base 16', async ({ page }) => {
    await page.locator('#unit').selectOption('rem');
    await page.locator('#value').fill('1.5');

    await expect(page.getByText(/24 px/)).toBeVisible();
  });

  test('should show WCAG minimum size indicator', async ({ page }) => {
    // 16px passes WCAG minimum size
    await expect(page.getByText(/wcag/i)).toBeVisible();
  });

  test('should show preview text at selected font size', async ({ page }) => {
    await expect(page.getByText(/The quick brown fox.*at.*px/)).toBeVisible();
  });

  test('should show Conversion Table', async ({ page }) => {
    await expect(page.getByText('Conversion Table')).toBeVisible();
    // Table should have px, rem, em, pt headers
    await expect(page.locator('th', { hasText: 'px' })).toBeVisible();
    await expect(page.locator('th', { hasText: 'rem' })).toBeVisible();
    await expect(page.locator('th', { hasText: 'em' })).toBeVisible();
    await expect(page.locator('th', { hasText: 'pt' })).toBeVisible();
  });

  test('should show Modular Scale section', async ({ page }) => {
    await expect(page.getByText('Modular Scale')).toBeVisible();
  });

  test('should change modular scale ratio', async ({ page }) => {
    // Major Third ratio button
    await page.getByRole('button', { name: /major third/i }).click();
    await expect(page.getByRole('button', { name: /major third/i })).toHaveClass(/bg-/);
  });
});
