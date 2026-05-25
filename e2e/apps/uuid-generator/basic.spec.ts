import { test, expect } from '@playwright/test';

test.describe('UUID/ULID Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/uuid-generator');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText('UUID/ULID Generator')).toBeVisible();
  });

  test('should generate a valid UUID v4', async ({ page }) => {
    await page.getByRole('button', { name: /generate/i }).click();
    await expect(
      page.getByText(/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i)
    ).toBeVisible();
  });

  test('should show UUID version and variant info', async ({ page }) => {
    await page.getByRole('button', { name: /generate/i }).click();
    // App displays version as "v4" and variant info in the result card
    await expect(page.getByText(/v4 \/ /i)).toBeVisible();
  });

  test('should generate multiple UUIDs when count is set', async ({ page }) => {
    await page.locator('#count').fill('3');
    await page.getByRole('button', { name: /generate/i }).click();
    await expect(page.getByText('Results (3)')).toBeVisible();
    const uuidItems = page.locator('.font-mono.break-all');
    await expect(uuidItems).toHaveCount(3);
  });

  test('should show copy all and clear buttons after generation', async ({ page }) => {
    await page.getByRole('button', { name: /generate/i }).click();
    await expect(page.getByRole('button', { name: /copy all/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /clear/i })).toBeVisible();
  });

  test('should clear results when clear button clicked', async ({ page }) => {
    await page.getByRole('button', { name: /generate/i }).click();
    await expect(page.locator('.font-mono.break-all').first()).toBeVisible();
    await page.getByRole('button', { name: /clear/i }).click();
    await expect(page.locator('.font-mono.break-all')).toHaveCount(0);
  });

  test('should switch to ULID generation', async ({ page }) => {
    // Open the type select and choose ULID
    await page.locator('#id-type').click();
    await page.getByRole('option', { name: 'ULID' }).click();
    await page.getByRole('button', { name: /generate/i }).click();
    // ULID is 26 chars, uppercase alphanumeric
    await expect(page.getByText(/[0-9A-Z]{26}/)).toBeVisible();
  });
});
