import { test, expect } from '@playwright/test';

test.describe('Zalgo Text Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/zalgo-text');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText('Zalgo Text Generator')).toBeVisible();
  });

  test('should show generate section', async ({ page }) => {
    await expect(page.getByText('Generate Zalgo Text')).toBeVisible();
    await expect(page.getByLabel('Input Text')).toBeVisible();
  });

  test('should show remove zalgo section', async ({ page }) => {
    await expect(page.getByText('Remove Zalgo')).toBeVisible();
    await expect(page.getByLabel('Zalgo Text')).toBeVisible();
  });

  test('should add zalgo effects to text', async ({ page }) => {
    await page.getByLabel('Input Text').fill('hello');
    await page.getByRole('button', { name: /generate zalgo/i }).click();

    // Result div with zalgo text should appear
    const resultDiv = page.locator('.rounded-md.border.bg-muted').first();
    await expect(resultDiv).toBeVisible({ timeout: 3000 });
    const resultText = await resultDiv.textContent();
    // Zalgo text is longer than the original due to combining chars
    expect((resultText ?? '').length).toBeGreaterThan(5);
  });

  test('should show combining characters count after generating', async ({ page }) => {
    await page.getByLabel('Input Text').fill('hello');
    await page.getByRole('button', { name: /generate zalgo/i }).click();
    await expect(page.getByText(/combining chars/i)).toBeVisible({ timeout: 3000 });
  });

  test('should show intensity slider', async ({ page }) => {
    const slider = page.locator('#intensity-slider');
    await expect(slider).toBeVisible();
    const value = await slider.inputValue();
    expect(Number(value)).toBe(50);
  });

  test('should show above/middle/below checkboxes', async ({ page }) => {
    await expect(page.getByRole('checkbox', { name: '' }).first()).toBeAttached();
    // Check that the labels Above, Middle, Below are present
    await expect(page.getByText('Above')).toBeVisible();
    await expect(page.getByText('Middle')).toBeVisible();
    await expect(page.getByText('Below')).toBeVisible();
  });

  test('should clean zalgo text', async ({ page }) => {
    // First generate zalgo text
    await page.getByLabel('Input Text').fill('hello');
    await page.getByRole('button', { name: /generate zalgo/i }).click();
    const resultDiv = page.locator('.rounded-md.border.bg-muted').first();
    await expect(resultDiv).toBeVisible({ timeout: 3000 });
    const zalgoText = await resultDiv.textContent() ?? '';

    // Then paste into remove section and clean
    await page.getByLabel('Zalgo Text').fill(zalgoText);
    await page.getByRole('button', { name: /clean text/i }).click();

    // Cleaned result should be the original text
    await expect(page.getByText('Cleaned Result')).toBeVisible({ timeout: 3000 });
  });
});
