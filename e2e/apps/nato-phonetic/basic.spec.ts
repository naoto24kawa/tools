import { test, expect } from '@playwright/test';

test.describe('NATO Phonetic Alphabet', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/nato-phonetic');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'NATO Phonetic Alphabet' })).toBeVisible();
  });

  test('should convert A to Alpha', async ({ page }) => {
    const input = page.locator('#text-input');
    await input.fill('A');
    // A maps to "Alfa" in this app's NATO alphabet table
    await expect(page.getByText('Alfa')).toBeVisible();
  });

  test('should convert B to Bravo', async ({ page }) => {
    const input = page.locator('#text-input');
    await input.fill('B');
    await expect(page.getByText(/Bravo/i)).toBeVisible();
  });

  test('should convert Hello to NATO string', async ({ page }) => {
    const input = page.locator('#text-input');
    await input.fill('Hello');
    // H=Hotel, E=Echo, L=Lima, L=Lima, O=Oscar
    await expect(page.getByText(/Hotel/i)).toBeVisible();
    await expect(page.getByText(/Echo/i)).toBeVisible();
    await expect(page.getByText(/Lima/i)).toBeVisible();
    await expect(page.getByText(/Oscar/i)).toBeVisible();
  });

  test('should decode Alfa Bravo to AB', async ({ page }) => {
    const natoInput = page.locator('#nato-input');
    // A maps to "Alfa" (not "Alpha") in this app's NATO table
    await natoInput.fill('Alfa Bravo');
    // The decoded text "AB" appears in the output div
    await expect(page.locator('.font-mono').filter({ hasText: 'AB' })).toBeVisible();
  });

  test('should show reference table when button clicked', async ({ page }) => {
    await page.getByRole('button', { name: /Show Reference Table/i }).click();
    await expect(page.getByText('Reference Table', { exact: true })).toBeVisible();
    // Spot-check a few entries from the table
    await expect(page.getByText('Alfa')).toBeVisible();
    await expect(page.getByText('Zulu')).toBeVisible();
  });

  test('should hide reference table when toggled again', async ({ page }) => {
    await page.getByRole('button', { name: /Show Reference Table/i }).click();
    await expect(page.getByText('Reference Table', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: /Hide Reference Table/i }).click();
    await expect(page.getByText('Reference Table', { exact: true })).not.toBeVisible();
  });
});
