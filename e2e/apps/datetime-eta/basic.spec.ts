import { test, expect } from '@playwright/test';

test.describe('ETA Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/datetime-eta');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /ETA Calculator/i })).toBeVisible();
  });

  test('should calculate ETA with default values (100km at 60km/h = 1h40m)', async ({ page }) => {
    // Default: distance=100, speed=60 → 1h40m
    await expect(page.getByText('所要時間')).toBeVisible();
    await expect(page.getByText('到着予定')).toBeVisible();
    // 100/60 ≈ 1h 40m
    await expect(page.getByText(/1時間40分|1h 40m/i)).toBeVisible();
  });

  test('should calculate ETA for 60km at 60km/h = exactly 1 hour', async ({ page }) => {
    const distanceInput = page.locator('#eta-distance');
    const speedInput = page.locator('#eta-speed');
    await distanceInput.fill('60');
    await speedInput.fill('60');
    await expect(page.getByText(/1時間0分|1h 0m/i)).toBeVisible();
  });

  test('should calculate ETA for 120km at 60km/h = 2 hours', async ({ page }) => {
    const distanceInput = page.locator('#eta-distance');
    const speedInput = page.locator('#eta-speed');
    await distanceInput.fill('120');
    await speedInput.fill('60');
    await expect(page.getByText(/2時間0分|2h 0m/i)).toBeVisible();
  });

  test('should show arrival time in locale format', async ({ page }) => {
    // Should show a time like "HH:MM:SS"
    await expect(page.getByText('到着予定')).toBeVisible();
    const timePattern = /\d{1,2}:\d{2}:\d{2}/;
    const arrivalText = page.locator('.font-mono').first();
    const text = await arrivalText.textContent();
    expect(text).toMatch(timePattern);
  });

  test('should update calculation reactively when distance changes', async ({ page }) => {
    const distanceInput = page.locator('#eta-distance');
    await distanceInput.fill('30');
    // 30km at 60km/h = 30min = 0h30m
    await expect(page.getByText(/0時間30分|0h 30m/i)).toBeVisible();
  });
});
