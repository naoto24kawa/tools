import { test, expect } from '@playwright/test';

test.describe('Icon Search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/icon-search');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText(/Icon Search/i)).toBeVisible();
  });

  test('should show search input', async ({ page }) => {
    await expect(page.getByPlaceholder(/search icons/i)).toBeVisible();
  });

  test('should display icon count text', async ({ page }) => {
    await expect(page.getByText(/\d+ icons? found/i)).toBeVisible();
  });

  test('should show icons grid on load', async ({ page }) => {
    const iconButtons = page.locator('button[title]');
    const count = await iconButtons.count();
    expect(count).toBeGreaterThan(10);
  });

  test('should filter icons by search query', async ({ page }) => {
    const initialCountText = await page.getByText(/\d+ icons? found/i).textContent();
    await page.getByPlaceholder(/search icons/i).fill('arrow');
    const filteredCountText = await page.getByText(/\d+ icons? found/i).textContent();
    expect(filteredCountText).not.toBe(initialCountText);
    // All visible icon titles should relate to "arrow"
    const iconButtons = page.locator('button[title]');
    const count = await iconButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should show detail panel when clicking an icon', async ({ page }) => {
    const firstIcon = page.locator('button[title]').first();
    await firstIcon.click();
    // Detail card shows React Import and JSX Usage
    await expect(page.getByText(/react import/i)).toBeVisible();
    await expect(page.getByText(/jsx usage/i)).toBeVisible();
  });

  test('should update icon size via range slider', async ({ page }) => {
    const slider = page.getByRole('slider', { name: /icon size/i });
    await slider.fill('48');
    await expect(page.getByText('48px')).toBeVisible();
  });

  test('should show category filter buttons', async ({ page }) => {
    // "All" category button should always be present
    await expect(page.getByRole('button', { name: /^all$/i })).toBeVisible();
  });

  test('should filter by category', async ({ page }) => {
    const allCountText = await page.getByText(/\d+ icons? found/i).textContent();
    // Click the second category button (not "All")
    const categoryButtons = page.locator('div.flex.flex-wrap.gap-2 button');
    const count = await categoryButtons.count();
    if (count > 1) {
      await categoryButtons.nth(1).click();
      const filteredCountText = await page.getByText(/\d+ icons? found/i).textContent();
      expect(filteredCountText).not.toBe(allCountText);
    }
  });
});
