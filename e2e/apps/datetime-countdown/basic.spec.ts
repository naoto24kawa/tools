import { test, expect } from '@playwright/test';

test.describe('Countdown Timer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/datetime-countdown');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Countdown/i })).toBeVisible();
  });

  test('should show countdown display on load with default New Year target', async ({ page }) => {
    // The default title is "New Year"
    await expect(page.getByText(/New Year/i).first()).toBeVisible();
    // Should show day/hour/min/sec labels
    await expect(page.getByText('日').first()).toBeVisible();
    await expect(page.getByText('時間').first()).toBeVisible();
    await expect(page.getByText('分').first()).toBeVisible();
    await expect(page.getByText('秒').first()).toBeVisible();
  });

  test('should update title when changed', async ({ page }) => {
    const titleInput = page.locator('#countdown-title');
    await titleInput.fill('My Event');
    await expect(page.getByText(/My Event/i)).toBeVisible();
  });

  test('should show past label when target date is in the past', async ({ page }) => {
    const targetInput = page.locator('#countdown-target');
    // Set target to past date
    await targetInput.fill('2000-01-01T00:00');
    await expect(page.getByText(/経過/)).toBeVisible();
  });

  test('should show future label when target date is in the future', async ({ page }) => {
    const targetInput = page.locator('#countdown-target');
    // Set target far in the future
    await targetInput.fill('2099-12-31T23:59');
    await expect(page.getByText(/まで/).first()).toBeVisible();
  });

  test('should show zero or positive countdown values', async ({ page }) => {
    const countdownGrid = page.locator('[aria-live="polite"]');
    await expect(countdownGrid).toBeVisible();
    // The day value should be a non-negative number
    const dayValue = countdownGrid.locator('.text-3xl').first();
    const text = await dayValue.textContent();
    expect(Number(text)).toBeGreaterThanOrEqual(0);
  });
});
