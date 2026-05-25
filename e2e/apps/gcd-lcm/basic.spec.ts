import { test, expect } from '@playwright/test';

test.describe('GCD LCM Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/gcd-lcm');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page).toHaveTitle(/GCD.*LCM/i);
    await expect(page.getByText('GCD / LCM Calculator')).toBeVisible();
  });

  test('should show input field and Calculate button', async ({ page }) => {
    await expect(page.locator('#numbers-input')).toBeVisible();
    await expect(page.getByRole('button', { name: /calculate/i })).toBeVisible();
  });

  test('should calculate GCD and LCM of 12 and 8', async ({ page }) => {
    await page.locator('#numbers-input').fill('12, 8');
    await page.getByRole('button', { name: /calculate/i }).click();

    await expect(page.getByText('GCD (Greatest Common Divisor)')).toBeVisible();
    await expect(page.getByText('LCM (Least Common Multiple)')).toBeVisible();
    // GCD(12, 8) = 4
    await expect(page.locator('.font-mono.font-bold').filter({ hasText: '4' }).first()).toBeVisible();
    // LCM(12, 8) = 24
    await expect(page.locator('.font-mono.font-bold').filter({ hasText: '24' })).toBeVisible();
  });

  test('should calculate GCD and LCM with spaces as separator', async ({ page }) => {
    await page.locator('#numbers-input').fill('12 8');
    await page.getByRole('button', { name: /calculate/i }).click();

    await expect(page.locator('.font-mono.font-bold').filter({ hasText: '4' }).first()).toBeVisible();
    await expect(page.locator('.font-mono.font-bold').filter({ hasText: '24' })).toBeVisible();
  });

  test('should show Euclidean Algorithm Steps for two numbers', async ({ page }) => {
    await page.locator('#numbers-input').fill('12, 8');
    await page.getByRole('button', { name: /calculate/i }).click();

    await expect(page.getByText('Euclidean Algorithm Steps')).toBeVisible();
    await expect(page.getByText(/GCD = 4/)).toBeVisible();
  });

  test('should calculate GCD of 18, 24, 36 as 6', async ({ page }) => {
    await page.locator('#numbers-input').fill('18, 24, 36');
    await page.getByRole('button', { name: /calculate/i }).click();

    await expect(page.locator('.font-mono.font-bold').filter({ hasText: '6' }).first()).toBeVisible();
  });

  test('should calculate via Enter key press', async ({ page }) => {
    await page.locator('#numbers-input').fill('12, 8');
    await page.locator('#numbers-input').press('Enter');

    await expect(page.getByText('GCD (Greatest Common Divisor)')).toBeVisible();
  });

  test('should show error for invalid input', async ({ page }) => {
    await page.locator('#numbers-input').fill('abc');
    await page.getByRole('button', { name: /calculate/i }).click();

    await expect(page.getByRole('alert')).toBeVisible();
  });

  test('should show Copy buttons for GCD and LCM results', async ({ page }) => {
    await page.locator('#numbers-input').fill('12, 8');
    await page.getByRole('button', { name: /calculate/i }).click();

    const copyButtons = page.getByRole('button', { name: /copy/i });
    await expect(copyButtons).toHaveCount(2);
  });
});
