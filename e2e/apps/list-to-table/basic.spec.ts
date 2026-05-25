import { test, expect } from '@playwright/test';

test.describe('List to Table', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/list-to-table');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/List to Table/i);
  });

  test('should show heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'List to Table' })).toBeVisible();
  });

  test('should pre-populate sample data', async ({ page }) => {
    const textarea = page.getByLabel('Input data');
    await expect(textarea).toHaveValue(/Name,Age,City/);
  });

  test('should show table preview for sample CSV data', async ({ page }) => {
    // Preview table should render automatically
    await expect(page.getByText('Preview')).toBeVisible();
    await expect(page.getByRole('table')).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Name' })).toBeVisible();
  });

  test('should output Markdown table by default', async ({ page }) => {
    const pre = page.locator('pre');
    await expect(pre).toContainText('|');
    await expect(pre).toContainText('Name');
  });

  test('should switch output to HTML format', async ({ page }) => {
    // Change format to HTML
    await page.getByText('Markdown Table').click();
    await page.getByRole('option', { name: 'HTML Table' }).click();

    const pre = page.locator('pre');
    await expect(pre).toContainText('<table');
    await expect(pre).toContainText('<th>');
  });

  test('should switch output to CSV format', async ({ page }) => {
    await page.getByText('Markdown Table').click();
    await page.getByRole('option', { name: 'CSV' }).click();

    const pre = page.locator('pre');
    await expect(pre).toContainText('Name,Age,City');
  });

  test('should handle custom input with comma delimiter', async ({ page }) => {
    const textarea = page.getByLabel('Input data');
    await textarea.fill('Product,Price\nApple,100\nBanana,80');

    await expect(page.getByRole('columnheader', { name: 'Product' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Apple' })).toBeVisible();
  });

  test('should toggle first-row-as-header checkbox', async ({ page }) => {
    const checkbox = page.getByRole('checkbox', { name: /First row is header/i });
    await expect(checkbox).toBeChecked();

    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();
    // Column headers should disappear from thead
    await expect(page.getByRole('columnheader', { name: 'Name' })).not.toBeVisible();
  });

  test('should show copy and download buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Copy/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Download/ })).toBeVisible();
  });
});
