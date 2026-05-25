import { test, expect } from '@playwright/test';

test.describe('Crontab Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/datetime-crontab');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Crontab Generator/i })).toBeVisible();
  });

  test('should show default cron expression "0 * * * *" on load', async ({ page }) => {
    // DEFAULT_CRON: minute=0, hour=*, rest=*  → "0 * * * *"
    await expect(page.getByText('0 * * * *')).toBeVisible();
  });

  test('should show description for default cron', async ({ page }) => {
    // Default "0 * * * *" → "0分 毎時"
    await expect(page.getByText(/0分/)).toBeVisible();
    await expect(page.getByText(/毎時/)).toBeVisible();
  });

  test('should update cron expression when fields are changed', async ({ page }) => {
    const minuteInput = page.locator('#cron-minute');
    await minuteInput.fill('30');
    await expect(page.getByText('30 * * * *')).toBeVisible();
  });

  test('should apply preset "毎分" and show "* * * * *"', async ({ page }) => {
    await page.getByRole('button', { name: /毎分/ }).click();
    await expect(page.getByText('* * * * *')).toBeVisible();
    await expect(page.getByText(/毎分/)).toBeVisible();
  });

  test('should apply preset "毎日 0:00" and show "0 0 * * *"', async ({ page }) => {
    await page.getByRole('button', { name: /毎日 0:00/ }).click();
    await expect(page.getByText('0 0 * * *')).toBeVisible();
  });

  test('should parse cron expression entered in the parse input', async ({ page }) => {
    const parseInput = page.locator('#cron-parse-input');
    await parseInput.fill('*/5 * * * *');
    await parseInput.press('Enter');
    await expect(page.getByText('*/5 * * * *')).toBeVisible();
    // Description: "5分ごと 毎時"
    await expect(page.getByText(/5分ごと/)).toBeVisible();
  });

  test('should show copy button for cron expression', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Cron式をコピー/i })).toBeVisible();
  });
});
