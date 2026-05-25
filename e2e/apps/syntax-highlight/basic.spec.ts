import { test, expect } from '@playwright/test';

test.describe('Syntax Highlighter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/syntax-highlight');
  });

  test('should display the page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Syntax Highlighter/i })).toBeVisible();
  });

  test('should show highlighted output after entering code', async ({ page }) => {
    const input = page.getByLabel('Input');
    await input.fill('const x = 42;');
    const output = page.getByRole('region', { name: /highlighted output/i }).or(
      page.locator('[aria-label="Syntax highlighted output"]')
    );
    await expect(output).toBeVisible();
    await expect(output).toContainText('const');
  });

  test('should highlight JavaScript keywords', async ({ page }) => {
    const input = page.getByLabel('Input');
    await input.fill('const greeting = "hello";\nfunction greet() { return greeting; }');
    const output = page.locator('[aria-label="Syntax highlighted output"]');
    await expect(output).toContainText('const');
    await expect(output).toContainText('function');
  });

  test('should update highlighted output when language is changed', async ({ page }) => {
    const input = page.getByLabel('Input');
    await input.fill('SELECT * FROM users WHERE id = 1;');
    const languageSelect = page.getByLabel('Language');
    await languageSelect.selectOption('sql');
    const output = page.locator('[aria-label="Syntax highlighted output"]');
    await expect(output).toContainText('SELECT');
  });

  test('should toggle between dark and light theme', async ({ page }) => {
    // Initially dark theme — button says "Light Theme"
    await expect(page.getByRole('button', { name: /light theme/i })).toBeVisible();
    await page.getByRole('button', { name: /light theme/i }).click();
    // After toggle — button should say "Dark Theme"
    await expect(page.getByRole('button', { name: /dark theme/i })).toBeVisible();
  });

  test('should clear code when Clear is clicked', async ({ page }) => {
    const input = page.getByLabel('Input');
    await input.fill('const x = 1;');
    await page.getByRole('button', { name: /clear/i }).click();
    await expect(input).toHaveValue('');
  });

  test('should disable Copy Code button when input is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /copy code/i })).toBeDisabled();
  });

  test('should enable Copy Code button after entering code', async ({ page }) => {
    await page.getByLabel('Input').fill('let a = 1;');
    await expect(page.getByRole('button', { name: /copy code/i })).toBeEnabled();
  });
});
