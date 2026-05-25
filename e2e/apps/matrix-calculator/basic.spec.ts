import { test, expect } from '@playwright/test';

test.describe('Matrix Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/matrix-calculator');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Matrix/i);
  });

  test('should show heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Matrix Calculator' })).toBeVisible();
  });

  test('should display operation buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Add (A + B)' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Subtract (A - B)' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Multiply (A x B)' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Transpose (A^T)' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Determinant |A|' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Inverse (A^-1)' })).toBeVisible();
  });

  test('should show Matrix A and Matrix B for addition', async ({ page }) => {
    await expect(page.getByText('Matrix A')).toBeVisible();
    await expect(page.getByText('Matrix B')).toBeVisible();
  });

  test('should add two 2x2 matrices', async ({ page }) => {
    // Cell inputs are in a .grid.gap-1 div; use the rows input ID as anchor
    const matrixASection = page.locator('[id="Matrix A-rows"]').locator('../../../..');
    const cellsA = matrixASection.locator('.grid.gap-1 input[type="number"]');

    // Set Matrix A to [[1,2],[3,4]]
    await cellsA.nth(0).fill('1');
    await cellsA.nth(1).fill('2');
    await cellsA.nth(2).fill('3');
    await cellsA.nth(3).fill('4');

    const matrixBSection = page.locator('[id="Matrix B-rows"]').locator('../../../..');
    const cellsB = matrixBSection.locator('.grid.gap-1 input[type="number"]');
    await cellsB.nth(0).fill('5');
    await cellsB.nth(1).fill('6');
    await cellsB.nth(2).fill('7');
    await cellsB.nth(3).fill('8');

    await page.getByRole('button', { name: 'Calculate' }).click();

    // Result should be [[6,8],[10,12]]
    const resultPre = page.locator('pre').first();
    await expect(resultPre).toContainText('6');
    await expect(resultPre).toContainText('8');
  });

  test('should compute determinant of a 2x2 matrix', async ({ page }) => {
    await page.getByRole('button', { name: 'Determinant |A|' }).click();

    // Matrix B should be hidden for determinant
    await expect(page.getByText('Matrix B')).not.toBeVisible();

    const matrixASection = page.locator('[id="Matrix A-rows"]').locator('../../../..');
    const cellsA = matrixASection.locator('.grid.gap-1 input[type="number"]');
    // [[1,2],[3,4]] → det = 1*4 - 2*3 = -2
    await cellsA.nth(0).fill('1');
    await cellsA.nth(1).fill('2');
    await cellsA.nth(2).fill('3');
    await cellsA.nth(3).fill('4');

    await page.getByRole('button', { name: 'Calculate' }).click();

    const resultPre = page.locator('pre').first();
    await expect(resultPre).toContainText('-2');
  });

  test('should compute transpose of matrix A', async ({ page }) => {
    await page.getByRole('button', { name: 'Transpose (A^T)' }).click();

    // Matrix B should be hidden
    await expect(page.getByText('Matrix B')).not.toBeVisible();

    const matrixASection = page.locator('[id="Matrix A-rows"]').locator('../../../..');
    const cellsA = matrixASection.locator('.grid.gap-1 input[type="number"]');
    // [[1,2],[3,4]] → transpose = [[1,3],[2,4]]
    await cellsA.nth(0).fill('1');
    await cellsA.nth(1).fill('2');
    await cellsA.nth(2).fill('3');
    await cellsA.nth(3).fill('4');

    await page.getByRole('button', { name: 'Calculate' }).click();

    const resultPre = page.locator('pre').first();
    await expect(resultPre).toBeVisible();
    await expect(resultPre).toContainText('1');
    await expect(resultPre).toContainText('3');
  });

  test('should clear matrices', async ({ page }) => {
    const matrixASection = page.locator('[id="Matrix A-rows"]').locator('../../../..');
    const cellsA = matrixASection.locator('.grid.gap-1 input[type="number"]');
    await cellsA.nth(0).fill('99');

    await page.getByRole('button', { name: 'Calculate' }).click();
    await page.getByRole('button', { name: /Clear/ }).click();

    // After clear, cell values should be 0
    await expect(cellsA.nth(0)).toHaveValue('0');
  });

  test('should show copy result button after calculation', async ({ page }) => {
    const matrixASection = page.locator('[id="Matrix A-rows"]').locator('../../../..');
    const cellsA = matrixASection.locator('.grid.gap-1 input[type="number"]');
    await cellsA.nth(0).fill('1');
    await page.getByRole('button', { name: 'Calculate' }).click();

    await expect(page.getByRole('button', { name: /Copy Result/ })).toBeVisible();
  });
});
