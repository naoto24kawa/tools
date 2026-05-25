import { test, expect } from '@playwright/test';

test.describe('和暦変換 (Wareki Converter)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/datetime-wareki');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /和暦変換/i })).toBeVisible();
  });

  test('should convert 2019-05-01 to Reiwa 1', async ({ page }) => {
    const yearInput = page.locator('#wareki-year');
    const monthInput = page.locator('#wareki-month');
    const dayInput = page.locator('#wareki-day');
    await yearInput.fill('2019');
    await monthInput.fill('5');
    await dayInput.fill('1');
    // 2019-05-01 is the first day of Reiwa
    // "令和" appears in dropdown options and era list too; use first()
    await expect(page.getByText(/令和/).first()).toBeVisible();
    await expect(page.getByText(/令和1年|令和元年/)).toBeVisible();
  });

  test('should convert 2024 (Reiwa 6)', async ({ page }) => {
    const yearInput = page.locator('#wareki-year');
    await yearInput.fill('2024');
    // "令和" appears in dropdown options and era list too; use first()
    await expect(page.getByText(/令和/).first()).toBeVisible();
    await expect(page.getByText(/令和6年/)).toBeVisible();
  });

  test('should convert Reiwa 1 to Seireki 2019', async ({ page }) => {
    const eraSelect = page.locator('#era-select');
    const eraYearInput = page.locator('#era-year');
    await eraSelect.selectOption('令和');
    await eraYearInput.fill('1');
    await expect(page.getByText(/西暦 2019 年/)).toBeVisible();
  });

  test('should convert Showa 64 to 1989', async ({ page }) => {
    const eraSelect = page.locator('#era-select');
    const eraYearInput = page.locator('#era-year');
    await eraSelect.selectOption('昭和');
    await eraYearInput.fill('64');
    await expect(page.getByText(/西暦 1989 年/)).toBeVisible();
  });

  test('should show era list at the bottom', async ({ page }) => {
    await expect(page.getByText('元号一覧')).toBeVisible();
    // Scope era name checks to the era list card to avoid matching dropdown options
    const eraListCard = page.getByText('元号一覧').locator('../..');
    await expect(eraListCard.getByText('令和')).toBeVisible();
    await expect(eraListCard.getByText('昭和')).toBeVisible();
    await expect(eraListCard.getByText('大正')).toBeVisible();
    await expect(eraListCard.getByText('明治')).toBeVisible();
  });
});
