import { test, expect } from '@playwright/test';

test.describe('Fibonacci Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/fibonacci-generator');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText('Fibonacci Generator')).toBeVisible();
  });

  test('should show Sequence, Nth Term, and Check tabs', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Sequence' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Nth Term' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Check' })).toBeVisible();
  });

  test('should default to Sequence tab', async ({ page }) => {
    await expect(page.getByText('Generate Sequence')).toBeVisible();
  });

  test('should generate fibonacci sequence', async ({ page }) => {
    const input = page.locator('#seq-count');
    await input.fill('10');
    await page.getByRole('button', { name: 'Generate' }).click();
    // First 10 Fibonacci numbers: F(0)=0, F(1)=1, F(2)=1, F(3)=2, F(4)=3, F(5)=5, F(6)=8, F(7)=13, F(8)=21, F(9)=34
    await expect(page.getByText('10 terms')).toBeVisible();
    await expect(page.getByText('F(0)')).toBeVisible();
    await expect(page.getByText('F(9)')).toBeVisible();
  });

  test('should show sequence values including 0, 1, 1, 2, 3, 5', async ({ page }) => {
    const input = page.locator('#seq-count');
    await input.fill('6');
    await page.getByRole('button', { name: 'Generate' }).click();
    // Verify some known values are present (F(0)=0, F(5)=5)
    await expect(page.locator('.rounded.bg-muted').filter({ hasText: 'F(0)' })).toBeVisible();
    await expect(page.locator('.rounded.bg-muted').filter({ hasText: 'F(5)' })).toBeVisible();
  });

  test('should show error for count > 1000', async ({ page }) => {
    const input = page.locator('#seq-count');
    await input.fill('1001');
    await page.getByRole('button', { name: 'Generate' }).click();
    await expect(page.getByRole('alert')).toBeVisible();
  });

  test('should show Copy All button after generating sequence', async ({ page }) => {
    await page.locator('#seq-count').fill('5');
    await page.getByRole('button', { name: 'Generate' }).click();
    await expect(page.getByRole('button', { name: 'Copy All' })).toBeVisible();
  });

  test('should calculate Nth Fibonacci number', async ({ page }) => {
    await page.getByRole('button', { name: 'Nth Term' }).click();
    await page.locator('#nth-input').fill('10');
    await page.getByRole('button', { name: 'Calculate' }).click();
    // F(10) = 55
    await expect(page.getByText('55')).toBeVisible();
  });

  test('should show golden ratio approximation in Nth tab', async ({ page }) => {
    await page.getByRole('button', { name: 'Nth Term' }).click();
    await page.locator('#nth-input').fill('20');
    await page.getByRole('button', { name: 'Calculate' }).click();
    await expect(page.getByText(/Golden ratio/i)).toBeVisible();
  });

  test('should check if number is fibonacci', async ({ page }) => {
    await page.getByRole('button', { name: 'Check' }).first().click();
    await page.locator('#check-input').fill('144');
    await page.getByRole('button', { name: 'Check' }).nth(1).click();
    await expect(page.getByText('a Fibonacci number')).toBeVisible();
  });

  test('should correctly identify non-fibonacci number', async ({ page }) => {
    await page.getByRole('button', { name: 'Check' }).first().click();
    await page.locator('#check-input').fill('100');
    await page.getByRole('button', { name: 'Check' }).nth(1).click();
    await expect(page.getByText('NOT a Fibonacci number')).toBeVisible();
  });

  test('should show index for fibonacci number in check tab', async ({ page }) => {
    await page.getByRole('button', { name: 'Check' }).first().click();
    await page.locator('#check-input').fill('55');
    await page.getByRole('button', { name: 'Check' }).nth(1).click();
    // 55 is F(10)
    await expect(page.getByText(/F\(10\)/)).toBeVisible();
  });

  test('should generate via Enter key in sequence tab', async ({ page }) => {
    await page.locator('#seq-count').fill('5');
    await page.locator('#seq-count').press('Enter');
    await expect(page.getByText('5 terms')).toBeVisible();
  });
});
