import { test, expect } from '@playwright/test';

test.describe('Pattern Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pattern-generator');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText(/Pattern Generator/i)).toBeVisible();
  });

  test('should show pattern preview area on initial load', async ({ page }) => {
    // The preview div has a fixed height and is rendered via inline style
    const preview = page.locator('.h-64');
    await expect(preview).toBeVisible();
  });

  test('should show CSS output by default', async ({ page }) => {
    const pre = page.locator('pre');
    await expect(pre).toBeVisible();
    const text = await pre.textContent();
    expect(text).toContain('background');
  });

  test('should switch to SVG output mode', async ({ page }) => {
    await page.getByRole('button', { name: /^SVG$/i }).click();
    const pre = page.locator('pre');
    const text = await pre.textContent();
    expect(text).toContain('<svg');
  });

  test('should switch back to CSS output mode', async ({ page }) => {
    await page.getByRole('button', { name: /^SVG$/i }).click();
    await page.getByRole('button', { name: /^CSS$/i }).click();
    const pre = page.locator('pre');
    const text = await pre.textContent();
    expect(text).toContain('background');
  });

  test('should change pattern type to Dots', async ({ page }) => {
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /Dots/i }).click();
    // Output should update
    const pre = page.locator('pre');
    await expect(pre).toBeVisible();
    const text = await pre.textContent();
    expect(text!.length).toBeGreaterThan(0);
  });

  test('should change pattern type to Checkers', async ({ page }) => {
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /Checkers/i }).click();
    const pre = page.locator('pre');
    await expect(pre).toBeVisible();
  });

  test('should show size slider', async ({ page }) => {
    await expect(page.getByText(/Size:/i)).toBeVisible();
  });

  test('should show angle slider', async ({ page }) => {
    await expect(page.getByText(/Angle:/i)).toBeVisible();
  });

  test('should show Copy button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Copy/i })).toBeVisible();
  });

  test('should update preview when color 1 is changed via text input', async ({ page }) => {
    const color1Inputs = page.getByRole('textbox').filter({ hasText: '' });
    // First textbox is color1 hex input
    const hexInput = color1Inputs.first();
    await hexInput.fill('#ff0000');
    // Preview div should still render without error
    await expect(page.locator('.h-64')).toBeVisible();
  });
});
