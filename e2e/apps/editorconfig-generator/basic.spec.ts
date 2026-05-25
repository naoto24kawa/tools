import { test, expect } from '@playwright/test';

test.describe('EditorConfig Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/editorconfig-generator');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText('EditorConfig Generator')).toBeVisible();
  });

  test('should show presets section', async ({ page }) => {
    await expect(page.getByText('Presets')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Default' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Google' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Airbnb' })).toBeVisible();
  });

  test('should show generated editorconfig preview', async ({ page }) => {
    const preview = page.locator('pre');
    await expect(preview).toContainText('root = true');
  });

  test('should show global settings section', async ({ page }) => {
    await expect(page.getByText('Global Settings')).toBeVisible();
    await expect(page.locator('#root')).toBeVisible();
    await expect(page.locator('#charset')).toBeVisible();
    await expect(page.locator('#eol')).toBeVisible();
  });

  test('should apply Default preset', async ({ page }) => {
    await page.getByRole('button', { name: 'Default' }).click();
    await expect(page.getByText('Applied default preset')).toBeVisible();
    const preview = page.locator('pre');
    await expect(preview).toContainText('[*]');
  });

  test('should apply Google preset', async ({ page }) => {
    await page.getByRole('button', { name: 'Google' }).click();
    await expect(page.getByText('Applied google preset')).toBeVisible();
  });

  test('should apply Airbnb preset', async ({ page }) => {
    await page.getByRole('button', { name: 'Airbnb' }).click();
    await expect(page.getByText('Applied airbnb preset')).toBeVisible();
  });

  test('should add a new section when Add Section is clicked', async ({ page }) => {
    await page.getByRole('button', { name: /Add Section/i }).click();
    // Should now have multiple extension sections
    const sections = page.locator('text=Section [');
    await expect(sections).toHaveCount(2);
  });

  test('should show Copy button in preview', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Copy/i })).toBeVisible();
  });

  test('should include charset in generated output', async ({ page }) => {
    const preview = page.locator('pre');
    await expect(preview).toContainText('charset');
  });

  test('should include indent settings in generated output', async ({ page }) => {
    const preview = page.locator('pre');
    await expect(preview).toContainText('indent_style');
    await expect(preview).toContainText('indent_size');
  });

  test('should update preview when root checkbox is toggled', async ({ page }) => {
    // Uncheck root
    await page.locator('#root').uncheck();
    const preview = page.locator('pre');
    const text = await preview.textContent();
    expect(text).not.toContain('root = true');
  });
});
