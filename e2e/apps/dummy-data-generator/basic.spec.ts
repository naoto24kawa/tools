import { test, expect } from '@playwright/test';

test.describe('Dummy Data Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dummy-data-generator');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText('Dummy Data Generator')).toBeVisible();
  });

  test('should generate JSON output by default', async ({ page }) => {
    await page.getByRole('button', { name: /generate data/i }).click();
    const output = page.locator('textarea[readonly]');
    await expect(output).not.toBeEmpty();
    const content = await output.inputValue();
    // Should be valid JSON starting with [
    expect(content.trim()).toMatch(/^\[/);
  });

  test('should generate 10 rows by default', async ({ page }) => {
    await page.getByRole('button', { name: /generate data/i }).click();
    const output = page.locator('textarea[readonly]');
    const content = await output.inputValue();
    const parsed = JSON.parse(content);
    expect(parsed).toHaveLength(10);
  });

  test('should generate CSV when format is switched', async ({ page }) => {
    // Switch to CSV format
    await page.locator('#output-format').click();
    await page.getByRole('option', { name: 'CSV' }).click();
    await page.getByRole('button', { name: /generate data/i }).click();
    const output = page.locator('textarea[readonly]');
    const content = await output.inputValue();
    // CSV should have commas and newlines
    expect(content).toContain(',');
  });

  test('should show copy and download buttons after generation', async ({ page }) => {
    await page.getByRole('button', { name: /generate data/i }).click();
    await expect(page.getByRole('button', { name: /copy/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /download/i })).toBeVisible();
  });

  test('should add new field when Add Field button clicked', async ({ page }) => {
    const initialFields = await page.locator('[id^="field-name-"]').count();
    await page.getByRole('button', { name: /add field/i }).click();
    const updatedFields = await page.locator('[id^="field-name-"]').count();
    expect(updatedFields).toBe(initialFields + 1);
  });

  test('should show default fields (id, name, email)', async ({ page }) => {
    await expect(page.locator('[value="id"]')).toBeVisible();
    await expect(page.locator('[value="name"]')).toBeVisible();
    await expect(page.locator('[value="email"]')).toBeVisible();
  });
});
