import { test, expect } from '@playwright/test';

test.describe('Tip Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tip-calculator');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /チップ.*割り勘/i })).toBeVisible();
  });

  test('should show bill amount input', async ({ page }) => {
    await expect(page.locator('input#bill')).toBeVisible();
  });

  test('should show tip rate preset buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: '10%' })).toBeVisible();
    await expect(page.getByRole('button', { name: '15%' })).toBeVisible();
    await expect(page.getByRole('button', { name: '20%' })).toBeVisible();
  });

  test('should show number of people input', async ({ page }) => {
    await expect(page.locator('input#people')).toBeVisible();
  });

  test('should not show result when bill amount is empty', async ({ page }) => {
    await expect(page.getByText('結果')).not.toBeVisible();
  });

  test('should calculate tip with 15% preset', async ({ page }) => {
    await page.locator('input#bill').fill('10000');
    // 15% button should be selected by default
    await expect(page.getByRole('button', { name: '15%' })).toBeVisible();
    // Result section should appear
    await expect(page.getByText('結果')).toBeVisible();
    // Tip amount: 10000 * 0.15 = 1500
    await expect(page.getByText(/¥1,500/)).toBeVisible();
    // Total: 10000 + 1500 = 11500
    await expect(page.getByText(/¥11,500/)).toBeVisible();
  });

  test('should calculate tip with custom tip rate', async ({ page }) => {
    await page.locator('input#bill').fill('5000');
    await page.getByRole('button', { name: 'カスタム' }).click();
    await page.locator('input[type="number"][min="0"][step="1"]').fill('20');
    // 20% of 5000 = 1000
    await expect(page.getByText(/¥1,000/)).toBeVisible();
  });

  test('should split bill when number of people is more than 1', async ({ page }) => {
    await page.locator('input#bill').fill('10000');
    await page.locator('input#people').fill('4');
    await expect(page.getByText('結果')).toBeVisible();
    // Should show per person amount
    await expect(page.getByText(/1人あたり.*4人/)).toBeVisible();
  });

  test('should show tip rate comparison table', async ({ page }) => {
    await page.locator('input#bill').fill('10000');
    await expect(page.getByText('チップ率比較')).toBeVisible();
    // Table headers
    await expect(page.getByText('チップ率')).toBeVisible();
    await expect(page.getByText('チップ額')).toBeVisible();
    await expect(page.getByText('合計')).toBeVisible();
  });

  test('should highlight selected tip rate in comparison table', async ({ page }) => {
    await page.locator('input#bill').fill('10000');
    // 15% is default - the row should be highlighted
    const highlightedRow = page.locator('tr.bg-muted\\/50');
    await expect(highlightedRow).toBeVisible();
    await expect(highlightedRow).toContainText('15%');
  });

  test('should show copy button in result section', async ({ page }) => {
    await page.locator('input#bill').fill('10000');
    await expect(page.getByRole('button', { name: /コピー/i })).toBeVisible();
  });
});
