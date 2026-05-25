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
    await expect(page.getByText('192.168.1.1')).toBeVisible();
  });

  test('should show IPv4 version for private address', async ({ page }) => {
    const input = page.getByPlaceholder('192.168.1.1/24 or 2001:db8::1');
    await input.fill('192.168.1.1');
    await page.getByRole('button', { name: 'Analyze' }).click();

    await expect(page.getByText(/IPv4/)).toBeVisible();
    await expect(page.getByText('Private')).toBeVisible();
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

    await expect(page.getByText('Loopback')).toBeVisible();
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

    // Clear button (trash icon)
    await page.getByRole('button').filter({ has: page.locator('svg') }).last().click();
    await expect(page.getByText('Analysis Result')).not.toBeVisible();
  });
});
