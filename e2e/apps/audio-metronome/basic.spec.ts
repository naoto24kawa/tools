import { test, expect } from '@playwright/test';

test.describe('Audio Metronome', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/audio-metronome');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page).toHaveTitle(/Audio Metronome/i);
    await expect(page.getByRole('heading', { name: 'Audio Metronome' })).toBeVisible();
  });

  test('should show BPM display', async ({ page }) => {
    await expect(page.locator('text=BPM')).toBeVisible();
  });

  test('should show default BPM value', async ({ page }) => {
    // DEFAULT_BPM is likely 120
    const bpmDisplay = page.locator('.text-6xl');
    await expect(bpmDisplay).toBeVisible();
    const bpmValue = await bpmDisplay.textContent();
    const bpm = parseInt(bpmValue ?? '0');
    expect(bpm).toBeGreaterThan(0);
  });

  test('should show BPM slider', async ({ page }) => {
    await expect(page.locator('#bpm[type="range"]')).toBeVisible();
  });

  test('should show BPM number input', async ({ page }) => {
    await expect(page.locator('input[type="number"]').first()).toBeVisible();
  });

  test('should show BPM preset buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: '120' })).toBeVisible();
    await expect(page.getByRole('button', { name: '60' })).toBeVisible();
  });

  test('should show time signature selector', async ({ page }) => {
    await expect(page.getByText('Time Signature')).toBeVisible();
  });

  test('should show beat indicator circles', async ({ page }) => {
    // Beat indicator dots should be visible (4 circles for 4/4 time)
    const beatDots = page.locator('.rounded-full').filter({ hasText: /^[1-9]$/ });
    const count = await beatDots.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should show Start button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /start/i })).toBeVisible();
  });

  test('should change BPM when preset button is clicked', async ({ page }) => {
    await page.getByRole('button', { name: '80' }).click();
    const bpmDisplay = page.locator('.text-6xl');
    await expect(bpmDisplay).toHaveText('80');
  });

  test('should update BPM via number input', async ({ page }) => {
    const bpmInput = page.locator('input[type="number"]').first();
    await bpmInput.fill('100');
    await bpmInput.press('Enter');
    await expect(page.locator('.text-6xl')).toHaveText('100');
  });

  test('should change time signature', async ({ page }) => {
    const selectTrigger = page.locator('[role="combobox"]');
    await selectTrigger.click();
    await page.getByRole('option', { name: '3/4' }).click();

    // Beat indicators should now show 3 circles
    const beatDots = page.locator('.rounded-full').filter({ hasText: /^[1-9]$/ });
    await expect(beatDots).toHaveCount(3);
  });
});
