import { test, expect } from '@playwright/test';

test.describe('Countdown Timer (Timer)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/datetime-timer');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Timer/i })).toBeVisible();
  });

  test('should show initial timer display of 05:00', async ({ page }) => {
    // Default is 5 minutes
    await expect(page.getByText('05:00')).toBeVisible();
  });

  test('should start timer when Start is clicked', async ({ page }) => {
    const startBtn = page.getByRole('button', { name: /Start/i });
    await expect(startBtn).toBeEnabled();
    await startBtn.click();
    // After clicking Start, Pause button should appear
    await expect(page.getByRole('button', { name: /Pause/i })).toBeVisible();
  });

  test('should pause timer when Pause is clicked', async ({ page }) => {
    await page.getByRole('button', { name: /Start/i }).click();
    const pauseBtn = page.getByRole('button', { name: /Pause/i });
    await expect(pauseBtn).toBeVisible();
    await pauseBtn.click();
    // After pausing, Start button should reappear
    await expect(page.getByRole('button', { name: /Start/i })).toBeVisible();
  });

  test('should reset timer when Reset is clicked', async ({ page }) => {
    await page.getByRole('button', { name: /Start/i }).click();
    await page.waitForTimeout(1200);
    await page.getByRole('button', { name: /Reset/i }).click();
    // After reset, timer should be back to 05:00
    await expect(page.getByText('05:00')).toBeVisible();
  });

  test('should change duration when preset is clicked', async ({ page }) => {
    // Click the "1分" preset button
    await page.getByRole('button', { name: /^1分$/ }).click();
    await expect(page.getByText('01:00')).toBeVisible();
  });

  test('should show progress bar', async ({ page }) => {
    const progressBar = page.getByRole('progressbar');
    await expect(progressBar).toBeVisible();
  });
});
