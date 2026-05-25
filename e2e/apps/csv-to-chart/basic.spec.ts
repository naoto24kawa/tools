import { test, expect } from '@playwright/test';

test.describe('CSV to Chart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/csv-to-chart');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText(/CSV to Chart/i)).toBeVisible();
  });

  test('should show placeholder message when no CSV is entered', async ({ page }) => {
    await expect(page.getByText(/CSVを入力するとチャートが表示されます/i)).toBeVisible();
  });

  test('should render bar chart rows after entering CSV data', async ({ page }) => {
    const textarea = page.locator('textarea#csv-input');
    await textarea.fill('Month,Sales\nJan,100\nFeb,150\nMar,200');
    // Row labels should appear in chart
    const chart = page.locator('main .grid > div').nth(1);
    await expect(chart.getByText('Jan')).toBeVisible();
    await expect(chart.getByText('Feb')).toBeVisible();
    await expect(chart.getByText('Mar')).toBeVisible();
  });

  test('should show dataset legend labels', async ({ page }) => {
    const textarea = page.locator('textarea#csv-input');
    await textarea.fill('Month,Sales,Profit\nJan,100,30\nFeb,150,45');
    const chart = page.locator('main .grid > div').nth(1);
    await expect(chart.getByText('Sales')).toBeVisible();
    await expect(chart.getByText('Profit')).toBeVisible();
  });

  test('should display bar values in chart', async ({ page }) => {
    const textarea = page.locator('textarea#csv-input');
    await textarea.fill('Item,Value\nA,42\nB,87');
    const chart = page.locator('main .grid > div').nth(1);
    await expect(chart.getByText('42')).toBeVisible();
    await expect(chart.getByText('87')).toBeVisible();
  });

  test('should clear chart when CSV input is cleared', async ({ page }) => {
    const textarea = page.locator('textarea#csv-input');
    await textarea.fill('Month,Sales\nJan,100');
    const chart = page.locator('main .grid > div').nth(1);
    await expect(chart.getByText('Jan')).toBeVisible();
    await textarea.fill('');
    await expect(page.getByText(/CSVを入力するとチャートが表示されます/i)).toBeVisible();
  });

  test('should update chart in real-time as CSV changes', async ({ page }) => {
    const textarea = page.locator('textarea#csv-input');
    await textarea.fill('Label,Score\nAlpha,50');
    const chart = page.locator('main .grid > div').nth(1);
    await expect(chart.getByText('Alpha')).toBeVisible();
    await expect(chart.getByText('50')).toBeVisible();
    await textarea.fill('Label,Score\nBeta,75');
    await expect(chart.getByText('Beta')).toBeVisible();
    await expect(chart.getByText('75')).toBeVisible();
  });

  test('should handle multiple datasets correctly', async ({ page }) => {
    const textarea = page.locator('textarea#csv-input');
    await textarea.fill('Q,Rev,Cost,Profit\nQ1,100,60,40\nQ2,120,70,50');
    const chart = page.locator('main .grid > div').nth(1);
    await expect(chart.getByText('Q1')).toBeVisible();
    await expect(chart.getByText('Q2')).toBeVisible();
    await expect(chart.getByText('Rev')).toBeVisible();
    await expect(chart.getByText('Cost')).toBeVisible();
  });
});
