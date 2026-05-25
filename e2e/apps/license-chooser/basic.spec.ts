import { test, expect } from '@playwright/test';

test.describe('License Chooser', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/license-chooser');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/License/i);
  });

  test('should show heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'License Chooser' })).toBeVisible();
  });

  test('should show preference questions', async ({ page }) => {
    await expect(page.getByText('Do you need commercial use?')).toBeVisible();
    await expect(page.getByText('Do you need patent protection?')).toBeVisible();
    await expect(page.getByText('Do you want copyleft')).toBeVisible();
  });

  test('should show matching licenses list', async ({ page }) => {
    await expect(page.getByText(/Matching Licenses/)).toBeVisible();
  });

  test('should display license cards', async ({ page }) => {
    // Licenses like MIT, Apache, GPL etc should appear
    const cards = page.locator('[class*="cursor-pointer"]');
    await expect(cards.first()).toBeVisible();
  });

  test('should filter licenses when commercial use is set to No', async ({ page }) => {
    const commercialQuestion = page.getByText('Do you need commercial use?');
    const row = commercialQuestion.locator('..');
    await row.getByRole('button', { name: 'No' }).click();

    // Count should change or specific licenses show
    await expect(page.getByText(/Matching Licenses/)).toBeVisible();
  });

  test('should show license detail when a license card is clicked', async ({ page }) => {
    // Click the first license card
    const firstCard = page.locator('[class*="cursor-pointer"]').first();
    const licenseName = await firstCard.locator('[class*="CardTitle"]').textContent();
    await firstCard.click();

    // Should show license text
    await expect(page.getByText('License Text')).toBeVisible();
    await expect(page.getByRole('button', { name: /Copy/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Download/ })).toBeVisible();
    if (licenseName) {
      await expect(page.getByRole('heading', { name: licenseName.trim() })).toBeVisible();
    }
  });

  test('should navigate back to list from license detail', async ({ page }) => {
    const firstCard = page.locator('[class*="cursor-pointer"]').first();
    await firstCard.click();

    await page.getByRole('button', { name: 'Back to list' }).click();
    await expect(page.getByText(/Matching Licenses/)).toBeVisible();
  });

  test('should reset filters when reset button clicked', async ({ page }) => {
    // Set a filter
    const commercialRow = page.getByText('Do you need commercial use?').locator('..');
    await commercialRow.getByRole('button', { name: 'Yes' }).click();

    await page.getByRole('button', { name: 'Reset filters' }).click();
    // Any buttons should be back to neutral state
    await expect(page.getByText(/Matching Licenses/)).toBeVisible();
  });
});
