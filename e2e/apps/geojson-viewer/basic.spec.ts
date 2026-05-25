import { test, expect } from '@playwright/test';

test.describe('GeoJSON Viewer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/geojson-viewer');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page).toHaveTitle(/GeoJSON Viewer/i);
    await expect(page.getByText('GeoJSON Viewer')).toBeVisible();
  });

  test('should show GeoJSON input textarea', async ({ page }) => {
    await expect(page.getByText('GeoJSON Input')).toBeVisible();
    await expect(page.getByPlaceholder(/FeatureCollection/i)).toBeVisible();
  });

  test('should show Render, Load Sample, and Clear buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: /render/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /load sample/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /clear/i })).toBeVisible();
  });

  test('should show Render button disabled when input is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /render/i })).toBeDisabled();
  });

  test('should show Map View section', async ({ page }) => {
    await expect(page.getByText('Map View')).toBeVisible();
    await expect(page.locator('canvas')).toBeVisible();
  });

  test('should load sample GeoJSON and render it', async ({ page }) => {
    await page.getByRole('button', { name: /load sample/i }).click();

    // Sample has 3 features (Tokyo Point, Tokyo Area Polygon, Route LineString)
    await expect(page.getByText(/3 feature\(s\) rendered/i)).toBeVisible();
  });

  test('should show feature count after rendering', async ({ page }) => {
    const geojson = JSON.stringify({
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [0, 0] },
          properties: { name: 'Origin' },
        },
      ],
    });

    await page.getByPlaceholder(/FeatureCollection/i).fill(geojson);
    await page.getByRole('button', { name: /render/i }).click();

    await expect(page.getByText(/1 feature\(s\) rendered/i)).toBeVisible();
  });

  test('should show legend for Point, LineString, Polygon', async ({ page }) => {
    await expect(page.getByText('Point')).toBeVisible();
    await expect(page.getByText('LineString')).toBeVisible();
    await expect(page.getByText('Polygon')).toBeVisible();
  });

  test('should show parse error toast for invalid GeoJSON', async ({ page }) => {
    await page.getByPlaceholder(/FeatureCollection/i).fill('{ invalid json }');
    await page.getByRole('button', { name: /render/i }).click();

    await expect(page.getByText(/parse error/i)).toBeVisible();
  });

  test('should clear canvas and input when Clear is clicked', async ({ page }) => {
    await page.getByRole('button', { name: /load sample/i }).click();
    await expect(page.getByText(/3 feature\(s\) rendered/i)).toBeVisible();

    await page.getByRole('button', { name: /clear/i }).click();

    await expect(page.getByText(/No data rendered yet/i)).toBeVisible();
  });
});
