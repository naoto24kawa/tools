import { test, expect } from '@playwright/test';

test.describe('Stopwatch', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/datetime-stopwatch');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Stopwatch/i })).toBeVisible();
  });

  test('should show initial display of 00:00.000', async ({ page }) => {
    await expect(page.getByText('00:00.000')).toBeVisible();
  });

  test('should start stopwatch when Start is clicked', async ({ page }) => {
    const startBtn = page.getByRole('button', { name: /Start/i });
    await expect(startBtn).toBeEnabled();
    await startBtn.click();
    // After starting, Pause button should appear
    await expect(page.getByRole('button', { name: /Pause/i })).toBeVisible();
  });

  test('should pause stopwatch when Pause is clicked', async ({ page }) => {
    await page.getByRole('button', { name: /Start/i }).click();
    await page.waitForTimeout(500);
    const pauseBtn = page.getByRole('button', { name: /Pause/i });
    await expect(pauseBtn).toBeEnabled();
    await pauseBtn.click();
    // After pausing, Start button reappears
    await expect(page.getByRole('button', { name: /Start/i })).toBeVisible();
  });

  test('should reset stopwatch to 00:00.000 when Reset is clicked', async ({ page }) => {
    await page.getByRole('button', { name: /Start/i }).click();
    await page.waitForTimeout(600);
    await page.getByRole('button', { name: /Pause/i }).click();
    await page.getByRole('button', { name: /Reset/i }).click();
    await expect(page.getByText('00:00.000')).toBeVisible();
  });

  test('should record lap time when Lap is clicked while running', async ({ page }) => {
    await page.getByRole('button', { name: /Start/i }).click();
    await page.waitForTimeout(300);
    const lapBtn = page.getByRole('button', { name: /Lap/i });
    await expect(lapBtn).toBeEnabled();
    await lapBtn.click();
    // Lap times section should appear
    await expect(page.getByLabel('ラップタイム一覧')).toBeVisible();
    await expect(page.getByText(/Lap 1/)).toBeVisible();
  });

  test('should disable Lap button when stopwatch is not running', async ({ page }) => {
    const lapBtn = page.getByRole('button', { name: /Lap/i });
    await expect(lapBtn).toBeDisabled();
  });
});
