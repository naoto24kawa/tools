import { test, expect } from '@playwright/test';

test.describe('Text to Speech', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/text-speech');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Text to Speech' })).toBeVisible();
  });

  test('should show text input area', async ({ page }) => {
    await expect(page.locator('textarea#input')).toBeVisible();
  });

  test('should show voice selector', async ({ page }) => {
    await expect(page.locator('select#voice')).toBeVisible();
  });

  test('should show speed and pitch sliders', async ({ page }) => {
    await expect(page.locator('input#rate')).toBeVisible();
    await expect(page.locator('input#pitch')).toBeVisible();
  });

  test('should show speed label with default value', async ({ page }) => {
    await expect(page.getByText('Speed: 1.0x')).toBeVisible();
  });

  test('should show pitch label with default value', async ({ page }) => {
    await expect(page.getByText('Pitch: 1.0')).toBeVisible();
  });

  test('should disable Play button when input is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /play/i })).toBeDisabled();
  });

  test('should enable Play button when text is entered', async ({ page }) => {
    await page.locator('textarea#input').fill('Hello, this is a test.');
    await expect(page.getByRole('button', { name: /play/i })).toBeEnabled();
  });

  test('should show Stop button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /stop/i })).toBeVisible();
  });

  test('should disable Stop button when idle', async ({ page }) => {
    await expect(page.getByRole('button', { name: /stop/i })).toBeDisabled();
  });

  test('should update speed label when slider is changed', async ({ page }) => {
    const rateSlider = page.locator('input#rate');
    await rateSlider.fill('1.5');
    await rateSlider.dispatchEvent('input');
    await expect(page.getByText('Speed: 1.5x')).toBeVisible();
  });

  test('should update pitch label when slider is changed', async ({ page }) => {
    const pitchSlider = page.locator('input#pitch');
    await pitchSlider.fill('0.5');
    await pitchSlider.dispatchEvent('input');
    await expect(page.getByText('Pitch: 0.5')).toBeVisible();
  });
});
