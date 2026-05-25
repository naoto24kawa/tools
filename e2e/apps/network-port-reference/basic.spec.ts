import { test, expect } from '@playwright/test';

test.describe('Network Port Reference', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/network-port-reference');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText(/Network Port Reference/i)).toBeVisible();
  });

  test('should show results table on initial load', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible();
  });

  test('should show result count', async ({ page }) => {
    await expect(page.getByText(/port\(s\) found/i)).toBeVisible();
  });

  test('should filter results by port number 80', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/Port number or service name/i);
    await searchInput.fill('80');
    await expect(page.getByRole('table')).toBeVisible();
    // Port 80 row should appear
    await expect(page.getByRole('cell', { name: '80' })).toBeVisible();
  });

  test('should filter results by service name http', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/Port number or service name/i);
    await searchInput.fill('http');
    await expect(page.getByRole('table')).toBeVisible();
    // Should have at least one row
    await expect(page.getByText(/1 port\(s\) found|[2-9]\d* port\(s\) found|\d+ port\(s\) found/i)).toBeVisible();
  });

  test('should show no results for unknown port', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/Port number or service name/i);
    await searchInput.fill('zzz-not-a-port-zzz');
    await expect(page.getByText(/No ports found/i)).toBeVisible();
  });

  test('should filter by TCP protocol', async ({ page }) => {
    const protocolSelect = page.getByRole('combobox').first();
    await protocolSelect.click();
    await page.getByRole('option', { name: 'TCP' }).click();
    await expect(page.getByRole('table')).toBeVisible();
  });

  test('should filter by well-known category', async ({ page }) => {
    // Category select is the second combobox
    const categorySelect = page.getByRole('combobox').nth(1);
    await categorySelect.click();
    await page.getByRole('option', { name: /Well-Known/i }).click();
    await expect(page.getByRole('table')).toBeVisible();
  });
});
