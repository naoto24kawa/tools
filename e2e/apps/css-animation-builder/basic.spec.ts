import { test, expect } from '@playwright/test';

test.describe('CSS Animation Builder', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/css-animation-builder');
  });

  test('should load page with heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /css animation builder/i })).toBeVisible();
  });

  test('should show Animation Settings section', async ({ page }) => {
    await expect(page.getByText('Animation Settings')).toBeVisible();
  });

  test('should show Keyframes section with Add button', async ({ page }) => {
    await expect(page.getByText('Keyframes')).toBeVisible();
    await expect(page.getByRole('button', { name: /add/i })).toBeVisible();
  });

  test('should have default keyframes at 0% and 100%', async ({ page }) => {
    // Two keyframe cards should exist by default
    const percentageInputs = page.locator('input[type="number"][min="0"][max="100"]');
    await expect(percentageInputs.first()).toHaveValue('0');
    await expect(percentageInputs.nth(1)).toHaveValue('100');
  });

  test('should show Live Preview with animated element', async ({ page }) => {
    await expect(page.getByText('Live Preview')).toBeVisible();
    // Preview element with letter "A"
    await expect(page.getByText('A')).toBeVisible();
  });

  test('should show Generated CSS section', async ({ page }) => {
    await expect(page.getByText('Generated CSS')).toBeVisible();
    // CSS code block should contain @keyframes
    await expect(page.locator('pre code')).toContainText('@keyframes');
  });

  test('should show animation name input and update CSS', async ({ page }) => {
    const nameInput = page.getByLabel('Name');
    await nameInput.clear();
    await nameInput.fill('myAnimation');
    await expect(page.locator('pre code')).toContainText('myAnimation');
  });

  test('should add a new keyframe when Add button is clicked', async ({ page }) => {
    const before = await page.locator('input[type="number"][min="0"][max="100"]').count();
    await page.getByRole('button', { name: /add/i }).click();
    const after = await page.locator('input[type="number"][min="0"][max="100"]').count();
    expect(after).toBe(before + 1);
  });

  test('should show Copy button and timing function selector', async ({ page }) => {
    await expect(page.getByRole('button', { name: /copy/i })).toBeVisible();
    await expect(page.getByText('Timing Function')).toBeVisible();
  });
});
