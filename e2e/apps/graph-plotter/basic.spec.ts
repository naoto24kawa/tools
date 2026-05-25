import { test, expect } from '@playwright/test';

test.describe('Graph Plotter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/graph-plotter');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText(/Graph Plotter/i)).toBeVisible();
  });

  test('should render canvas for the graph', async ({ page }) => {
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
  });

  test('should display default expression x^2', async ({ page }) => {
    const expressionInput = page.getByPlaceholder(/e\.g\. x\^2/i);
    await expect(expressionInput).toHaveValue('x^2');
  });

  test('should update expression and reflect legend', async ({ page }) => {
    const expressionInput = page.getByPlaceholder(/e\.g\. x\^2/i);
    await expressionInput.clear();
    await expressionInput.fill('sin(x)');
    await expect(page.getByText('y = sin(x)')).toBeVisible();
  });

  test('should add a new function when clicking Add Function', async ({ page }) => {
    await page.getByRole('button', { name: /add function/i }).click();
    const expressionInputs = page.getByPlaceholder(/e\.g\. x\^2/i);
    await expect(expressionInputs).toHaveCount(2);
  });

  test('should show range controls with X Min / X Max labels', async ({ page }) => {
    await expect(page.getByLabel('X Min')).toBeVisible();
    await expect(page.getByLabel('X Max')).toBeVisible();
    await expect(page.getByLabel('Y Min')).toBeVisible();
    await expect(page.getByLabel('Y Max')).toBeVisible();
  });

  test('should reset range to defaults when clicking Reset', async ({ page }) => {
    await page.getByLabel('X Min').fill('-20');
    await page.getByRole('button', { name: /reset/i }).click();
    await expect(page.getByLabel('X Min')).toHaveValue('-10');
    await expect(page.getByLabel('X Max')).toHaveValue('10');
  });

  test('should show error for invalid expression', async ({ page }) => {
    const expressionInput = page.getByPlaceholder(/e\.g\. x\^2/i);
    await expressionInput.clear();
    await expressionInput.fill('invalid%%%');
    await expect(page.getByRole('alert')).toBeVisible();
  });
});
