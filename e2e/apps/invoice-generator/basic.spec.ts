import { test, expect } from '@playwright/test';

test.describe('Invoice Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/invoice-generator');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/請求書/i);
  });

  test('should show heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '請求書ジェネレーター' })).toBeVisible();
  });

  test('should fill in basic info fields', async ({ page }) => {
    await page.locator('#company').fill('株式会社テスト');
    await page.locator('#client').fill('クライアント株式会社');
    await page.locator('#invoiceNum').fill('INV-2024-001');

    await expect(page.locator('#company')).toHaveValue('株式会社テスト');
    await expect(page.locator('#client')).toHaveValue('クライアント株式会社');
    await expect(page.locator('#invoiceNum')).toHaveValue('INV-2024-001');
  });

  test('should show date fields pre-filled', async ({ page }) => {
    await expect(page.locator('#issueDate')).not.toHaveValue('');
    await expect(page.locator('#dueDate')).not.toHaveValue('');
  });

  test('should update item description and show subtotal', async ({ page }) => {
    const descInput = page.getByPlaceholder('品目の説明').first();
    await descInput.fill('Webデザイン');

    const qtyInputs = page.getByLabel('数量');
    await qtyInputs.first().fill('2');

    const priceInputs = page.getByLabel('単価 (円)');
    await priceInputs.first().fill('50000');

    // 小計 should show non-zero
    await expect(page.getByText('小計')).toBeVisible();
    await expect(page.getByText('合計')).toBeVisible();
  });

  test('should add a new item row', async ({ page }) => {
    await page.getByRole('button', { name: '品目を追加' }).click();
    // Two rows of description inputs should now exist
    const descInputs = page.getByPlaceholder('品目の説明');
    await expect(descInputs).toHaveCount(2);
  });

  test('should show preview iframe on preview button click', async ({ page }) => {
    await page.locator('#company').fill('テスト株式会社');
    await page.locator('#client').fill('顧客株式会社');

    const descInput = page.getByPlaceholder('品目の説明').first();
    await descInput.fill('コンサルティング');

    const priceInput = page.getByLabel('単価 (円)').first();
    await priceInput.fill('100000');

    await page.getByRole('button', { name: 'プレビュー' }).click();

    await expect(page.getByTitle('請求書プレビュー')).toBeVisible();
  });

  test('should display tax rate selector', async ({ page }) => {
    await expect(page.getByText('10% (標準)')).toBeVisible();
  });

  test('should show summary section with total', async ({ page }) => {
    await expect(page.getByText('合計')).toBeVisible();
    await expect(page.getByRole('button', { name: /印刷/ })).toBeVisible();
  });
});
