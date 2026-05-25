import { test, expect } from '@playwright/test';

test.describe('Regex Tester', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/code-regex-tester');
  });

  test('should display the page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Regex Tester/i })).toBeVisible();
  });

  test('should match a simple pattern and show match count', async ({ page }) => {
    await page.getByLabel('Regular expression pattern').fill('hello');
    await page.getByLabel('Test string input').fill('say hello world');
    // "Matches (1)" CardTitle should appear
    await expect(page.getByText(/Matches \(1\)/i)).toBeVisible();
  });

  test('should show multiple matches with global flag', async ({ page }) => {
    await page.getByLabel('Regular expression pattern').fill('o');
    await page.getByLabel('Test string input').fill('foo bar boo');
    // 'o' appears 4 times in 'foo bar boo': f(o)(o) bar b(o)(o)
    await expect(page.getByText(/Matches \(4\)/i)).toBeVisible();
  });

  test('should show no match when pattern does not match', async ({ page }) => {
    await page.getByLabel('Regular expression pattern').fill('xyz');
    await page.getByLabel('Test string input').fill('hello world');
    await expect(page.getByText('マッチなし')).toBeVisible();
  });

  test('should show error for invalid regex pattern', async ({ page }) => {
    await page.getByLabel('Regular expression pattern').fill('[invalid');
    await expect(page.getByRole('alert')).toBeVisible();
  });

  test('should match case-insensitively when i flag is active', async ({ page }) => {
    await page.getByLabel('Regular expression pattern').fill('HELLO');
    // Toggle 'i' flag on (it should not be in default 'g' flags)
    await page.getByRole('button', { name: 'i', exact: true }).click();
    await page.getByLabel('Test string input').fill('say hello world');
    await expect(page.getByText(/Matches \(1\)/i)).toBeVisible();
  });

  test('should toggle flags with flag buttons', async ({ page }) => {
    // 'g' flag button should be pressed by default
    const gButton = page.getByRole('button', { name: 'g', exact: true });
    await expect(gButton).toHaveAttribute('aria-pressed', 'true');
    // Toggle 'i' flag on
    const iButton = page.getByRole('button', { name: 'i', exact: true });
    await expect(iButton).toHaveAttribute('aria-pressed', 'false');
    await iButton.click();
    await expect(iButton).toHaveAttribute('aria-pressed', 'true');
  });

  test('should apply a common pattern shortcut', async ({ page }) => {
    // Click the Email pattern shortcut button
    await page.getByRole('button', { name: /email/i }).click();
    const patternInput = page.getByLabel('Regular expression pattern');
    const value = await patternInput.inputValue();
    expect(value.length).toBeGreaterThan(0);
  });

  test('should show match index in match details', async ({ page }) => {
    await page.getByLabel('Regular expression pattern').fill('world');
    await page.getByLabel('Test string input').fill('hello world');
    await expect(page.getByText(/index:/i)).toBeVisible();
  });
});
