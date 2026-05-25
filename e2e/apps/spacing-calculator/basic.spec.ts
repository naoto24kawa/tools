import { test, expect } from '@playwright/test';

test.describe('Spacing Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/spacing-calculator');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText('Spacing Calculator')).toBeVisible();
  });

  test('should show base unit input with default value 8', async ({ page }) => {
    const baseUnitInput = page.locator('#baseUnit');
    await expect(baseUnitInput).toBeVisible();
    await expect(baseUnitInput).toHaveValue('8');
  });

  test('should show root font size input with default value 16', async ({ page }) => {
    const fontSizeInput = page.locator('#baseFontSize');
    await expect(fontSizeInput).toBeVisible();
    await expect(fontSizeInput).toHaveValue('16');
  });

  test('should display spacing table with px/rem/em/Tailwind columns', async ({ page }) => {
    await expect(page.getByRole('columnheader', { name: 'px', exact: true })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'rem', exact: true })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'em', exact: true })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Tailwind', exact: true })).toBeVisible();
  });

  test('should recalculate when base unit changes', async ({ page }) => {
    const baseUnitInput = page.locator('#baseUnit');
    // Default: 8px base → first row shows 8px
    await expect(page.getByRole('cell', { name: '8px', exact: true })).toBeVisible();

    // Change to 4px base
    await baseUnitInput.fill('4');
    await expect(page.getByRole('cell', { name: '4px', exact: true })).toBeVisible();
  });

  test('should show Tailwind class names', async ({ page }) => {
    // With base 8, common tailwind classes like p-1, p-2 etc should appear
    await expect(page.locator('td.font-mono.text-primary').first()).toBeVisible();
  });

  test('should show Copy All button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /copy all/i })).toBeVisible();
  });

  test('should show spacing scale card', async ({ page }) => {
    await expect(page.getByText('Spacing Scale')).toBeVisible();
  });

  test('should show visual spacing preview', async ({ page }) => {
    await expect(page.getByText('Visual Spacing Preview')).toBeVisible();
  });

  test('should recalculate rem values when font size changes', async ({ page }) => {
    // With 16px font, 8px = 0.5rem
    await expect(page.getByText('0.5rem')).toBeVisible();

    // Change to 8px root font size → 8px = 1rem
    const fontSizeInput = page.locator('#baseFontSize');
    await fontSizeInput.fill('8');
    await expect(page.getByText('1rem')).toBeVisible();
  });
});
