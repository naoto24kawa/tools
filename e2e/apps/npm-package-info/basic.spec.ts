import { test, expect } from '@playwright/test';

test.describe('npm Package Info', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/npm-package-info');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /npm Package Info/i })).toBeVisible();
  });

  test('should show search input and button', async ({ page }) => {
    await expect(page.getByPlaceholder(/Enter package name/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Search/i })).toBeVisible();
  });

  test('should disable Search button when input is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Search/i })).toBeDisabled();
  });

  test('should enable Search button when package name is typed', async ({ page }) => {
    await page.getByPlaceholder(/Enter package name/i).fill('react');
    await expect(page.getByRole('button', { name: /Search/i })).toBeEnabled();
  });

  test('should show loading state when searching', async ({ page }) => {
    await page.getByPlaceholder(/Enter package name/i).fill('react');
    await page.getByRole('button', { name: /Search/i }).click();
    // Button shows loading text briefly
    await expect(page.getByRole('button', { name: /Loading/i })).toBeVisible();
  });

  test('should display package info after successful search', async ({ page }) => {
    await page.getByPlaceholder(/Enter package name/i).fill('is-odd');
    await page.getByRole('button', { name: /Search/i }).click();
    // Wait for API response – allow up to 15s for network
    await expect(page.getByText(/Latest Version/i)).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/License/i)).toBeVisible();
  });

  test('should trigger search on Enter key press', async ({ page }) => {
    const input = page.getByPlaceholder(/Enter package name/i);
    await input.fill('is-odd');
    await input.press('Enter');
    await expect(page.getByText(/Latest Version/i)).toBeVisible({ timeout: 15000 });
  });
});
