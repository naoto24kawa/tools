import { test, expect } from '@playwright/test';

test.describe('Avatar Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/avatar-generator');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Avatar Generator/i);
  });

  test('should display main heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Avatar Generator' })).toBeVisible();
  });

  test('should show seed input with default value', async ({ page }) => {
    const seedInput = page.getByLabel('Seed Text');
    await expect(seedInput).toBeVisible();
    await expect(seedInput).toHaveValue('hello');
  });

  test('should render avatar canvas on load', async ({ page }) => {
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
  });

  test('should update avatar when seed is changed', async ({ page }) => {
    const seedInput = page.getByLabel('Seed Text');
    await seedInput.fill('testuser123');
    await expect(page.getByText('256x256px')).toBeVisible();
  });

  test('should generate random seed when shuffle button clicked', async ({ page }) => {
    const seedInput = page.getByLabel('Seed Text');
    const initialSeed = await seedInput.inputValue();
    // Click the refresh/random button (icon button next to seed input)
    await page.locator('button[type="button"]').filter({ has: page.locator('svg') }).first().click();
    const newSeed = await seedInput.inputValue();
    expect(newSeed).not.toBe(initialSeed);
    expect(newSeed.length).toBeGreaterThan(0);
  });

  test('should switch avatar style to Pixel Art', async ({ page }) => {
    await page.getByText('Style').locator('..').locator('[role="combobox"]').click();
    await page.getByRole('option', { name: 'Pixel Art' }).click();
    await expect(page.getByRole('combobox').filter({ hasText: /pixel/i })).toBeVisible();
  });

  test('should switch avatar style to Geometric', async ({ page }) => {
    await page.getByText('Style').locator('..').locator('[role="combobox"]').click();
    await page.getByRole('option', { name: 'Geometric Patterns' }).click();
    await expect(page.getByRole('combobox').filter({ hasText: /geometric/i })).toBeVisible();
  });

  test('should change size to 512px', async ({ page }) => {
    await page.getByText('Size:').locator('..').locator('[role="combobox"]').click();
    await page.getByRole('option', { name: '512px' }).click();
    await expect(page.getByText('512x512px')).toBeVisible();
  });

  test('should show download button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Download PNG/i })).toBeVisible();
  });

  test('should show background color input', async ({ page }) => {
    await expect(page.getByLabel('Background Color')).toBeVisible();
  });
});
