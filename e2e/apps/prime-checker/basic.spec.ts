import { test, expect } from '@playwright/test';

test.describe('Prime Checker', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/prime-checker');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Prime Checker' })).toBeVisible();
  });

  test('should identify 7 as prime', async ({ page }) => {
    await page.locator('input#check-input').fill('7');
    await page.getByRole('button', { name: 'Check', exact: true }).click();
    await expect(page.getByText('Prime', { exact: true })).toBeVisible();
    // Should NOT show "Not Prime"
    await expect(page.getByText('Not Prime')).not.toBeVisible();
  });

  test('should identify 8 as not prime', async ({ page }) => {
    await page.locator('input#check-input').fill('8');
    await page.getByRole('button', { name: 'Check', exact: true }).click();
    await expect(page.getByText('Not Prime')).toBeVisible();
  });

  test('should show prime factorization for composite numbers', async ({ page }) => {
    await page.locator('input#check-input').fill('12');
    await page.getByRole('button', { name: 'Check', exact: true }).click();
    await expect(page.getByText('Prime Factorization')).toBeVisible();
    // 12 = 2^2 × 3
    await expect(page.getByText(/12 =/)).toBeVisible();
  });

  test('should show error for out-of-range input', async ({ page }) => {
    await page.locator('input#check-input').fill('1');
    await page.getByRole('button', { name: 'Check', exact: true }).click();
    await expect(page.getByRole('alert')).toBeVisible();
  });

  test('should switch to Sieve tab and generate primes', async ({ page }) => {
    await page.getByRole('button', { name: 'Sieve' }).click();
    await page.locator('input#sieve-input').fill('20');
    await page.getByRole('button', { name: 'Generate' }).click();
    // Primes up to 20: 2, 3, 5, 7, 11, 13, 17, 19
    await expect(page.getByText('Found 8 primes')).toBeVisible();
    await expect(page.getByText('2')).toBeVisible();
  });

  test('should switch to Nth Prime tab and find 5th prime (11)', async ({ page }) => {
    await page.getByRole('button', { name: 'Nth Prime' }).click();
    await page.locator('input#nth-input').fill('5');
    await page.getByRole('button', { name: 'Find' }).click();
    await expect(page.getByText('11')).toBeVisible();
  });
});
