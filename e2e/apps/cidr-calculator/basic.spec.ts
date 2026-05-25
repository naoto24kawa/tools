import { test, expect } from '@playwright/test';

test.describe('CIDR Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cidr-calculator');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText(/CIDR Calculator/i)).toBeVisible();
  });

  test('should calculate 192.168.1.0/24 and show subnet mask', async ({ page }) => {
    const input = page.locator('input#cidr-input');
    await input.fill('192.168.1.0/24');
    await page.getByRole('button', { name: /^Calculate$/i }).click();
    await expect(page.getByText('255.255.255.0')).toBeVisible();
  });

  test('should show network and broadcast address for 10.0.0.0/8', async ({ page }) => {
    const input = page.locator('input#cidr-input');
    await input.fill('10.0.0.0/8');
    await page.getByRole('button', { name: /^Calculate$/i }).click();
    await expect(page.getByText('10.0.0.0').first()).toBeVisible();
    await expect(page.getByText('10.255.255.255')).toBeVisible();
  });

  test('should show total addresses for /24 (256)', async ({ page }) => {
    const input = page.locator('input#cidr-input');
    await input.fill('192.168.0.0/24');
    await page.getByRole('button', { name: /^Calculate$/i }).click();
    await expect(page.getByText('256')).toBeVisible();
  });

  test('should show error for invalid CIDR notation', async ({ page }) => {
    const input = page.locator('input#cidr-input');
    await input.fill('not-a-cidr');
    await page.getByRole('button', { name: /^Calculate$/i }).click();
    await expect(page.getByRole('alert')).toBeVisible();
  });

  test('should check IP containment - IP within range', async ({ page }) => {
    await page.locator('input#contains-cidr').fill('192.168.1.0/24');
    await page.locator('input#contains-ip').fill('192.168.1.100');
    // There are two Check buttons; use the first (IP Containment section)
    await page.getByRole('button', { name: /^Check$/i }).first().click();
    await expect(page.getByText(/192\.168\.1\.100 is within 192\.168\.1\.0\/24/)).toBeVisible();
  });

  test('should check IP containment - IP outside range', async ({ page }) => {
    await page.locator('input#contains-cidr').fill('192.168.1.0/24');
    await page.locator('input#contains-ip').fill('10.0.0.1');
    await page.getByRole('button', { name: /^Check$/i }).first().click();
    await expect(page.getByText(/NOT within/i)).toBeVisible();
  });

  test('should detect overlapping CIDR ranges', async ({ page }) => {
    await page.locator('input#overlap-cidr1').fill('10.0.0.0/8');
    await page.locator('input#overlap-cidr2').fill('10.1.0.0/16');
    // Use the second Check button (CIDR Overlap section)
    await page.getByRole('button', { name: /^Check$/i }).nth(1).click();
    // Result says "10.0.0.0/8 and 10.1.0.0/16 OVERLAP"
    await expect(page.getByText('10.0.0.0/8 and 10.1.0.0/16 OVERLAP')).toBeVisible();
  });

  test('should detect non-overlapping CIDR ranges', async ({ page }) => {
    await page.locator('input#overlap-cidr1').fill('10.0.0.0/8');
    await page.locator('input#overlap-cidr2').fill('192.168.0.0/16');
    await page.getByRole('button', { name: /^Check$/i }).nth(1).click();
    await expect(page.getByText(/do NOT overlap/i)).toBeVisible();
  });

  test('should clear all fields when Clear All is clicked', async ({ page }) => {
    const input = page.locator('input#cidr-input');
    await input.fill('192.168.1.0/24');
    await page.getByRole('button', { name: /^Calculate$/i }).click();
    await expect(page.getByText('255.255.255.0')).toBeVisible();
    await page.getByRole('button', { name: /Clear All/i }).click();
    await expect(input).toHaveValue('');
    await expect(page.getByText('255.255.255.0')).not.toBeVisible();
  });
});
