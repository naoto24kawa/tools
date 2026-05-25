import { test, expect } from '@playwright/test';

test.describe('CSS Checkbox / Switch', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/css-checkbox');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/CSS Checkbox/i);
  });

  test('should display type toggle buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'switch' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'checkbox' })).toBeVisible();
  });

  test('should display Width slider', async ({ page }) => {
    await expect(page.getByLabel('Width')).toBeVisible();
  });

  test('should display Height slider', async ({ page }) => {
    await expect(page.getByLabel('Height')).toBeVisible();
  });

  test('should display Radius slider', async ({ page }) => {
    await expect(page.getByLabel('Radius')).toBeVisible();
  });

  test('should show color pickers for Active, Inactive, Knob', async ({ page }) => {
    await expect(page.locator('input[type="color"][aria-label="Activeカラーピッカー"]')).toBeVisible();
    await expect(page.locator('input[type="color"][aria-label="Inactiveカラーピッカー"]')).toBeVisible();
    await expect(page.locator('input[type="color"][aria-label="Knobカラーピッカー"]')).toBeVisible();
  });

  test('should show CSS Code output', async ({ page }) => {
    await expect(page.locator('pre')).toBeVisible();
    const text = await page.locator('pre').textContent();
    expect(text).toBeTruthy();
    expect(text!.length).toBeGreaterThan(0);
  });

  test('should show Copy CSS button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Copy CSS/i })).toBeVisible();
  });

  test('should switch to checkbox type when checkbox button clicked', async ({ page }) => {
    await page.getByRole('button', { name: 'checkbox' }).click();
    // The preview should now show a standard checkbox element
    await expect(page.getByLabel('チェックボックスプレビュー')).toBeVisible();
  });

  test('should default to switch type preview', async ({ page }) => {
    // Toggle switch label should be in preview by default
    await expect(page.getByText('Toggle switch')).toBeVisible();
  });
});
