import { test, expect } from '@playwright/test';

test.describe('ARIA Reference', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/aria-reference');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page).toHaveTitle(/ARIA Reference/i);
    await expect(page.getByRole('heading', { name: 'ARIA Reference' })).toBeVisible();
  });

  test('should show search input', async ({ page }) => {
    await expect(page.getByPlaceholder(/search roles, states, properties/i)).toBeVisible();
  });

  test('should show category filter buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'All' }).first()).toBeVisible();
  });

  test('should show type filter buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Role' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'State' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Property' })).toBeVisible();
  });

  test('should show results on load', async ({ page }) => {
    // Results count should be visible
    await expect(page.locator('text=/\\d+ results?/')).toBeVisible();
  });

  test('should filter results when searching', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search roles, states, properties/i);
    await searchInput.fill('button');

    // Results should be filtered - count text should update
    await expect(page.locator('text=/\\d+ results?/')).toBeVisible();
    // At least one card with "button" related name should appear
    await expect(page.locator('.font-mono').filter({ hasText: /button/i }).first()).toBeVisible();
  });

  test('should filter by type Role', async ({ page }) => {
    await page.getByRole('button', { name: 'Role' }).click();
    // Role type badge should be visible
    await expect(page.locator('text=role').first()).toBeVisible();
  });

  test('should filter by type State', async ({ page }) => {
    await page.getByRole('button', { name: 'State' }).click();
    await expect(page.locator('text=state').first()).toBeVisible();
  });

  test('should filter by type Property', async ({ page }) => {
    await page.getByRole('button', { name: 'Property' }).click();
    await expect(page.locator('text=property').first()).toBeVisible();
  });

  test('should show no results message for unmatched search', async ({ page }) => {
    await page.getByPlaceholder(/search roles, states, properties/i).fill('xyznonexistentrole12345');
    await expect(page.getByText('No matching entries found.')).toBeVisible();
  });

  test('should show entry details including description', async ({ page }) => {
    // First result card should have a description text
    await expect(page.locator('.space-y-2 p.text-sm').first()).toBeVisible();
  });

  test('should reset to all results when All button is clicked after type filter', async ({ page }) => {
    await page.getByRole('button', { name: 'Role' }).click();
    const filteredCount = await page.locator('text=/\\d+ results?/').textContent();

    await page.getByRole('button', { name: 'All' }).first().click();
    const allCount = await page.locator('text=/\\d+ results?/').textContent();

    // All results should be more or equal than filtered
    const filteredNum = parseInt(filteredCount?.match(/\d+/)?.[0] ?? '0');
    const allNum = parseInt(allCount?.match(/\d+/)?.[0] ?? '0');
    expect(allNum).toBeGreaterThanOrEqual(filteredNum);
  });
});
