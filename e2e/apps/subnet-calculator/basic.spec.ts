import { test, expect } from '@playwright/test';

test.describe('IPv4 Subnet Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/subnet-calculator');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText(/IPv4 Subnet Calculator/i)).toBeVisible();
  });

  test('should calculate subnet for 192.168.1.0/24', async ({ page }) => {
    const ipInput = page.locator('input#ip-address');
    await ipInput.fill('192.168.1.0');
    // CIDR input defaults to 24; verify then calculate
    const cidrInput = page.locator('input#cidr-input');
    await cidrInput.fill('24');
    await page.getByRole('button', { name: /Calculate/i }).click();
    await expect(page.getByText('255.255.255.0')).toBeVisible();
  });

  test('should show network and broadcast addresses', async ({ page }) => {
    await page.locator('input#ip-address').fill('10.0.0.0');
    await page.locator('input#cidr-input').fill('8');
    await page.getByRole('button', { name: /Calculate/i }).click();
    await expect(page.getByRole('cell', { name: '10.0.0.0', exact: true })).toBeVisible();
    await expect(page.getByText('10.255.255.255')).toBeVisible();
  });

  test('should show usable hosts count for /24 (254)', async ({ page }) => {
    await page.locator('input#ip-address').fill('192.168.0.0');
    await page.locator('input#cidr-input').fill('24');
    await page.getByRole('button', { name: /Calculate/i }).click();
    await expect(page.getByRole('cell', { name: '254', exact: true })).toBeVisible();
  });

  test('should identify private address', async ({ page }) => {
    await page.locator('input#ip-address').fill('192.168.1.0');
    await page.locator('input#cidr-input').fill('24');
    await page.getByRole('button', { name: /Calculate/i }).click();
    await expect(page.getByText('Yes')).toBeVisible();
  });

  test('should show IP class for class A address', async ({ page }) => {
    await page.locator('input#ip-address').fill('10.0.0.0');
    await page.locator('input#cidr-input').fill('8');
    await page.getByRole('button', { name: /Calculate/i }).click();
    await expect(page.getByText(/Class A/i)).toBeVisible();
  });

  test('should show error for invalid IP address', async ({ page }) => {
    await page.locator('input#ip-address').fill('999.999.999.999');
    await page.locator('input#cidr-input').fill('24');
    await page.getByRole('button', { name: /Calculate/i }).click();
    await expect(page.getByRole('alert')).toBeVisible();
  });

  test('should clear results when Clear is clicked', async ({ page }) => {
    await page.locator('input#ip-address').fill('192.168.1.0');
    await page.locator('input#cidr-input').fill('24');
    await page.getByRole('button', { name: /Calculate/i }).click();
    await expect(page.getByText('255.255.255.0')).toBeVisible();
    await page.getByRole('button', { name: /Clear/i }).click();
    await expect(page.getByText('255.255.255.0')).not.toBeVisible();
  });

  test('should update CIDR via slider', async ({ page }) => {
    const slider = page.locator('input#cidr-slider');
    await slider.fill('16');
    await page.getByRole('button', { name: /Calculate/i }).click();
    // /16 subnet mask is 255.255.0.0
    await expect(page.getByText('255.255.0.0')).toBeVisible();
  });
});
