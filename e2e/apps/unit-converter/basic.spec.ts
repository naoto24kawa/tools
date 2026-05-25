import { test, expect } from '@playwright/test';

test.describe('Unit Converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/unit-converter');
  });

  test('should load page', async ({ page }) => {
    await expect(page).toHaveTitle(/Unit Converter/i);
    await expect(page.getByRole('heading', { name: /Unit Converter/i })).toBeVisible();
  });

  test('should show category buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: '長さ' })).toBeVisible();
    await expect(page.getByRole('button', { name: '重さ' })).toBeVisible();
  });

  test('should show value, from and to unit selectors', async ({ page }) => {
    await expect(page.getByLabel('値')).toBeVisible();
    await expect(page.getByLabel('変換元')).toBeVisible();
    await expect(page.getByLabel('変換先')).toBeVisible();
  });

  test('should convert 1 meter to centimeters = 100', async ({ page }) => {
    // Length category is default; default from=mm, to=cm — change to m -> cm
    await page.getByLabel('変換元').selectOption('m');
    await page.getByLabel('変換先').selectOption('cm');
    await page.getByLabel('値').fill('1');
    // Result appears in the large display div
    await expect(page.locator('div.text-3xl.font-bold.font-mono')).toContainText('100');
  });

  test('should convert 1 km to meters = 1000', async ({ page }) => {
    await page.getByLabel('変換元').selectOption('km');
    await page.getByLabel('変換先').selectOption('m');
    await page.getByLabel('値').fill('1');
    // Result appears in the large display div
    await expect(page.locator('div.text-3xl.font-bold.font-mono')).toContainText('1,000');
  });

  test('should show all units display after conversion', async ({ page }) => {
    await page.getByLabel('変換元').selectOption('m');
    await page.getByLabel('値').fill('1');
    await expect(page.getByText('全単位表示')).toBeVisible();
  });

  test('should switch to weight category', async ({ page }) => {
    await page.getByRole('button', { name: '重さ' }).click();
    await expect(page.getByText(/重さ変換/)).toBeVisible();
  });
});
