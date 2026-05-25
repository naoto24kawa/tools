import { test, expect } from '@playwright/test';

test.describe('Random Dice Roller', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/random-dice');
  });

  test('should load page', async ({ page }) => {
    await expect(page).toHaveTitle(/Dice Roller/i);
    await expect(page.getByRole('heading', { name: /Dice Roller/i })).toBeVisible();
  });

  test('should show dice face selector buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'd6' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'd20' })).toBeVisible();
  });

  test('should show count input and Roll button', async ({ page }) => {
    await expect(page.getByLabel('個数')).toBeVisible();
    await expect(page.getByRole('button', { name: /Roll/i })).toBeVisible();
  });

  test('should roll dice and show results', async ({ page }) => {
    await page.getByRole('button', { name: /Roll/i }).click();
    // Results section appears with total
    await expect(page.getByText('合計')).toBeVisible();
    await expect(page.getByText('最小')).toBeVisible();
    await expect(page.getByText('最大')).toBeVisible();
    await expect(page.getByText('平均')).toBeVisible();
  });

  test('should roll with d6 and produce values 1-6', async ({ page }) => {
    // Select d6 (default) and roll 1 die
    await page.getByLabel('個数').fill('1');
    await page.getByRole('button', { name: /Roll/i }).click();
    // The total should be a number between 1 and 6
    const totalEl = page.locator('.text-2xl.font-bold').first();
    const totalText = await totalEl.textContent();
    const total = parseInt(totalText ?? '0', 10);
    expect(total).toBeGreaterThanOrEqual(1);
    expect(total).toBeLessThanOrEqual(6);
  });

  test('should switch to d20 dice', async ({ page }) => {
    await page.getByRole('button', { name: 'd20' }).click();
    // Roll button label should update to reflect d20
    await expect(page.getByRole('button', { name: /1d20/i })).toBeVisible();
  });

  test('should roll multiple dice and show individual values', async ({ page }) => {
    await page.getByLabel('個数').fill('3');
    await page.getByRole('button', { name: /Roll/i }).click();
    // Three dice value boxes should appear
    const diceBoxes = page.locator('.w-12.h-12.rounded-lg');
    await expect(diceBoxes).toHaveCount(3);
  });

  test('should add to history on subsequent rolls', async ({ page }) => {
    await page.getByRole('button', { name: /Roll/i }).click();
    await page.getByRole('button', { name: /Roll/i }).click();
    // History section appears after 2+ rolls
    await expect(page.getByText('履歴')).toBeVisible();
  });
});
