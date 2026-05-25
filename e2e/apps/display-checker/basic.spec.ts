import { test, expect } from '@playwright/test';

test.describe('Display Checker', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/display-checker');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText(/Display Checker/i)).toBeVisible();
  });

  test('should automatically show screen resolution', async ({ page }) => {
    // Resolution is shown as "WIDTH x HEIGHT" in a code element
    await expect(page.locator('code').filter({ hasText: /\d+ x \d+/ }).first()).toBeVisible();
  });

  test('should show viewport size', async ({ page }) => {
    await expect(page.getByText(/Viewport Size/i)).toBeVisible();
    // Viewport values shown as "W x H"
    await expect(page.locator('code').filter({ hasText: /\d+ x \d+/ }).first()).toBeVisible();
  });

  test('should show device pixel ratio', async ({ page }) => {
    await expect(page.getByText(/Device Pixel Ratio/i)).toBeVisible();
    await expect(page.locator('code').filter({ hasText: /\d+x/ }).first()).toBeVisible();
  });

  test('should show color depth', async ({ page }) => {
    await expect(page.getByText(/Color Depth/i)).toBeVisible();
    await expect(page.getByText(/\d+ bit/i)).toBeVisible();
  });

  test('should show orientation', async ({ page }) => {
    await expect(page.getByText(/Orientation/i)).toBeVisible();
    await expect(page.locator('code').filter({ hasText: /landscape|portrait/i }).first()).toBeVisible();
  });

  test('should show online status', async ({ page }) => {
    await expect(page.getByText(/Online/i)).toBeVisible();
    await expect(page.locator('code').filter({ hasText: /Yes|No/ }).first()).toBeVisible();
  });

  test('should show language information', async ({ page }) => {
    await expect(page.getByText('Language', { exact: true })).toBeVisible();
    // Language code like "en-US" or "ja"
    await expect(page.locator('code').filter({ hasText: /[a-z]{2}/i }).first()).toBeVisible();
  });

  test('should show user agent in the UA card', async ({ page }) => {
    await expect(page.getByText('User Agent')).toBeVisible();
    // User agent code element should contain "Mozilla"
    await expect(page.locator('code').filter({ hasText: /Mozilla/i })).toBeVisible();
  });

  test('should refresh display info when Refresh button is clicked', async ({ page }) => {
    await expect(page.getByText(/Display Information/i)).toBeVisible();
    await page.getByRole('button', { name: /Refresh/i }).click();
    // Page still shows the display info after refresh
    await expect(page.getByText(/Screen Resolution/i)).toBeVisible();
  });

  test('should show Tailwind breakpoint', async ({ page }) => {
    await expect(page.getByText(/Breakpoint/i)).toBeVisible();
  });
});
