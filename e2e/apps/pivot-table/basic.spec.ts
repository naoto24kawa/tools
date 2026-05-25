import { test, expect } from '@playwright/test';

test.describe('Pivot Table', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pivot-table');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Pivot Table' })).toBeVisible();
  });

  test('should display pivot result from sample CSV data', async ({ page }) => {
    // Sample data is pre-loaded; pivot table should render immediately
    await expect(page.getByText('Pivot Result')).toBeVisible();
    const table = page.locator('table');
    await expect(table).toBeVisible();
  });

  test('should render row and column headers from CSV', async ({ page }) => {
    // Default sample has Region as row, Product as column
    await expect(page.getByText('East')).toBeVisible();
    await expect(page.getByText('West')).toBeVisible();
    await expect(page.getByText('Widget')).toBeVisible();
    await expect(page.getByText('Gadget')).toBeVisible();
  });

  test('should show grand total row in pivot output', async ({ page }) => {
    // Total row and column should appear
    const totalCells = page.getByRole('cell', { name: 'Total' });
    await expect(totalCells.first()).toBeVisible();
  });

  test('should update pivot when CSV data is changed', async ({ page }) => {
    const textarea = page.getByLabel('CSV data input');
    await textarea.fill('Category,Item,Amount\nFood,Apple,10\nFood,Banana,20\nDrink,Water,5');
    // New row labels should appear
    await expect(page.getByText('Food')).toBeVisible();
    await expect(page.getByText('Drink')).toBeVisible();
  });

  test('should show row count and column count in description', async ({ page }) => {
    // Description shows "N rows x M columns"
    await expect(page.getByText(/rows x/i)).toBeVisible();
  });

  test('should have Copy Table button', async ({ page }) => {
    const copyBtn = page.getByRole('button', { name: /Copy Table/i });
    await expect(copyBtn).toBeVisible();
    await expect(copyBtn).not.toBeDisabled();
  });
});
