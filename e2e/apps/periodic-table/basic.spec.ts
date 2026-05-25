import { test, expect } from '@playwright/test';

test.describe('Periodic Table', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/periodic-table');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText(/Periodic Table/i)).toBeVisible();
  });

  test('should render element buttons in the grid', async ({ page }) => {
    // Hydrogen (H) should always be present
    await expect(page.getByRole('button', { name: /Hydrogen/i })).toBeVisible();
  });

  test('should show element detail card when an element is clicked', async ({ page }) => {
    // Click on Hydrogen (H, atomic number 1)
    await page.getByRole('button', { name: /Hydrogen/i }).click();
    await expect(page.getByText(/Atomic Number/i)).toBeVisible();
    await expect(page.getByText(/Symbol/i)).toBeVisible();
    await expect(page.getByText(/Atomic Mass/i)).toBeVisible();
  });

  test('should display correct details for Hydrogen', async ({ page }) => {
    await page.getByRole('button', { name: /Hydrogen/i }).click();
    await expect(page.getByText('Hydrogen')).toBeVisible();
    // Atomic number 1
    await expect(page.getByText('#1')).toBeVisible();
  });

  test('should display element detail for Carbon (C)', async ({ page }) => {
    await page.getByRole('button', { name: /Carbon/i }).click();
    await expect(page.getByText('Carbon')).toBeVisible();
    await expect(page.getByText('#6')).toBeVisible();
  });

  test('should close element detail when X button is clicked', async ({ page }) => {
    await page.getByRole('button', { name: /Hydrogen/i }).click();
    await expect(page.getByText(/Atomic Number/i)).toBeVisible();
    await page.getByRole('button').filter({ has: page.locator('svg') }).last().click();
    await expect(page.getByText(/Atomic Number/i)).not.toBeVisible();
  });

  test('should filter elements by search query', async ({ page }) => {
    const searchInput = page.locator('#search');
    await searchInput.fill('Gold');
    // Gold (Au) button should still be visible (in-filter)
    await expect(page.getByRole('button', { name: /Gold/i })).toBeVisible();
  });

  test('should filter elements by category', async ({ page }) => {
    const categorySelect = page.locator('#category');
    await categorySelect.click();
    // Pick Noble Gas category
    await page.getByRole('option', { name: /Noble Gas/i }).click();
    // Helium is a noble gas — its button should remain opaque
    await expect(page.getByRole('button', { name: /Helium/i })).toBeVisible();
  });

  test('should show search input', async ({ page }) => {
    await expect(page.locator('#search')).toBeVisible();
  });

  test('should show category select', async ({ page }) => {
    await expect(page.locator('#category')).toBeVisible();
  });
});
