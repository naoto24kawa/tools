import { test, expect } from '@playwright/test';

test.describe('Geo Distance Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/geo-distance');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page).toHaveTitle(/Geo Distance/i);
    await expect(page.getByText('Geo Distance Calculator')).toBeVisible();
  });

  test('should show Point 1 and Point 2 input sections', async ({ page }) => {
    await expect(page.getByText('Point 1')).toBeVisible();
    await expect(page.getByText('Point 2')).toBeVisible();
  });

  test('should show latitude and longitude inputs for both points', async ({ page }) => {
    await expect(page.locator('#lat1')).toBeVisible();
    await expect(page.locator('#lng1')).toBeVisible();
    await expect(page.locator('#lat2')).toBeVisible();
    await expect(page.locator('#lng2')).toBeVisible();
  });

  test('should have Calculate Distance button disabled when fields are empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /calculate distance/i })).toBeDisabled();
  });

  test('should calculate distance between Tokyo and New York', async ({ page }) => {
    // Tokyo: 35.6762, 139.6503
    // New York: 40.7128, -74.0060
    await page.locator('#lat1').fill('35.6762');
    await page.locator('#lng1').fill('139.6503');
    await page.locator('#lat2').fill('40.7128');
    await page.locator('#lng2').fill('-74.0060');

    await page.getByRole('button', { name: /calculate distance/i }).click();

    await expect(page.getByText('Result').first()).toBeVisible();
    // Distance Tokyo - New York is approximately 10,838 km
    await expect(page.getByText(/km/).first()).toBeVisible();
    await expect(page.getByText(/mi/).first()).toBeVisible();
  });

  test('should show bearing information in result', async ({ page }) => {
    await page.locator('#lat1').fill('35.6762');
    await page.locator('#lng1').fill('139.6503');
    await page.locator('#lat2').fill('40.7128');
    await page.locator('#lng2').fill('-74.0060');

    await page.getByRole('button', { name: /calculate distance/i }).click();

    await expect(page.getByText(/Bearing/i).first()).toBeVisible();
    await expect(page.getByText(/°/).first()).toBeVisible();
  });

  test('should show distance in both km and miles', async ({ page }) => {
    await page.locator('#lat1').fill('0');
    await page.locator('#lng1').fill('0');
    await page.locator('#lat2').fill('0');
    await page.locator('#lng2').fill('1');

    await page.getByRole('button', { name: /calculate distance/i }).click();

    await expect(page.getByText(/Distance \(km\)/i)).toBeVisible();
    await expect(page.getByText(/Distance \(miles\)/i)).toBeVisible();
  });

  test('should clear inputs when Clear button is clicked', async ({ page }) => {
    await page.locator('#lat1').fill('35.6762');
    await page.locator('#lng1').fill('139.6503');
    await page.locator('#lat2').fill('40.7128');
    await page.locator('#lng2').fill('-74.0060');

    await page.getByRole('button', { name: /clear/i }).click();

    await expect(page.locator('#lat1')).toHaveValue('');
    await expect(page.locator('#lng1')).toHaveValue('');
  });

  test('should show error toast for invalid latitude', async ({ page }) => {
    await page.locator('#lat1').fill('200'); // Invalid: > 90
    await page.locator('#lng1').fill('0');
    await page.locator('#lat2').fill('0');
    await page.locator('#lng2').fill('0');

    await page.getByRole('button', { name: /calculate distance/i }).click();

    await expect(page.getByText(/invalid latitude/i).first()).toBeVisible();
  });

  test('should have Copy Result button after calculation', async ({ page }) => {
    await page.locator('#lat1').fill('0');
    await page.locator('#lng1').fill('0');
    await page.locator('#lat2').fill('0');
    await page.locator('#lng2').fill('1');

    await page.getByRole('button', { name: /calculate distance/i }).click();

    await expect(page.getByRole('button', { name: /copy result/i })).toBeVisible();
  });
});
