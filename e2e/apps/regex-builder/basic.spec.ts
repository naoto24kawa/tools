import { test, expect } from '@playwright/test';

test.describe('Regex Builder', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/regex-builder');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Regex Builder' })).toBeVisible();
  });

  test('should show Visual Builder and Manual Input mode options', async ({ page }) => {
    await expect(page.getByText('Visual Builder')).toBeVisible();
    await expect(page.getByText('Manual Input')).toBeVisible();
  });

  test('should switch to Manual Input mode and enter a pattern', async ({ page }) => {
    const manualRadio = page.locator('input[type="radio"]').nth(1);
    await manualRadio.click();
    const patternInput = page.getByPlaceholder('Enter regex pattern...');
    await patternInput.fill('hello');
    await expect(page.locator('code').filter({ hasText: 'hello' })).toBeVisible();
  });

  test('should show match count in test string section', async ({ page }) => {
    // Switch to manual mode
    const manualRadio = page.locator('input[type="radio"]').nth(1);
    await manualRadio.click();
    await page.getByPlaceholder('Enter regex pattern...').fill('o');
    await page.getByLabel('Test string').fill('hello world');
    // Description shows "2 match(es) found"
    await expect(page.getByText(/2 match\(es\) found/i)).toBeVisible();
  });

  test('should highlight matches in the test string', async ({ page }) => {
    const manualRadio = page.locator('input[type="radio"]').nth(1);
    await manualRadio.click();
    await page.getByPlaceholder('Enter regex pattern...').fill('world');
    await page.getByLabel('Test string').fill('hello world');
    await expect(page.getByText('Highlighted Matches')).toBeVisible();
    await expect(page.locator('mark').filter({ hasText: 'world' })).toBeVisible();
  });

  test('should show match details table when matches found', async ({ page }) => {
    const manualRadio = page.locator('input[type="radio"]').nth(1);
    await manualRadio.click();
    await page.getByPlaceholder('Enter regex pattern...').fill('\\d+');
    await page.getByLabel('Test string').fill('abc 123 def 456');
    await expect(page.getByText('Match Details')).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Match' })).toBeVisible();
  });

  test('should have flags checkboxes (Global, Case Insensitive, Multiline)', async ({ page }) => {
    await expect(page.getByText('g - Global')).toBeVisible();
    await expect(page.getByText('i - Case Insensitive')).toBeVisible();
    await expect(page.getByText('m - Multiline')).toBeVisible();
  });

  test('should show regex character-class preset buttons', async ({ page }) => {
    // Character Class section should have preset buttons
    await expect(page.getByText('Character Class')).toBeVisible();
  });

  test('should have Copy regex button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Copy regex/i })).toBeVisible();
  });
});
