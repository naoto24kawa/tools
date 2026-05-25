import { test, expect } from '@playwright/test';

test.describe('Password Strength Checker', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/password-strength');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText(/Password Strength Checker/i)).toBeVisible();
  });

  test('should show password input', async ({ page }) => {
    await expect(page.locator('#password')).toBeVisible();
  });

  test('should not show strength meter before any input', async ({ page }) => {
    await expect(page.getByText(/Strength/)).not.toBeVisible();
  });

  test('should display strength meter after typing', async ({ page }) => {
    await page.locator('#password').fill('abc');
    await expect(page.getByText(/Strength/)).toBeVisible();
  });

  test('should label a short simple password as Very Weak or Weak', async ({ page }) => {
    await page.locator('#password').fill('abc');
    const label = page.getByText(/Very Weak|Weak/i);
    await expect(label).toBeVisible();
  });

  test('should label a strong password with mixed chars as Strong or Very Strong', async ({ page }) => {
    await page.locator('#password').fill('C0mpl3x!Pass#99');
    await expect(page.getByText(/Strong|Very Strong/i)).toBeVisible();
  });

  test('should show entropy value', async ({ page }) => {
    await page.locator('#password').fill('TestPassword1!');
    await expect(page.getByText(/bits/i)).toBeVisible();
  });

  test('should show estimated crack time', async ({ page }) => {
    await page.locator('#password').fill('TestPassword1!');
    await expect(page.getByText(/Estimated Crack Time/i)).toBeVisible();
  });

  test('should show criteria checklist', async ({ page }) => {
    await page.locator('#password').fill('Test');
    await expect(page.getByText(/Minimum 8 characters/i)).toBeVisible();
    await expect(page.getByText(/Uppercase letters/i)).toBeVisible();
    await expect(page.getByText(/Lowercase letters/i)).toBeVisible();
    await expect(page.getByText(/Numbers/i)).toBeVisible();
    await expect(page.getByText(/Special characters/i)).toBeVisible();
  });

  test('should toggle password visibility when Show/Hide is clicked', async ({ page }) => {
    const input = page.locator('#password');
    await input.fill('mysecret');
    await expect(input).toHaveAttribute('type', 'password');
    await page.getByRole('button', { name: /Show/i }).click();
    await expect(input).toHaveAttribute('type', 'text');
    await page.getByRole('button', { name: /Hide/i }).click();
    await expect(input).toHaveAttribute('type', 'password');
  });
});
