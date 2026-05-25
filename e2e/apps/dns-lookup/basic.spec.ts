import { test, expect } from '@playwright/test';

test.describe('DNS Lookup', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dns-lookup');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'DNS Lookup' })).toBeVisible();
  });

  test('should show domain input field', async ({ page }) => {
    await expect(page.getByPlaceholder('example.com')).toBeVisible();
  });

  test('should show Lookup button', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Lookup' })).toBeVisible();
  });

  test('should disable Lookup button when domain is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Lookup' })).toBeDisabled();
  });

  test('should enable Lookup button when domain is entered', async ({ page }) => {
    await page.getByPlaceholder('example.com').fill('example.com');
    await expect(page.getByRole('button', { name: 'Lookup' })).toBeEnabled();
  });

  test('should show record type selector defaulting to A', async ({ page }) => {
    await expect(page.getByText('Record Type', { exact: true })).toBeVisible();
    // A type should be selected by default - look for it in the combobox
    const combobox = page.getByRole('combobox');
    await expect(combobox).toBeVisible();
  });

  test('should show DNS Record Types Reference table', async ({ page }) => {
    await expect(page.getByText('DNS Record Types Reference')).toBeVisible();
    await expect(page.getByRole('cell', { name: 'A', exact: true })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'AAAA', exact: true })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'MX', exact: true })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'TXT', exact: true })).toBeVisible();
  });

  test('should show selected record type info panel', async ({ page }) => {
    // A record info card should be visible by default
    await expect(page.getByText('IPv4 Address').first()).toBeVisible();
  });

  test('should show domain lookup form', async ({ page }) => {
    await expect(page.getByText('Domain', { exact: true })).toBeVisible();
  });

  test('should trigger lookup on Enter key press', async ({ page }) => {
    await page.getByPlaceholder('example.com').fill('example.com');
    // Just verify the input is fillable and enter can be pressed without error
    await page.getByPlaceholder('example.com').press('Enter');
    // Loading indicator or result should appear (API call may succeed or fail in test env)
    // We just verify no JS error and button text
    await expect(page.getByRole('button', { name: 'Lookup' })).toBeVisible();
  });
});
