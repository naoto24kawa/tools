import { test, expect } from '@playwright/test';

test.describe('IP Address Info', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ip-address-info');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/IP Address/i);
  });

  test('should show heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'IP Address Info' })).toBeVisible();
  });

  test('should analyze a private IPv4 address', async ({ page }) => {
    const input = page.getByPlaceholder('192.168.1.1/24 or 2001:db8::1');
    await input.fill('192.168.1.1');
    await page.getByRole('button', { name: 'Analyze' }).click();

    await expect(page.getByText('Analysis Result')).toBeVisible();
    // Use exact match to avoid matching the placeholder description text
    await expect(page.getByText('192.168.1.1', { exact: true })).toBeVisible();
  });

  test('should show IPv4 version for private address', async ({ page }) => {
    const input = page.getByPlaceholder('192.168.1.1/24 or 2001:db8::1');
    await input.fill('192.168.1.1');
    await page.getByRole('button', { name: 'Analyze' }).click();

    // The badge shows "IPv4 / Private" - use the span badge
    await expect(page.locator('span').filter({ hasText: /IPv4 \/ Private/ })).toBeVisible();
  });

  test('should show CIDR info for address with subnet mask', async ({ page }) => {
    const input = page.getByPlaceholder('192.168.1.1/24 or 2001:db8::1');
    await input.fill('192.168.1.1/24');
    await page.getByRole('button', { name: 'Analyze' }).click();

    await expect(page.getByText('Subnet Mask')).toBeVisible();
    await expect(page.getByText('Network Address')).toBeVisible();
  });

  test('should show error for invalid IP', async ({ page }) => {
    const input = page.getByPlaceholder('192.168.1.1/24 or 2001:db8::1');
    await input.fill('not-an-ip');
    await page.getByRole('button', { name: 'Analyze' }).click();

    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.getByText(/invalid/i)).toBeVisible();
  });

  test('should analyze loopback address', async ({ page }) => {
    const input = page.getByPlaceholder('192.168.1.1/24 or 2001:db8::1');
    await input.fill('127.0.0.1');
    await page.getByRole('button', { name: 'Analyze' }).click();

    // The badge shows "IPv4 / Loopback"
    await expect(page.locator('span').filter({ hasText: /IPv4 \/ Loopback/ })).toBeVisible();
  });

  test('should trigger analysis on Enter key', async ({ page }) => {
    const input = page.getByPlaceholder('192.168.1.1/24 or 2001:db8::1');
    await input.fill('10.0.0.1');
    await input.press('Enter');

    await expect(page.getByText('Analysis Result')).toBeVisible();
  });

  test('should clear result when clear button clicked', async ({ page }) => {
    const input = page.getByPlaceholder('192.168.1.1/24 or 2001:db8::1');
    await input.fill('192.168.1.1');
    await page.getByRole('button', { name: 'Analyze' }).click();
    await expect(page.getByText('Analysis Result')).toBeVisible();

    // Clear button has variant="outline" and is in the input row (not the copy ghost buttons)
    await page.locator('button.border.border-input').click();
    await expect(page.getByText('Analysis Result')).not.toBeVisible();
  });
});
