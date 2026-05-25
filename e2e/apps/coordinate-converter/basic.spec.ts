import { test, expect } from '@playwright/test';

test.describe('Coordinate Converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/coordinate-converter');
  });

  test('should load page with heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /coordinate converter/i })).toBeVisible();
  });

  test('should default to Decimal to DMS mode', async ({ page }) => {
    await expect(page.getByRole('button', { name: /decimal.*dms/i })).toBeVisible();
    await expect(page.getByLabel('Latitude (decimal)')).toBeVisible();
    await expect(page.getByLabel('Longitude (decimal)')).toBeVisible();
  });

  test('should convert decimal degrees to DMS', async ({ page }) => {
    await page.getByLabel('Latitude (decimal)').fill('35.6762');
    await page.getByLabel('Longitude (decimal)').fill('139.6503');
    await page.getByRole('button', { name: /convert/i }).click();
    // Result should show degrees symbol or DMS notation
    await expect(page.getByText(/lat:/i)).toBeVisible();
    await expect(page.getByText(/lng:/i)).toBeVisible();
  });

  test('should switch to DMS to Decimal mode', async ({ page }) => {
    await page.getByRole('button', { name: /dms.*decimal/i }).click();
    // DMS mode shows Deg/Min/Sec inputs
    await expect(page.getByPlaceholder('Deg').first()).toBeVisible();
    await expect(page.getByPlaceholder('Min').first()).toBeVisible();
    await expect(page.getByPlaceholder('Sec').first()).toBeVisible();
  });

  test('should convert DMS to decimal degrees', async ({ page }) => {
    await page.getByRole('button', { name: /dms.*decimal/i }).click();
    // Tokyo: 35°40'34"N, 139°41'22"E
    const degInputs = page.getByPlaceholder('Deg');
    const minInputs = page.getByPlaceholder('Min');
    const secInputs = page.getByPlaceholder('Sec');
    await degInputs.first().fill('35');
    await minInputs.first().fill('40');
    await secInputs.first().fill('34');
    await degInputs.nth(1).fill('139');
    await minInputs.nth(1).fill('41');
    await secInputs.nth(1).fill('22');
    await page.getByRole('button', { name: /convert/i }).click();
    // Should produce decimal result with 6 decimal places
    await expect(page.getByText(/lat:.*35\./i)).toBeVisible();
    await expect(page.getByText(/lng:.*139\./i)).toBeVisible();
  });

  test('should show copy button after conversion', async ({ page }) => {
    await page.getByLabel('Latitude (decimal)').fill('35.6762');
    await page.getByLabel('Longitude (decimal)').fill('139.6503');
    await page.getByRole('button', { name: /convert/i }).click();
    await expect(page.getByRole('button', { name: /copy/i })).toBeVisible();
  });

  test('should show error for invalid latitude', async ({ page }) => {
    await page.getByLabel('Latitude (decimal)').fill('91');
    await page.getByLabel('Longitude (decimal)').fill('139.6503');
    await page.getByRole('button', { name: /convert/i }).click();
    await expect(page.getByText(/invalid latitude/i)).toBeVisible();
  });
});
