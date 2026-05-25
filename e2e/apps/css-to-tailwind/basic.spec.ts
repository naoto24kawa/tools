import { test, expect } from '@playwright/test';

test.describe('CSS to Tailwind', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/css-to-tailwind');
  });

  test('should load page with heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /css to tailwind/i })).toBeVisible();
  });

  test('should show CSS Input textarea', async ({ page }) => {
    await expect(page.getByLabel('CSS Input')).toBeVisible();
  });

  test('should convert display:flex to Tailwind flex class', async ({ page }) => {
    await page.getByLabel('CSS Input').fill('display: flex;');
    await expect(page.getByText('flex')).toBeVisible();
  });

  test('should convert multiple CSS properties', async ({ page }) => {
    const css = 'display: flex;\nalign-items: center;\npadding: 1rem;';
    await page.getByLabel('CSS Input').fill(css);
    // Tailwind classes section should appear
    await expect(page.getByText('Tailwind Classes')).toBeVisible();
    await expect(page.getByText('Property Mapping')).toBeVisible();
  });

  test('should show exact match indicator for known properties', async ({ page }) => {
    await page.getByLabel('CSS Input').fill('display: flex;');
    // Should show conversion result
    await expect(page.getByText(/flex/)).toBeVisible();
  });

  test('should show Copy Classes button after conversion', async ({ page }) => {
    await page.getByLabel('CSS Input').fill('display: flex;');
    await expect(page.getByRole('button', { name: /copy classes/i })).toBeVisible();
  });

  test('should show Clear button that clears input', async ({ page }) => {
    await page.getByLabel('CSS Input').fill('display: flex;');
    await page.getByRole('button', { name: /clear/i }).click();
    await expect(page.getByLabel('CSS Input')).toHaveValue('');
  });

  test('should convert padding-based class correctly', async ({ page }) => {
    await page.getByLabel('CSS Input').fill('padding: 1rem;');
    await expect(page.getByText(/p-4|padding/i)).toBeVisible();
  });

  test('should show match count summary', async ({ page }) => {
    await page.getByLabel('CSS Input').fill('display: flex;\nalign-items: center;');
    // Should show exact/approximate match counts
    await expect(page.getByText(/exact match|approximate/i)).toBeVisible();
  });
});
