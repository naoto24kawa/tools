import { test, expect } from '@playwright/test';

test.describe('Data Masking Tool', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/data-masking');
  });

  test('should load page with heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /data masking tool/i })).toBeVisible();
  });

  test('should show Masking Rules panel with default rules', async ({ page }) => {
    await expect(page.getByText('Masking Rules')).toBeVisible();
    // Default rules: Email, Phone, Credit Card, IP
    await expect(page.getByText('Email').first()).toBeVisible();
    await expect(page.getByText('Credit Card').first()).toBeVisible();
  });

  test('should show Input textarea', async ({ page }) => {
    await expect(page.getByPlaceholder(/enter text with pii/i)).toBeVisible();
  });

  test('should show Load Sample button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /load sample/i })).toBeVisible();
  });

  test('should load sample and show masked output', async ({ page }) => {
    await page.getByRole('button', { name: /load sample/i }).click();
    await expect(page.getByText('Masked Output')).toBeVisible();
  });

  test('should mask email address in sample text', async ({ page }) => {
    await page.getByRole('button', { name: /load sample/i }).click();
    const output = page.locator('pre').last();
    const text = await output.textContent();
    // Email should be masked, not visible in plain form
    expect(text).not.toContain('john.doe@example.com');
    expect(text).toContain('***');
  });

  test('should show match count badge for active rules', async ({ page }) => {
    await page.getByRole('button', { name: /load sample/i }).click();
    // Match count badges should appear next to some rules
    await expect(page.locator('.rounded-full').first()).toBeVisible();
  });

  test('should toggle a masking rule on/off', async ({ page }) => {
    await page.getByRole('button', { name: /load sample/i }).click();
    const emailCheckbox = page.locator('input[type="checkbox"]').first();
    // Uncheck the first rule
    await emailCheckbox.uncheck();
    // Re-check
    await emailCheckbox.check();
    await expect(emailCheckbox).toBeChecked();
  });

  test('should show Custom Rule panel', async ({ page }) => {
    await expect(page.getByText('Custom Rule')).toBeVisible();
    await expect(page.getByPlaceholder(/e\.g\. SSN/i)).toBeVisible();
    await expect(page.getByPlaceholder(/regex pattern/i)).toBeVisible();
  });

  test('should add a custom rule and apply it', async ({ page }) => {
    // Add a custom rule to mask "ACME"
    await page.getByPlaceholder(/e\.g\. SSN/i).fill('Company Name');
    await page.getByPlaceholder(/regex pattern/i).fill('ACME');
    await page.getByPlaceholder('***').fill('[COMPANY]');
    await page.getByRole('button', { name: /add rule/i }).click();
    // Custom rule should appear in the list
    await expect(page.getByText('Company Name')).toBeVisible();
  });

  test('should show Copy button and Clear button after masking', async ({ page }) => {
    await page.getByRole('button', { name: /load sample/i }).click();
    await expect(page.getByRole('button', { name: /copy/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /clear/i })).toBeVisible();
  });
});
