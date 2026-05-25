import { test, expect } from '@playwright/test';

test.describe('Barcode Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/barcode-generator');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText('Barcode Generator')).toBeVisible();
  });

  test('should show placeholder text when no value', async ({ page }) => {
    await expect(page.getByText(/enter a value to generate barcode/i)).toBeVisible();
  });

  test('should generate barcode SVG when valid value is entered (CODE128)', async ({ page }) => {
    await page.locator('input#value').fill('ABC123');
    // Barcode renders via useEffect, wait for SVG to have content
    await page.waitForFunction(
      () => {
        const svg = document.querySelector('svg');
        return svg && svg.children.length > 0;
      },
      { timeout: 5000 }
    );
    await expect(page.locator('svg').first()).toBeVisible();
  });

  test('should enable copy SVG button when barcode is generated', async ({ page }) => {
    await page.locator('input#value').fill('HELLO');
    await expect(page.getByRole('button', { name: /copy svg/i })).toBeEnabled({ timeout: 5000 });
  });

  test('should enable download button when barcode is generated', async ({ page }) => {
    await page.locator('input#value').fill('HELLO');
    await expect(page.getByRole('button', { name: /download/i })).toBeEnabled({ timeout: 5000 });
  });

  test('should have format selector', async ({ page }) => {
    await expect(page.locator('#format')).toBeVisible();
  });

  test('should have bar width and height inputs', async ({ page }) => {
    await expect(page.locator('#width')).toBeVisible();
    await expect(page.locator('#height')).toBeVisible();
  });

  test('should show invalid format error for EAN13 with non-numeric input', async ({ page }) => {
    // Switch to EAN13 which requires digits only
    await page.locator('#format').click();
    await page.getByRole('option', { name: 'EAN13' }).click();
    await page.locator('input#value').fill('NOTDIGITS');
    await expect(page.getByRole('alert')).toBeVisible();
  });

  test('should clear value when clear button clicked', async ({ page }) => {
    await page.locator('input#value').fill('TEST123');
    await page.getByRole('button', { name: /clear/i }).click();
    await expect(page.locator('input#value')).toHaveValue('');
  });
});
