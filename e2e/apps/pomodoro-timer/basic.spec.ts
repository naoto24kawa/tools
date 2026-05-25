import { test, expect } from '@playwright/test';

test.describe('Pomodoro Timer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pomodoro-timer');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Pomodoro Timer' })).toBeVisible();
  });

  test('should display timer in MM:SS format', async ({ page }) => {
    // Default work duration is 25 minutes → displays as 25:00
    await expect(page.getByText('25:00')).toBeVisible();
  });

  test('should show Work phase label by default', async ({ page }) => {
    await expect(page.getByText('Work', { exact: true })).toBeVisible();
  });

  test('should have Start and Reset buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Start/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Reset/i })).toBeVisible();
  });

  test('should change Start to Pause when timer is running', async ({ page }) => {
    await page.getByRole('button', { name: /Start/i }).click();
    await expect(page.getByRole('button', { name: /Pause/i })).toBeVisible();
  });

  test('should pause the timer when Pause is clicked', async ({ page }) => {
    await page.getByRole('button', { name: /Start/i }).click();
    await page.getByRole('button', { name: /Pause/i }).click();
    // After pausing, Start button should reappear
    await expect(page.getByRole('button', { name: /Start/i })).toBeVisible();
  });

  test('should reset timer to 25:00 when Reset is clicked after starting', async ({ page }) => {
    await page.getByRole('button', { name: /Start/i }).click();
    await page.waitForTimeout(1200);
    await page.getByRole('button', { name: /Reset/i }).click();
    await expect(page.getByText('25:00')).toBeVisible();
  });

  test('should show session count information', async ({ page }) => {
    await expect(page.getByText(/Session/i)).toBeVisible();
    await expect(page.getByText(/Total completed/i)).toBeVisible();
  });

  test('should open Settings panel', async ({ page }) => {
    await page.getByRole('button', { name: /Settings/i }).click();
    await expect(page.getByText('Timer Settings')).toBeVisible();
    await expect(page.getByLabel(/Work \(min\)/i)).toBeVisible();
  });

  test('should open Statistics panel', async ({ page }) => {
    await page.getByRole('button', { name: /Statistics/i }).click();
    // After panel opens, Today and This Week stats should appear
    await expect(page.getByText(/Today/i)).toBeVisible();
    await expect(page.getByText(/This Week/i)).toBeVisible();
  });
});
