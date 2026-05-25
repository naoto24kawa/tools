import { test, expect } from '@playwright/test';

test.describe('User Agent Parser', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/user-agent-parser');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText(/User Agent Parser/i)).toBeVisible();
  });

  test('should pre-fill current browser UA in textarea', async ({ page }) => {
    const textarea = page.locator('textarea#ua-input');
    const value = await textarea.inputValue();
    expect(value.length).toBeGreaterThan(0);
  });

  test('should parse the pre-filled UA and show results', async ({ page }) => {
    await page.getByRole('button', { name: /Parse/i }).click();
    // Results table should appear with Field/Value headers
    await expect(page.getByRole('cell', { name: 'Browser', exact: true })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'OS', exact: true })).toBeVisible();
  });

  test('should parse a known Chrome UA string', async ({ page }) => {
    const textarea = page.locator('textarea#ua-input');
    await textarea.fill(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );
    await page.getByRole('button', { name: /Parse/i }).click();
    await expect(page.getByRole('cell', { name: 'Chrome', exact: true })).toBeVisible();
    await expect(page.getByRole('cell', { name: /Windows/i })).toBeVisible();
  });

  test('should parse a Firefox UA string', async ({ page }) => {
    const textarea = page.locator('textarea#ua-input');
    await textarea.fill(
      'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0'
    );
    await page.getByRole('button', { name: /Parse/i }).click();
    await expect(page.getByRole('cell', { name: 'Firefox', exact: true })).toBeVisible();
    await expect(page.getByRole('cell', { name: /Linux/i })).toBeVisible();
  });

  test('should show Mobile: true for a mobile UA', async ({ page }) => {
    const textarea = page.locator('textarea#ua-input');
    await textarea.fill(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
    );
    await page.getByRole('button', { name: /Parse/i }).click();
    await expect(page.getByText('true')).toBeVisible();
  });

  test('should clear textarea and results when Clear is clicked', async ({ page }) => {
    await page.getByRole('button', { name: /Parse/i }).click();
    await expect(page.getByRole('cell', { name: 'Browser', exact: true })).toBeVisible();
    await page.getByRole('button', { name: /Clear/i }).click();
    const textarea = page.locator('textarea#ua-input');
    await expect(textarea).toHaveValue('');
    // Results card should disappear
    await expect(page.getByRole('heading', { name: 'Results' })).not.toBeVisible();
  });

  test('should show Parse button disabled when textarea is empty', async ({ page }) => {
    await page.getByRole('button', { name: /Clear/i }).click();
    await expect(page.getByRole('button', { name: /Parse/i })).toBeDisabled();
  });
});
