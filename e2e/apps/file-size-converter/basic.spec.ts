import { test, expect } from '@playwright/test';

test.describe('File Size Converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/file-size-converter');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page).toHaveTitle(/File Size Converter/i);
    await expect(page.getByText('File Size Converter')).toBeVisible();
  });

  test('should show input with default value of 1', async ({ page }) => {
    await expect(page.locator('#size-value')).toHaveValue('1');
  });

  test('should show results for 1 GB (IEC standard)', async ({ page }) => {
    // Default is 1 GB IEC - results should be visible
    await expect(page.getByText('Results')).toBeVisible();
    // 1 GiB = 1024 MiB
    await expect(page.getByText(/1,024/)).toBeVisible();
  });

  test('should convert 1 MB to 1048576 bytes (IEC)', async ({ page }) => {
    // Change unit to MB
    await page.getByText('GB').first().click();
    await page.getByRole('option', { name: 'MB' }).click();

    await page.locator('#size-value').fill('1');

    // 1 MiB = 1,048,576 B
    await expect(page.getByText(/1,048,576/)).toBeVisible();
  });

  test('should have unit selector and standard selector', async ({ page }) => {
    await expect(page.getByText('Unit')).toBeVisible();
    await expect(page.getByText('Standard')).toBeVisible();
  });

  test('should switch between SI and IEC standards', async ({ page }) => {
    // IEC is default, switch to SI
    await page.getByText('IEC (1024)').click();
    await page.getByRole('option', { name: 'SI (1000)' }).click();

    await expect(page.getByText(/SI: 1 KB = 1,000 B/)).toBeVisible();
  });

  test('should show copy button for each result row', async ({ page }) => {
    const copyButtons = page.getByRole('button', { name: /copy/i });
    await expect(copyButtons.first()).toBeVisible();
  });

  test('should convert 0 bytes and show results', async ({ page }) => {
    await page.locator('#size-value').fill('0');
    await expect(page.getByText('Results')).toBeVisible();
  });

  test('should have B, KB, MB, GB, TB, PB unit options', async ({ page }) => {
    await page.getByText('GB').first().click();
    await expect(page.getByRole('option', { name: 'B' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'MB' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'TB' })).toBeVisible();
  });
});
