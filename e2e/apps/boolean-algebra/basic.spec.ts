import { test, expect } from '@playwright/test';

test.describe('Boolean Algebra Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/boolean-algebra');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Boolean Algebra/i);
  });

  test('should display main heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Boolean Algebra Calculator' })).toBeVisible();
  });

  test('should show expression input with default value', async ({ page }) => {
    const input = page.getByLabel('Boolean Expression');
    await expect(input).toBeVisible();
    await expect(input).toHaveValue('A & B | !C');
  });

  test('should generate truth table for A AND B', async ({ page }) => {
    await page.getByLabel('Boolean Expression').fill('A & B');
    await page.getByRole('button', { name: /Generate Truth Table/i }).click();

    // Should show truth table with A, B, Result columns
    await expect(page.getByText('A', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('B', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Result')).toBeVisible();

    // A AND B: 4 rows
    await expect(page.getByText('4 rows')).toBeVisible();
  });

  test('should generate correct truth table for A AND B', async ({ page }) => {
    await page.getByLabel('Boolean Expression').fill('A & B');
    await page.getByRole('button', { name: /Generate Truth Table/i }).click();

    const table = page.locator('table');
    await expect(table).toBeVisible();

    // A=0,B=0 => 0; A=0,B=1 => 0; A=1,B=0 => 0; A=1,B=1 => 1
    const rows = table.locator('tbody tr');
    await expect(rows).toHaveCount(4);
  });

  test('should use A OR B preset button', async ({ page }) => {
    await page.getByRole('button', { name: 'A OR B' }).click();
    await expect(page.getByLabel('Boolean Expression')).toHaveValue('A | B');
  });

  test('should use A XOR B preset button', async ({ page }) => {
    await page.getByRole('button', { name: 'A XOR B' }).click();
    await expect(page.getByLabel('Boolean Expression')).toHaveValue('A ^ B');
  });

  test('should use Complex preset button', async ({ page }) => {
    await page.getByRole('button', { name: 'Complex' }).click();
    await expect(page.getByLabel('Boolean Expression')).toHaveValue('(A & B) | (!A & C)');
  });

  test('should generate truth table on Enter key', async ({ page }) => {
    await page.getByLabel('Boolean Expression').fill('A & B');
    await page.getByLabel('Boolean Expression').press('Enter');
    await expect(page.getByText('4 rows')).toBeVisible();
  });

  test('should show simplified expression after evaluation', async ({ page }) => {
    await page.getByLabel('Boolean Expression').fill('A & B');
    await page.getByRole('button', { name: /Generate Truth Table/i }).click();
    await expect(page.getByText('Simplified Expression')).toBeVisible();
  });

  test('should show logic gate diagram after evaluation', async ({ page }) => {
    await page.getByLabel('Boolean Expression').fill('A & B');
    await page.getByRole('button', { name: /Generate Truth Table/i }).click();
    await expect(page.getByText('Logic Gate Diagram')).toBeVisible();
    await expect(page.locator('svg').last()).toBeVisible();
  });

  test('should show error for invalid expression', async ({ page }) => {
    await page.getByLabel('Boolean Expression').fill('A &&& B');
    await page.getByRole('button', { name: /Generate Truth Table/i }).click();
    await expect(page.getByText('Invalid expression', { exact: true })).toBeVisible();
  });

  test('should show copy table button after evaluation', async ({ page }) => {
    await page.getByLabel('Boolean Expression').fill('A & B');
    await page.getByRole('button', { name: /Generate Truth Table/i }).click();
    await expect(page.getByRole('button', { name: /Copy Table/i })).toBeVisible();
  });
});
