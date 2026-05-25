import { test, expect } from '@playwright/test';

test.describe('SemVer Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/semver-calculator');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'SemVer Calculator' })).toBeVisible();
  });

  test('should display parsed major, minor, patch for default version 1.0.0', async ({ page }) => {
    // Default version is 1.0.0
    await expect(page.getByText('Major').first()).toBeVisible();
    await expect(page.getByText('Minor').first()).toBeVisible();
    await expect(page.getByText('Patch').first()).toBeVisible();
  });

  test('should bump major version', async ({ page }) => {
    await page.locator('input#version').fill('1.2.3');
    await page.getByRole('button', { name: /major/i }).click();
    // Version input should update to 2.0.0
    await expect(page.locator('input#version')).toHaveValue('2.0.0');
  });

  test('should bump minor version', async ({ page }) => {
    await page.locator('input#version').fill('1.2.3');
    await page.getByRole('button', { name: /minor/i }).click();
    await expect(page.locator('input#version')).toHaveValue('1.3.0');
  });

  test('should bump patch version', async ({ page }) => {
    await page.locator('input#version').fill('1.2.3');
    await page.getByRole('button', { name: /patch/i }).click();
    await expect(page.locator('input#version')).toHaveValue('1.2.4');
  });

  test('should show validation error for invalid semver input', async ({ page }) => {
    await page.locator('input#version').fill('not-a-version');
    await expect(page.getByRole('alert')).toBeVisible();
  });

  test('should compare two versions and show > symbol', async ({ page }) => {
    await page.locator('input#compare-a').fill('2.0.0');
    await page.locator('input#compare-b').fill('1.0.0');
    // Comparison result shows "2.0.0 > 1.0.0"
    await expect(page.getByText(/2\.0\.0 > 1\.0\.0/)).toBeVisible();
  });

  test('should compare equal versions and show = symbol', async ({ page }) => {
    await page.locator('input#compare-a').fill('1.0.0');
    await page.locator('input#compare-b').fill('1.0.0');
    await expect(page.getByText(/1\.0\.0 = 1\.0\.0/)).toBeVisible();
  });

  test('should check range matching: 1.2.3 satisfies ^1.0.0', async ({ page }) => {
    await page.locator('input#range-version').fill('1.2.3');
    await page.locator('input#range-expr').fill('^1.0.0');
    // Result should be green (satisfies)
    await expect(page.locator('.bg-green-50').filter({ hasText: 'satisfies' })).toBeVisible();
  });

  test('should check range: 2.0.0 does not satisfy ^1.0.0', async ({ page }) => {
    await page.locator('input#range-version').fill('2.0.0');
    await page.locator('input#range-expr').fill('^1.0.0');
    await expect(page.getByText(/does not satisfy/)).toBeVisible();
  });
});
