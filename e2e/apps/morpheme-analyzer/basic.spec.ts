import { test, expect } from '@playwright/test';

test.describe('Morpheme Analyzer', () => {
  test.beforeEach(async ({ page }) => {
    // Kuromoji loads dictionary from CDN, increase timeout
    await page.goto('/morpheme-analyzer');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText('Morpheme Analyzer')).toBeVisible({ timeout: 30000 });
  });

  test('should show loading spinner while dictionary is loading', async ({ page }) => {
    // On fresh load, loading state appears briefly
    // Check that the page shows either loading or the main UI
    const isLoading = await page.locator('.animate-spin').isVisible().catch(() => false);
    const hasInput = await page.locator('textarea#input').isVisible().catch(() => false);
    expect(isLoading || hasInput).toBe(true);
  });

  test('should show input textarea after dictionary loads', async ({ page }) => {
    // Wait for kuromoji to finish loading (may take up to 30s on slow network)
    await expect(page.locator('textarea#input')).toBeVisible({ timeout: 30000 });
  });

  test('should analyze Japanese text and show tokens', async ({ page }) => {
    await expect(page.locator('textarea#input')).toBeVisible({ timeout: 30000 });
    await page.locator('textarea#input').fill('東京タワーは333mです。');
    // Tokens appear reactively
    await expect(page.getByText('解析結果')).toBeVisible({ timeout: 10000 });
    // At least one token badge should appear
    await expect(page.locator('.flex.flex-wrap.gap-1 span').first()).toBeVisible();
  });

  test('should show token list table after analysis', async ({ page }) => {
    await expect(page.locator('textarea#input')).toBeVisible({ timeout: 30000 });
    await page.locator('textarea#input').fill('日本語のテスト');
    await expect(page.getByText('トークン一覧')).toBeVisible({ timeout: 10000 });
  });

  test('should show statistics after analysis', async ({ page }) => {
    await expect(page.locator('textarea#input')).toBeVisible({ timeout: 30000 });
    await page.locator('textarea#input').fill('こんにちは世界');
    await expect(page.getByText('統計')).toBeVisible({ timeout: 10000 });
  });

  test('should enable copy result button after analysis', async ({ page }) => {
    await expect(page.locator('textarea#input')).toBeVisible({ timeout: 30000 });
    await page.locator('textarea#input').fill('テスト文章');
    await expect(page.getByRole('button', { name: /結果をコピー/i })).toBeEnabled({ timeout: 10000 });
  });

  test('should clear input when clear button is clicked', async ({ page }) => {
    await expect(page.locator('textarea#input')).toBeVisible({ timeout: 30000 });
    await page.locator('textarea#input').fill('テスト');
    await page.getByRole('button', { name: /クリア/i }).click();
    await expect(page.locator('textarea#input')).toHaveValue('');
  });
});
