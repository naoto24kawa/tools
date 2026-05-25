import { test, expect } from '@playwright/test';

test.describe('Decision Wheel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/decision-wheel');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText('Decision Wheel')).toBeVisible();
  });

  test('should show canvas wheel', async ({ page }) => {
    await expect(page.locator('canvas')).toBeVisible();
  });

  test('should have default choices pre-filled', async ({ page }) => {
    const textarea = page.locator('textarea#choices');
    const value = await textarea.inputValue();
    expect(value).toContain('Option A');
    expect(value).toContain('Option B');
    expect(value).toContain('Option C');
  });

  test('should show Spin button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Spin!/i })).toBeVisible();
  });

  test('should allow adding custom choices', async ({ page }) => {
    const textarea = page.locator('textarea#choices');
    await textarea.fill('Pizza\nSushi\nBurger');
    await expect(page.getByText('Pizza')).toBeVisible();
    await expect(page.getByText('Sushi')).toBeVisible();
    await expect(page.getByText('Burger')).toBeVisible();
  });

  test('should show color pickers for each segment', async ({ page }) => {
    const textarea = page.locator('textarea#choices');
    await textarea.fill('Option A\nOption B');
    const colorInputs = page.locator('input[type="color"]');
    await expect(colorInputs).toHaveCount(2);
  });

  test('should disable Spin button when fewer than 2 choices', async ({ page }) => {
    const textarea = page.locator('textarea#choices');
    await textarea.fill('OnlyOne');
    await expect(page.getByRole('button', { name: /Spin!/i })).toBeDisabled();
  });

  test('should enable Spin button with 2 or more choices', async ({ page }) => {
    const textarea = page.locator('textarea#choices');
    await textarea.fill('Choice A\nChoice B');
    await expect(page.getByRole('button', { name: /Spin!/i })).toBeEnabled();
  });

  test('should show spinning state when Spin is clicked', async ({ page }) => {
    const spinBtn = page.getByRole('button', { name: /Spin!/i });
    await spinBtn.click();
    // Button text changes to Spinning...
    await expect(page.getByRole('button', { name: /Spinning/i })).toBeVisible();
  });
});
