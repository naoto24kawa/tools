import { test, expect } from '@playwright/test';

test.describe('World Clock', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/datetime-world-clock');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /World Clock/i })).toBeVisible();
  });

  test('should display multiple city clocks', async ({ page }) => {
    // Each city is shown in a Card; there should be multiple
    const cards = page.locator('[class*="rounded-xl"]');
    await expect(cards.first()).toBeVisible();
    expect(await cards.count()).toBeGreaterThan(3);
  });

  test('should show Tokyo time', async ({ page }) => {
    await expect(page.getByText(/Tokyo/i)).toBeVisible();
  });

  test('should show New York or London time', async ({ page }) => {
    // At least one of the major western cities should appear
    const hasNewYork = await page.getByText(/New York/i).isVisible();
    const hasLondon = await page.getByText(/London/i).isVisible();
    expect(hasNewYork || hasLondon).toBeTruthy();
  });

  test('should display time in HH:MM format', async ({ page }) => {
    // Time values are in large monospace font; check that a time pattern is visible
    const timePattern = /^\d{1,2}:\d{2}/;
    const monoCodes = page.locator('.font-mono');
    const firstTime = await monoCodes.first().textContent();
    expect(firstTime).toMatch(timePattern);
  });

  test('should show timezone offset labels', async ({ page }) => {
    // Each city card should have an offset label like UTC+9 or +09:00
    await expect(page.getByText(/UTC|GMT|\+\d{2}|[-+]\d/i).first()).toBeVisible();
  });
});
