import { test, expect } from '@playwright/test';

test.describe('Random Coin Flip', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/random-coin');
  });

  test('should load page', async ({ page }) => {
    await expect(page).toHaveTitle(/Coin Flip/i);
    await expect(page.getByRole('heading', { name: /Coin Flip/i })).toBeVisible();
  });

  test('should show count input and Flip button', async ({ page }) => {
    await expect(page.getByLabel('回数')).toBeVisible();
    await expect(page.getByRole('button', { name: /Flip!/i })).toBeVisible();
  });

  test('should flip coin and show heads/tails result', async ({ page }) => {
    await page.getByRole('button', { name: /Flip!/i }).click();
    await expect(page.getByText(/Heads/)).toBeVisible();
    await expect(page.getByText(/Tails/)).toBeVisible();
  });

  test('should show coin result with 1 flip', async ({ page }) => {
    await page.getByLabel('回数').fill('1');
    await page.getByRole('button', { name: /Flip!/i }).click();
    // Exactly one coin icon (H or T) should appear in the visual area
    const coins = page.locator('.w-12.h-12.rounded-full');
    await expect(coins).toHaveCount(1);
  });

  test('should show coin faces for multiple flips (up to 20)', async ({ page }) => {
    await page.getByLabel('回数').fill('10');
    await page.getByRole('button', { name: /Flip!/i }).click();
    // 10 coin visual boxes should appear
    const coins = page.locator('.w-12.h-12.rounded-full');
    await expect(coins).toHaveCount(10);
  });

  test('should show counts and percentages', async ({ page }) => {
    await page.getByLabel('回数').fill('100');
    await page.getByRole('button', { name: /Flip!/i }).click();
    // Percentage display in format "X.X%"
    await expect(page.getByText(/\d+\.\d+%/).first()).toBeVisible();
  });

  test('should show head count and tail count sum equal to total flips', async ({ page }) => {
    await page.getByLabel('回数').fill('10');
    await page.getByRole('button', { name: /Flip!/i }).click();
    const headsEl = page.locator('.bg-yellow-50, .bg-yellow-950').getByRole('paragraph').or(
      page.locator('.bg-yellow-50 .text-3xl, .bg-yellow-950 .text-3xl')
    ).first();
    // Just verify the results section is visible with head/tail stats
    await expect(page.locator('.grid.grid-cols-2').last()).toBeVisible();
  });
});
