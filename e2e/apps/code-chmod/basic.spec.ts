import { test, expect } from '@playwright/test';

test.describe('Chmod Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/code-chmod');
  });

  test('should display the page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Chmod Calculator/i })).toBeVisible();
  });

  test('should show default octal value 644 on load', async ({ page }) => {
    // DEFAULT_PERMISSIONS: owner rw, group r, others r → 644
    await expect(page.locator('code').filter({ hasText: '644' }).first()).toBeVisible();
  });

  test('should show symbolic notation on load', async ({ page }) => {
    // 644 → rw-r--r--
    await expect(page.locator('code').filter({ hasText: 'rw-r--r--' })).toBeVisible();
  });

  test('should update octal when owner execute is checked', async ({ page }) => {
    // Owner execute checkbox — currently unchecked (default)
    const ownerExec = page.getByLabel('Owner execute');
    await ownerExec.check();
    // Owner: rwx, Group: r, Others: r → 744
    await expect(page.locator('code').filter({ hasText: '744' }).first()).toBeVisible();
  });

  test('should update octal when all permissions are unchecked', async ({ page }) => {
    // Uncheck owner read and owner write (both checked by default)
    await page.getByLabel('Owner read').uncheck();
    await page.getByLabel('Owner write').uncheck();
    // owner: ---, group: r--, others: r-- → 044
    await expect(page.locator('code').filter({ hasText: '044' }).first()).toBeVisible();
  });

  test('should apply preset mode 755 from common modes', async ({ page }) => {
    await page.getByRole('button', { name: /755/ }).click();
    await expect(page.locator('code').filter({ hasText: '755' }).first()).toBeVisible();
  });

  test('should apply preset mode 777 from common modes', async ({ page }) => {
    await page.getByRole('button', { name: /777/ }).click();
    await expect(page.locator('code').filter({ hasText: '777' }).first()).toBeVisible();
    await expect(page.locator('code').filter({ hasText: 'rwxrwxrwx' })).toBeVisible();
  });

  test('should apply preset mode 600 from common modes', async ({ page }) => {
    await page.getByRole('button', { name: /600/ }).click();
    await expect(page.locator('code').filter({ hasText: '600' }).first()).toBeVisible();
  });

  test('should show chmod command text', async ({ page }) => {
    await expect(page.locator('code').filter({ hasText: /chmod \d{3}/ })).toBeVisible();
  });

  test('should update from direct octal input', async ({ page }) => {
    const octalInput = page.getByLabel('直接入力:').or(page.locator('#octal-input'));
    await octalInput.fill('777');
    await expect(page.locator('code').filter({ hasText: 'rwxrwxrwx' })).toBeVisible();
  });
});
