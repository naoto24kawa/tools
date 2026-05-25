import { test, expect } from '@playwright/test';

test.describe('Number Kanji Converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/number-kanji');
  });

  test('should load page', async ({ page }) => {
    await expect(page).toHaveTitle(/Kanji Number/i);
    await expect(page.getByRole('heading', { name: /漢数字変換/i })).toBeVisible();
  });

  test('should show number to kanji section', async ({ page }) => {
    await expect(page.getByText(/数値 → 漢数字/)).toBeVisible();
    await expect(page.getByLabel('数値')).toBeVisible();
  });

  test('should convert 12345 to kanji', async ({ page }) => {
    const input = page.getByLabel('数値');
    await input.fill('12345');
    // 一万二千三百四十五
    await expect(page.getByText(/一万二千三百四十五/)).toBeVisible();
  });

  test('should convert 1 to kanji 一', async ({ page }) => {
    const input = page.getByLabel('数値');
    await input.fill('1');
    await expect(page.getByText('一')).toBeVisible();
  });

  test('should convert to daiji when checkbox is checked', async ({ page }) => {
    const checkbox = page.getByLabel(/大字/);
    await checkbox.check();
    const input = page.getByLabel('数値');
    await input.fill('1');
    // 壱 is the daiji for 1
    await expect(page.getByText(/壱/)).toBeVisible();
  });

  test('should show kanji to number section', async ({ page }) => {
    await expect(page.getByText(/漢数字 → 数値/)).toBeVisible();
    await expect(page.getByLabel('漢数字')).toBeVisible();
  });

  test('should convert kanji 一万二千三百四十五 to 12345', async ({ page }) => {
    const kanjiInput = page.getByLabel('漢数字');
    await kanjiInput.fill('一万二千三百四十五');
    await expect(page.getByText('12,345')).toBeVisible();
  });

  test('should show copy button when kanji result is displayed', async ({ page }) => {
    const input = page.getByLabel('数値');
    await input.fill('100');
    await expect(page.getByRole('button', { name: /漢数字をコピー/i })).toBeVisible();
  });
});
