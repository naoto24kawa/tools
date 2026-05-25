import { test, expect } from '@playwright/test';

test.describe('Audio Merge', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/audio-merge');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page).toHaveTitle(/Audio Merge/i);
    await expect(page.getByRole('heading', { name: 'Audio Merge' })).toBeVisible();
  });

  test('should show file addition card', async ({ page }) => {
    // Japanese: ファイル追加
    await expect(page.locator('text=ファイル追加')).toBeVisible();
  });

  test('should show file input accepting multiple audio files', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeVisible();
    const accept = await fileInput.getAttribute('accept');
    expect(accept).toBe('audio/*');
    const multiple = await fileInput.getAttribute('multiple');
    expect(multiple).not.toBeNull();
  });

  test('should show merge settings card', async ({ page }) => {
    // Japanese: 結合設定
    await expect(page.locator('text=結合設定')).toBeVisible();
  });

  test('should show gap seconds input', async ({ page }) => {
    // Japanese: ギャップ
    await expect(page.locator('text=ギャップ')).toBeVisible();
  });

  test('should show crossfade seconds input', async ({ page }) => {
    // Japanese: クロスフェード
    await expect(page.locator('text=クロスフェード')).toBeVisible();
  });

  test('should show output sample rate selector', async ({ page }) => {
    // Japanese: 出力サンプルレート
    await expect(page.locator('text=出力サンプルレート')).toBeVisible();
  });

  test('should have merge button disabled without files', async ({ page }) => {
    // Japanese: 結合
    const mergeButton = page.getByRole('button', { name: '結合' });
    await expect(mergeButton).toBeDisabled();
  });

  test('should have clear button', async ({ page }) => {
    // Japanese: クリア
    await expect(page.getByRole('button', { name: 'クリア' })).toBeVisible();
  });

  test('should not show track list when no files added', async ({ page }) => {
    // Track list section should not appear before files are loaded
    await expect(page.locator('text=トラック一覧')).not.toBeVisible();
  });
});
