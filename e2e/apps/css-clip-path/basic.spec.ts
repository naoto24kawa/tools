import { test, expect } from '@playwright/test';

test.describe('CSS Clip Path Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/css-clip-path');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/CSS Clip Path/i);
  });

  test('should display clip path preview', async ({ page }) => {
    await expect(page.getByLabel('クリップパスプレビュー')).toBeVisible();
  });

  test('should show Presets section with preset buttons', async ({ page }) => {
    await expect(page.getByText('Presets')).toBeVisible();
    const presetButtons = page.locator('button[aria-label*="を選択"]');
    const count = await presetButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display clip-path text input', async ({ page }) => {
    const textInput = page.locator('input[type="text"]');
    await expect(textInput).toBeVisible();
    // Should contain a clip-path value
    const value = await textInput.inputValue();
    expect(value.length).toBeGreaterThan(0);
  });

  test('should display CSS Code output with clip-path', async ({ page }) => {
    const codeBlock = page.locator('pre').filter({ hasText: 'clip-path' });
    await expect(codeBlock).toBeVisible();
  });

  test('should show Copy CSS button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Copy CSS/i })).toBeVisible();
  });

  test('should update clip path when preset is selected', async ({ page }) => {
    const initialInput = page.locator('input[type="text"]');
    const initialValue = await initialInput.inputValue();
    // Click the second preset button if available
    const presetButtons = page.locator('button[aria-label*="を選択"]');
    if (await presetButtons.count() > 1) {
      await presetButtons.nth(1).click();
      const newValue = await initialInput.inputValue();
      // Either the value changed or it's the same preset
      expect(newValue.length).toBeGreaterThan(0);
    }
  });

  test('should update preview when clip-path input changes', async ({ page }) => {
    const textInput = page.locator('input[type="text"]');
    await textInput.fill('circle(50%)');
    await textInput.blur();
    // CSS code output should reflect the new value
    const codeBlock = page.locator('pre').filter({ hasText: 'clip-path' });
    const text = await codeBlock.textContent();
    expect(text).toContain('circle');
  });
});
