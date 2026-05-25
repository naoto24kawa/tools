import { test, expect } from '@playwright/test';

test.describe('NATO Phonetic Alphabet', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/nato-phonetic');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText(/NATO Phonetic Alphabet/i)).toBeVisible();
  });

  test('should convert A to Alpha', async ({ page }) => {
    const input = page.locator('#text-input');
    await input.fill('A');
    await expect(page.getByText(/Alpha/i)).toBeVisible();
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

  test('should decode Alpha Bravo to AB', async ({ page }) => {
    const natoInput = page.locator('#nato-input');
    await natoInput.fill('Alpha Bravo');
    await expect(page.getByText(/AB/)).toBeVisible();
  });

  test('should show reference table when button clicked', async ({ page }) => {
    await page.getByRole('button', { name: /Show Reference Table/i }).click();
    await expect(page.getByText(/Reference Table/i)).toBeVisible();
    // Spot-check a few entries from the table
    await expect(page.getByText('Alpha')).toBeVisible();
    await expect(page.getByText('Zulu')).toBeVisible();
  });

  test('should hide reference table when toggled again', async ({ page }) => {
    await page.getByRole('button', { name: /Show Reference Table/i }).click();
    await expect(page.getByText(/Reference Table/i)).toBeVisible();
    await page.getByRole('button', { name: /Hide Reference Table/i }).click();
    await expect(page.getByText('Reference Table')).not.toBeVisible();
  });
});
