import { test, expect } from '@playwright/test';

test.describe('Math Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/math-calculator');
  });

  test('should load page', async ({ page }) => {
    await expect(page).toHaveTitle(/Calculator/i);
    await expect(page.getByRole('heading', { name: /Calculator/i }).first()).toBeVisible();
  });

  test('should show expression input and calculator buttons', async ({ page }) => {
    await expect(page.getByLabel('数式入力')).toBeVisible();
    await expect(page.getByRole('button', { name: '=' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'C' })).toBeVisible();
  });

  test('should calculate 2 + 3 = 5', async ({ page }) => {
    const input = page.getByLabel('数式入力');
    await input.fill('2+3');
    await expect(page.getByText('= 5')).toBeVisible();
  });

  test('should calculate 10 * 5 = 50', async ({ page }) => {
    const input = page.getByLabel('数式入力');
    await input.fill('10*5');
    await expect(page.getByText('= 50')).toBeVisible();
  });

  test('should calculate 100 / 4 = 25', async ({ page }) => {
    const input = page.getByLabel('数式入力');
    await input.fill('100/4');
    await expect(page.getByText('= 25')).toBeVisible();
  });

  test('should calculate 2^10 = 1024', async ({ page }) => {
    const input = page.getByLabel('数式入力');
    await input.fill('2^10');
    await expect(page.getByText('= 1024')).toBeVisible();
  });

  test('should handle expression via buttons', async ({ page }) => {
    await page.getByRole('button', { name: '2' }).click();
    await page.getByRole('button', { name: '+' }).click();
    await page.getByRole('button', { name: '3' }).click();
    await expect(page.getByLabel('数式入力')).toHaveValue('2+3');
  });

  test('should clear expression when C button is clicked', async ({ page }) => {
    const input = page.getByLabel('数式入力');
    await input.fill('2+3');
    await page.getByRole('button', { name: 'C' }).click();
    await expect(input).toHaveValue('');
  });

  test('should add to history when = button is clicked', async ({ page }) => {
    const input = page.getByLabel('数式入力');
    await input.fill('5+5');
    await page.getByRole('button', { name: '=' }).click();
    await expect(page.getByText('5+5 = 10')).toBeVisible();
  });

  test('should show error for invalid expression', async ({ page }) => {
    const input = page.getByLabel('数式入力');
    await input.fill('2++3');
    await expect(page.getByRole('alert')).toBeVisible();
  });
});
