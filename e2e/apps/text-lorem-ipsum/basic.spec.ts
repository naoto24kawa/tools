import { test, expect } from '@playwright/test';

test.describe('Lorem Ipsum Generator - Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/text-lorem-ipsum');
  });

  test('should load the page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Lorem Ipsum/i);
  });

  test('should display main UI elements', async ({ page }) => {
    await expect(page.locator('#count')).toBeVisible();
    await expect(page.getByRole('button', { name: /生成/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Clear/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Copy Result/i })).toBeVisible();
  });

  test('should display unit options', async ({ page }) => {
    // Unit options are rendered as buttons
    const unitButtons = page.locator('button[type="button"]');
    const buttonTexts = await unitButtons.allTextContents();
    // Check that some unit options are present (paragraphs, sentences, words)
    const hasUnitOption = buttonTexts.some(
      (text) => text.includes('段落') || text.includes('文') || text.includes('単語'),
    );
    expect(hasUnitOption).toBe(true);
  });

  test('should generate Lorem Ipsum text when generate button is clicked', async ({ page }) => {
    await page.getByRole('button', { name: /生成/i }).click();
    const output = page.getByRole('textbox', { name: /生成されたダミーテキスト/i });
    const value = await output.inputValue();
    expect(value.length).toBeGreaterThan(0);
  });

  test('should start with "Lorem ipsum" when option is checked', async ({ page }) => {
    // startWithLorem checkbox should be checked by default
    await expect(page.locator('#startWithLorem')).toBeChecked();
    await page.getByRole('button', { name: /生成/i }).click();
    const output = page.getByRole('textbox', { name: /生成されたダミーテキスト/i });
    const value = await output.inputValue();
    expect(value.toLowerCase()).toContain('lorem ipsum');
  });

  test('should clear output when Clear button is clicked', async ({ page }) => {
    await page.getByRole('button', { name: /生成/i }).click();
    await page.getByRole('button', { name: /Clear/i }).click();
    const output = page.getByRole('textbox', { name: /生成されたダミーテキスト/i });
    await expect(output).toHaveValue('');
  });

  test('should have Copy Result button disabled when output is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Copy Result/i })).toBeDisabled();
  });

  test('should enable Copy Result button after generating', async ({ page }) => {
    await page.getByRole('button', { name: /生成/i }).click();
    await expect(page.getByRole('button', { name: /Copy Result/i })).toBeEnabled();
  });

  test('should change count input', async ({ page }) => {
    const countInput = page.locator('#count');
    await countInput.fill('1');
    await page.getByRole('button', { name: /生成/i }).click();
    const output = page.getByRole('textbox', { name: /生成されたダミーテキスト/i });
    const value = await output.inputValue();
    expect(value.length).toBeGreaterThan(0);
  });
});
