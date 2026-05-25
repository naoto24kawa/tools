import { test, expect } from '@playwright/test';

test.describe('HTTP Header Viewer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/http-header-viewer');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText(/HTTP Header Viewer/i)).toBeVisible();
  });

  test('should show search input', async ({ page }) => {
    await expect(page.getByPlaceholder(/header name or keyword/i)).toBeVisible();
  });

  test('should show category filter dropdown', async ({ page }) => {
    await expect(page.getByText(/all categories/i)).toBeVisible();
  });

  test('should display headers list on load', async ({ page }) => {
    // CardDescription renders as div.text-sm.text-muted-foreground
    const countText = page.locator('div.text-sm.text-muted-foreground').filter({ hasText: /header.*found/i });
    await expect(countText).toBeVisible();
    const text = await countText.textContent();
    const match = text?.match(/(\d+)/);
    expect(Number(match?.[1])).toBeGreaterThan(0);
  });

  test('should filter headers by search query', async ({ page }) => {
    await page.getByPlaceholder(/header name or keyword/i).fill('Content-Type');
    // Use code element to match the header name exactly
    await expect(page.locator('code').filter({ hasText: 'Content-Type' }).first()).toBeVisible();
  });

  test('should show no results message for unknown header search', async ({ page }) => {
    await page.getByPlaceholder(/header name or keyword/i).fill('xyzunknownheader99999');
    await expect(page.getByText(/no headers found/i)).toBeVisible();
  });

  test('should expand header detail when clicked', async ({ page }) => {
    // Click the first header entry to expand it (buttons inside border rounded-md containers)
    const firstHeader = page.locator('button[class*="px-4 py-3"]').first();
    await firstHeader.click();
    await expect(page.getByText('Example').first()).toBeVisible();
  });

  test('should collapse header detail on second click', async ({ page }) => {
    const firstHeader = page.locator('button[class*="px-4 py-3"]').first();
    await firstHeader.click();
    await firstHeader.click();
    // After collapse, the detail area (border-t section) should be hidden
    await expect(page.locator('.border-t.bg-muted\\/10').first()).not.toBeVisible();
  });

  test('should filter by Response category', async ({ page }) => {
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /^response$/i }).click();
    // CardDescription renders as div.text-sm.text-muted-foreground
    const countText = page.locator('div.text-sm.text-muted-foreground').filter({ hasText: /header.*found/i });
    await expect(countText).toBeVisible();
    const text = await countText.textContent();
    const match = text?.match(/(\d+)/);
    expect(Number(match?.[1])).toBeGreaterThan(0);
  });
});
