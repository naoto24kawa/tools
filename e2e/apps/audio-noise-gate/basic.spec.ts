import { test, expect } from '@playwright/test';

test.describe('Audio Noise Gate', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/audio-noise-gate');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page).toHaveTitle(/Audio Noise Gate/i);
    await expect(page.getByRole('heading', { name: 'Audio Noise Gate' })).toBeVisible();
  });

  test('should show file selection card', async ({ page }) => {
    // Japanese: ファイル選択
    await expect(page.locator('text=ファイル選択')).toBeVisible();
  });

  test('should show audio file input', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeVisible();
    const accept = await fileInput.getAttribute('accept');
    expect(accept).toBe('audio/*');
  });

  test('should show noise gate settings card', async ({ page }) => {
    // Japanese: ノイズゲート設定
    await expect(page.locator('text=ノイズゲート設定')).toBeVisible();
  });

  test('should show threshold slider with label', async ({ page }) => {
    // Japanese: スレッショルド
    await expect(page.locator('text=スレッショルド')).toBeVisible();
    await expect(page.locator('input[aria-label="スレッショルド (dB)"]')).toBeVisible();
  });

  test('should show attack input', async ({ page }) => {
    // Japanese: アタック
    await expect(page.locator('text=アタック')).toBeVisible();
  });

  test('should show release input', async ({ page }) => {
    // Japanese: リリース
    await expect(page.locator('text=リリース')).toBeVisible();
  });

  test('should show filter settings card', async ({ page }) => {
    // Japanese: フィルター設定
    await expect(page.locator('text=フィルター設定')).toBeVisible();
  });

  test('should show highpass filter input', async ({ page }) => {
    // Japanese: ハイパスフィルタ
    await expect(page.locator('text=ハイパスフィルタ')).toBeVisible();
  });

  test('should show lowpass filter input', async ({ page }) => {
    // Japanese: ローパスフィルタ
    await expect(page.getByText('ローパスフィルタ (Hz)')).toBeVisible();
  });

  test('should have process button disabled without file', async ({ page }) => {
    // Japanese: 処理実行
    const processButton = page.getByRole('button', { name: '処理実行' });
    await expect(processButton).toBeDisabled();
  });

  test('should have reset button', async ({ page }) => {
    // Japanese: リセット
    await expect(page.getByRole('button', { name: 'リセット' })).toBeVisible();
  });

  test('should update threshold display when slider changes', async ({ page }) => {
    const slider = page.locator('input[aria-label="スレッショルド (dB)"]');
    await slider.fill('-40');
    await expect(page.locator('text=-40 dB')).toBeVisible();
  });
});
