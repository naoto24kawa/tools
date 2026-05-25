import { test, expect } from '@playwright/test';

test.describe('Contrast Checker', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contrast-checker');
  });

  test('should load page with heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /contrast checker/i })).toBeVisible();
  });

  test('should show contrast ratio for default colors', async ({ page }) => {
    // Default state: fgHex = #333333, bgHex = #ffffff
    // Ratio should be visible (computed from defaults)
    await expect(page.getByText(/:1/)).toBeVisible();
  });

  test('should show WCAG Pass for black on white (21:1)', async ({ page }) => {
    // Set foreground to black via hex input
    await page.locator('input#fgHex').fill('#000000');
    await page.locator('input#fgHex').blur();
    await page.locator('input#bgHex').fill('#ffffff');
    await page.locator('input#bgHex').blur();
    // Ratio 21:1 should appear
    await expect(page.getByText(/21\.00:1/)).toBeVisible();
    // WCAG AA Normal Text should pass
    await expect(page.getByText('Pass').first()).toBeVisible();
  });

  test('should show WCAG Fail for low-contrast colors', async ({ page }) => {
    // Light gray on white - low contrast
    await page.locator('input#fgHex').fill('#dddddd');
    await page.locator('input#fgHex').blur();
    await page.locator('input#bgHex').fill('#ffffff');
    await page.locator('input#bgHex').blur();
    // Should show Fail for AA Normal
    await expect(page.getByText('Fail').first()).toBeVisible();
  });

  test('should swap colors when Swap Colors button is clicked', async ({ page }) => {
    await page.locator('input#fgHex').fill('#123456');
    await page.locator('input#fgHex').blur();
    await page.locator('input#bgHex').fill('#abcdef');
    await page.locator('input#bgHex').blur();
    await page.getByRole('button', { name: /swap colors/i }).click();
    await expect(page.locator('input#fgHex')).toHaveValue('#abcdef');
    await expect(page.locator('input#bgHex')).toHaveValue('#123456');
  });

  test('should show preview section with text samples', async ({ page }) => {
    await expect(page.getByText(/large text preview/i)).toBeVisible();
    await expect(page.getByText(/normal text preview/i)).toBeVisible();
  });

  test('should display WCAG AA and AAA sections', async ({ page }) => {
    await expect(page.getByText('WCAG AA')).toBeVisible();
    await expect(page.getByText('WCAG AAA')).toBeVisible();
  });
});
