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
    // 到着予定 appears twice (in description paragraph and label), use first
    await expect(page.getByText('到着予定').first()).toBeVisible();
    // 100/60 ≈ 1h 40m → formatDuration shows "1時間40分"
    await expect(page.getByText('1時間40分')).toBeVisible();
  });

  test('should calculate ETA for 60km at 60km/h = exactly 1 hour', async ({ page }) => {
    const distanceInput = page.locator('#eta-distance');
    const speedInput = page.locator('#eta-speed');
    await distanceInput.fill('60');
    await speedInput.fill('60');
    // formatDuration: hours=1, minutes=0 → "1時間"
    await expect(page.getByText('1時間')).toBeVisible();
  });

  test('should calculate ETA for 120km at 60km/h = 2 hours', async ({ page }) => {
    const distanceInput = page.locator('#eta-distance');
    const speedInput = page.locator('#eta-speed');
    await distanceInput.fill('120');
    await speedInput.fill('60');
    // formatDuration: hours=2, minutes=0 → "2時間"
    await expect(page.getByText('2時間')).toBeVisible();
  });

  test('should show arrival time in locale format', async ({ page }) => {
    // Should show a time like "HH:MM:SS"
    // 到着予定 appears twice (in description paragraph and label), use first
    await expect(page.getByText('到着予定').first()).toBeVisible();
    const timePattern = /\d{1,2}:\d{2}:\d{2}/;
    // Arrival time is displayed in text-xl font-mono div
    const arrivalText = page.locator('.text-xl.font-mono').first();
    const text = await arrivalText.textContent();
    expect(text).toMatch(timePattern);
  });

  test('should update calculation reactively when distance changes', async ({ page }) => {
    const distanceInput = page.locator('#eta-distance');
    await distanceInput.fill('30');
    // 30km at 60km/h = 30min → formatDuration: hours=0, minutes=30 → "30分"
    await expect(page.getByText('30分')).toBeVisible();
  });
});
