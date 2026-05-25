import { test, expect } from '@playwright/test';

test.describe('Password Strength Checker', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/validator-password');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText(/Password Strength Checker/i)).toBeVisible();
  });

  test('should show strength label when password is entered', async ({ page }) => {
    const input = page.locator('input#password');
    await input.fill('abc');
    // A strength label like "Very Weak", "Weak", etc. should appear
    await expect(page.locator('.text-lg.font-bold')).toBeVisible();
  });

  test('should show "weak" strength for a simple short password', async ({ page }) => {
    const input = page.locator('input#password');
    await input.fill('abc');
    // App uses Japanese labels: とても弱い (Very Weak) or 弱い (Weak)
    await expect(page.getByText(/とても弱い|弱い/)).toBeVisible();
  });

  test('should show stronger rating for complex password', async ({ page }) => {
    const input = page.locator('input#password');
    await input.fill('Tr0ub4dor&3#SecurePass!');
    // App uses Japanese labels: 強い (Strong) or とても強い (Very Strong)
    await expect(page.getByText(/強い|とても強い/)).toBeVisible();
  });

  test('should show uppercase check passing', async ({ page }) => {
    const input = page.locator('input#password');
    await input.fill('Password1!');
    // 大文字 check label should appear with green icon
    await expect(page.getByText('大文字')).toBeVisible();
  });

  test('should show number check passing', async ({ page }) => {
    const input = page.locator('input#password');
    await input.fill('Password123');
    await expect(page.getByText('数字')).toBeVisible();
  });

  test('should show symbol check passing', async ({ page }) => {
    const input = page.locator('input#password');
    await input.fill('Password123!');
    await expect(page.getByText('記号')).toBeVisible();
  });

  test('should show entropy in bits', async ({ page }) => {
    const input = page.locator('input#password');
    await input.fill('Password123!');
    await expect(page.getByText(/bits/i)).toBeVisible();
  });

  test('should show time to crack estimate', async ({ page }) => {
    const input = page.locator('input#password');
    await input.fill('Password123!');
    await expect(page.getByText(/推定解読時間/i)).toBeVisible();
  });

  test('should not show analysis when input is empty', async ({ page }) => {
    const input = page.locator('input#password');
    await expect(input).toHaveValue('');
    await expect(page.getByText(/bits/i)).not.toBeVisible();
    await expect(page.getByText(/推定解読時間/i)).not.toBeVisible();
  });

  test('should show improvement suggestions for weak password', async ({ page }) => {
    const input = page.locator('input#password');
    await input.fill('abc');
    await expect(page.getByText(/改善提案/i)).toBeVisible();
  });
});
