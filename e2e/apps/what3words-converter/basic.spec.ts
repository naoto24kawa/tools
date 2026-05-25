import { test, expect } from '@playwright/test';

test.describe('Grid Reference Converter (what3words-converter)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/what3words-converter');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText('Grid Reference Converter')).toBeVisible();
  });

  test('should show resolution selector', async ({ page }) => {
    // "Resolution" is a shadcn CardTitle (renders as div.text-2xl, not a heading element)
    await expect(page.locator('div.text-2xl', { hasText: 'Resolution' })).toBeVisible();
    await expect(page.getByText('Select grid cell size')).toBeVisible();
  });

  test('should show mode toggle buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: /lat\/lng.*grid/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /grid.*lat\/lng/i })).toBeVisible();
  });

  test('should default to Lat/Lng to Grid mode', async ({ page }) => {
    await expect(page.getByLabel('Latitude')).toBeVisible();
    await expect(page.getByLabel('Longitude')).toBeVisible();
  });

  test('should convert coordinates to grid cell', async ({ page }) => {
    await page.getByLabel('Latitude').fill('35.6895');
    await page.getByLabel('Longitude').fill('139.6917');
    await page.getByRole('button', { name: /convert to grid cell/i }).click();
    // Result should appear showing grid cell ID pattern R...C...
    await expect(page.locator('.font-mono').filter({ hasText: /^R\d+C\d+$/ })).toBeVisible({ timeout: 3000 });
  });

  test('should switch to Grid to Lat/Lng mode', async ({ page }) => {
    await page.getByRole('button', { name: /grid.*lat\/lng/i }).click();
    await expect(page.getByLabel('Grid Cell ID')).toBeVisible();
    await expect(page.getByRole('button', { name: /convert to lat\/lng/i })).toBeVisible();
  });

  test('should convert grid cell ID to coordinates', async ({ page }) => {
    await page.getByRole('button', { name: /grid.*lat\/lng/i }).click();
    await page.getByLabel('Grid Cell ID').fill('R1256C3196');
    await page.getByRole('button', { name: /convert to lat\/lng/i }).click();
    await expect(page.getByText(/lat:/i)).toBeVisible({ timeout: 3000 });
    await expect(page.getByText(/lng:/i)).toBeVisible({ timeout: 3000 });
  });

  test('should disable convert button when latitude or longitude is empty', async ({ page }) => {
    const convertBtn = page.getByRole('button', { name: /convert to grid cell/i });
    await expect(convertBtn).toBeDisabled();
  });

  test('should show total cells info', async ({ page }) => {
    await expect(page.getByText(/total cells:/i)).toBeVisible();
  });
});
