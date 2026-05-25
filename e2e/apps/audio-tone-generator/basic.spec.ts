import { test, expect } from '@playwright/test';

test.describe('Audio Tone Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/audio-tone-generator');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page).toHaveTitle(/Audio Tone Generator/i);
    await expect(page.getByRole('heading', { name: 'Audio Tone Generator' })).toBeVisible();
  });

  test('should show Tone Settings card', async ({ page }) => {
    await expect(page.getByText('Tone Settings')).toBeVisible();
  });

  test('should show frequency slider and input', async ({ page }) => {
    await expect(page.locator('input[aria-label="Frequency slider"]')).toBeVisible();
    await expect(page.locator('#frequency')).toBeVisible();
  });

  test('should show default frequency value', async ({ page }) => {
    const freqInput = page.locator('#frequency');
    const value = await freqInput.inputValue();
    const freq = parseInt(value);
    expect(freq).toBeGreaterThan(0);
  });

  test('should show waveform selector', async ({ page }) => {
    await expect(page.getByText('Waveform')).toBeVisible();
    await expect(page.locator('[role="combobox"]')).toBeVisible();
  });

  test('should show duration slider', async ({ page }) => {
    await expect(page.locator('#duration[type="range"]')).toBeVisible();
  });

  test('should show volume slider', async ({ page }) => {
    await expect(page.locator('#volume[type="range"]')).toBeVisible();
  });

  test('should show Play button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /play/i })).toBeVisible();
  });

  test('should show preset frequency buttons', async ({ page }) => {
    await expect(page.getByText('Presets')).toBeVisible();
    await expect(page.getByRole('button', { name: /A4 \(440Hz\)/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Middle C/i })).toBeVisible();
    await expect(page.getByRole('button', { name: '1kHz' })).toBeVisible();
  });

  test('should update frequency when preset is clicked', async ({ page }) => {
    await page.getByRole('button', { name: /A4 \(440Hz\)/i }).click();
    const freqInput = page.locator('#frequency');
    await expect(freqInput).toHaveValue('440');
  });

  test('should update frequency to Middle C preset', async ({ page }) => {
    await page.getByRole('button', { name: /Middle C/i }).click();
    const freqInput = page.locator('#frequency');
    await expect(freqInput).toHaveValue('261');
  });

  test('should show frequency note name', async ({ page }) => {
    // "Frequency: XXX Hz - NoteA4" style label should be visible
    await expect(page.locator('label[for="frequency"]')).toContainText('Hz');
  });

  test('should update frequency via number input', async ({ page }) => {
    const freqInput = page.locator('#frequency');
    await freqInput.fill('1000');
    await freqInput.press('Tab');
    await expect(freqInput).toHaveValue('1000');
  });
});
