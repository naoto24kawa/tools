import { test, expect } from '@playwright/test';

test.describe('Audio Visualizer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/audio-visualizer');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Audio Visualizer/i);
  });

  test('should display main heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Audio Visualizer' })).toBeVisible();
  });

  test('should show file input and mic button', async ({ page }) => {
    await expect(page.getByLabel(/オーディオファイル/)).toBeVisible();
    await expect(page.getByRole('button', { name: /マイク入力/ })).toBeVisible();
  });

  test('should show display settings section', async ({ page }) => {
    await expect(page.getByText('表示設定')).toBeVisible();
    await expect(page.getByText('表示モード')).toBeVisible();
    await expect(page.getByText('カラースキーム')).toBeVisible();
  });

  test('should show waveform canvas by default', async ({ page }) => {
    await expect(page.getByText('Waveform')).toBeVisible();
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible();
  });

  test('should show play and stop buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: '再生' })).toBeVisible();
    await expect(page.getByRole('button', { name: '停止' })).toBeVisible();
  });

  test('play button should be disabled without audio loaded', async ({ page }) => {
    const playButton = page.getByRole('button', { name: '再生' });
    await expect(playButton).toBeDisabled();
  });

  test('stop button should be disabled when not playing', async ({ page }) => {
    const stopButton = page.getByRole('button', { name: '停止' });
    await expect(stopButton).toBeDisabled();
  });

  test('should switch view mode to spectrum only', async ({ page }) => {
    // Open view mode select
    await page.getByText('表示モード').locator('..').locator('[role="combobox"]').click();
    await page.getByRole('option', { name: 'Spectrum', exact: true }).click();
    await expect(page.getByText('Frequency Spectrum')).toBeVisible();
    await expect(page.getByText('Waveform')).not.toBeVisible();
  });

  test('should switch view mode to both', async ({ page }) => {
    await page.getByText('表示モード').locator('..').locator('[role="combobox"]').click();
    await page.getByRole('option', { name: /Both|両方/i }).click();
    await expect(page.getByText('Waveform')).toBeVisible();
    await expect(page.getByText('Frequency Spectrum')).toBeVisible();
  });
});
