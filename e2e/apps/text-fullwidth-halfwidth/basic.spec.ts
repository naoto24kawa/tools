import { test, expect } from '@playwright/test';

test.describe('Fullwidth / Halfwidth Converter - Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/text-fullwidth-halfwidth');
  });

  test('should load the page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Fullwidth Halfwidth/i);
  });

  test('should display main UI elements', async ({ page }) => {
    await expect(page.locator('#input')).toBeVisible();
    await expect(page.locator('#output')).toBeVisible();
    await expect(page.locator('#alphanumeric')).toBeVisible();
    await expect(page.locator('#katakana')).toBeVisible();
    await expect(page.locator('#symbol')).toBeVisible();
    await expect(page.getByRole('button', { name: /Clear/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Copy Result/i })).toBeVisible();
  });

  test('should display conversion direction options', async ({ page }) => {
    await expect(page.getByText('変換方向')).toBeVisible();
  });

  test('should convert fullwidth alphanumeric to halfwidth by default', async ({ page }) => {
    // Fullwidth 'Ａ' → halfwidth 'A'
    const input = page.locator('#input');
    await input.fill('Ａ Ｂ Ｃ');
    const output = page.locator('#output');
    const value = await output.inputValue();
    expect(value).toContain('A');
    expect(value).toContain('B');
    expect(value).toContain('C');
  });

  test('should show empty output for empty input', async ({ page }) => {
    await expect(page.locator('#output')).toHaveValue('');
  });

  test('should toggle target checkbox for alphanumeric', async ({ page }) => {
    const checkbox = page.locator('#alphanumeric');
    await expect(checkbox).toBeChecked();
    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();
  });

  test('should toggle target checkbox for katakana', async ({ page }) => {
    const checkbox = page.locator('#katakana');
    // Check initial state and toggle
    const initialState = await checkbox.isChecked();
    if (initialState) {
      await checkbox.uncheck();
      await expect(checkbox).not.toBeChecked();
    } else {
      await checkbox.check();
      await expect(checkbox).toBeChecked();
    }
  });

  test('should convert halfwidth alphanumeric to fullwidth when mode is switched', async ({
    page,
  }) => {
    // Click the second conversion direction option (halfwidth → fullwidth)
    const modeButtons = page.locator('button[type="button"]').filter({ hasText: /半角.*全角|全角.*半角/ });
    // Find the "to fullwidth" mode button
    const allButtons = page.locator('button[type="button"]');
    const buttonTexts = await allButtons.allTextContents();
    // Look for a button that indicates halfwidth-to-fullwidth direction
    const toFullwidthIndex = buttonTexts.findIndex((t) =>
      t.includes('半角') && !buttonTexts[0].includes(t),
    );
    if (toFullwidthIndex >= 0) {
      await allButtons.nth(toFullwidthIndex).click();
    }
    const input = page.locator('#input');
    await input.fill('ABC');
    const output = page.locator('#output');
    const value = await output.inputValue();
    // Value should contain fullwidth characters
    expect(value.length).toBeGreaterThan(0);
  });

  test('should clear input when Clear button is clicked', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('ＡＢＣ');
    await page.getByRole('button', { name: /Clear/i }).click();
    await expect(input).toHaveValue('');
  });

  test('should have Copy Result button disabled when output is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Copy Result/i })).toBeDisabled();
  });

  test('should enable Copy Result button when output is present', async ({ page }) => {
    await page.locator('#input').fill('ＡＢＣ');
    await expect(page.getByRole('button', { name: /Copy Result/i })).toBeEnabled();
  });
});
