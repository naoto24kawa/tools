import { test, expect } from '@playwright/test';

test.describe('Chart Builder', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/chart-builder');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Chart Builder/i);
  });

  test('should display main heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Chart Builder' })).toBeVisible();
  });

  test('should show settings panel with chart type selector', async ({ page }) => {
    await expect(page.getByText('Chart Type')).toBeVisible();
    await expect(page.getByText('Settings')).toBeVisible();
  });

  test('should render canvas with default bar chart', async ({ page }) => {
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
    await expect(page.getByText('7 data points')).toBeVisible();
  });

  test('should show sample data in textarea', async ({ page }) => {
    const textarea = page.locator('textarea');
    await expect(textarea).toBeVisible();
    await expect(textarea).toContainText('January');
  });

  test('should show title input', async ({ page }) => {
    await expect(page.getByText('Title').first()).toBeVisible();
    const titleInput = page.locator('input').filter({ hasText: '' }).nth(0);
    await expect(page.locator('input[value="My Chart"]')).toBeVisible();
  });

  test('should switch to line chart', async ({ page }) => {
    await page.getByRole('combobox').first().click();
    await page.getByRole('option', { name: 'Line Chart' }).click();
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
  });

  test('should switch to pie chart', async ({ page }) => {
    await page.getByRole('combobox').first().click();
    await page.getByRole('option', { name: 'Pie Chart' }).click();
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
    // Pie chart hides axis labels
    await expect(page.getByText('X Axis Label')).not.toBeVisible();
  });

  test('should update chart title', async ({ page }) => {
    await page.locator('input[value="My Chart"]').fill('Sales Report');
    // Canvas should still be visible
    await expect(page.locator('canvas')).toBeVisible();
  });

  test('should update data and show correct data points count', async ({ page }) => {
    const textarea = page.locator('textarea');
    await textarea.fill('Red, 10\nBlue, 20\nGreen, 30');
    await expect(page.getByText('3 data points')).toBeVisible();
  });

  test('should show X and Y axis label inputs for bar chart', async ({ page }) => {
    await expect(page.getByText('X Axis Label')).toBeVisible();
    await expect(page.getByText('Y Axis Label')).toBeVisible();
  });

  test('should show Download PNG button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Download PNG/i })).toBeVisible();
  });

  test('should show Preview section', async ({ page }) => {
    await expect(page.getByText('Preview')).toBeVisible();
  });
});
