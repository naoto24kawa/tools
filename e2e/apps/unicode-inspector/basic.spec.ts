import { test, expect } from '@playwright/test';

test.describe('Unicode Inspector', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/unicode-inspector');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText(/Unicode Inspector/i)).toBeVisible();
  });

  test('should show codepoint U+0041 for letter A', async ({ page }) => {
    const textarea = page.getByLabel('Text to inspect');
    await textarea.fill('A');
    await expect(page.getByText(/U\+0041/i)).toBeVisible();
  });

  test('should show codepoint U+0048 for letter H', async ({ page }) => {
    const textarea = page.getByLabel('Text to inspect');
    await textarea.fill('H');
    await expect(page.getByText(/U\+0048/i)).toBeVisible();
  });

  test('should show character table with columns', async ({ page }) => {
    const textarea = page.getByLabel('Text to inspect');
    await textarea.fill('AB');
    await expect(page.getByRole('columnheader', { name: 'Codepoint' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'UTF-8' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'UTF-16' })).toBeVisible();
  });

  test('should display character count in heading', async ({ page }) => {
    const textarea = page.getByLabel('Text to inspect');
    await textarea.fill('Hello');
    await expect(page.getByText(/Characters \(5\)/i)).toBeVisible();
  });

  test('should show character details when a character is clicked', async ({ page }) => {
    const textarea = page.getByLabel('Text to inspect');
    await textarea.fill('A');
    // Click the table row for character 'A' to trigger selectedChar state
    await page.getByRole('cell', { name: 'A', exact: true }).click();
    // "Character Details" is a shadcn CardTitle (div), visible after selection
    await expect(page.locator('div.text-2xl', { hasText: 'Character Details' })).toBeVisible({ timeout: 3000 });
    // Codepoint U+0041 appears in table row and in detail card
    await expect(page.getByText(/U\+0041/i).first()).toBeVisible();
  });

  test('should add character via codepoint search', async ({ page }) => {
    const textarea = page.getByLabel('Text to inspect');
    await textarea.fill('');
    // Search by codepoint U+0042 (B)
    const searchInput = page.getByPlaceholder(/Search by codepoint/i);
    await searchInput.fill('U+0042');
    await page.getByRole('button', { name: /search codepoint/i }).click();
    await expect(page.getByText(/U\+0042/i)).toBeVisible();
  });

  test('should show error toast for invalid codepoint', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/Search by codepoint/i);
    await searchInput.fill('GGGG');
    await page.getByRole('button', { name: /search codepoint/i }).click();
    await expect(page.getByText('Invalid codepoint', { exact: true })).toBeVisible();
  });
});
