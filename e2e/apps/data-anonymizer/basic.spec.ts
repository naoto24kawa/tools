import { test, expect } from '@playwright/test';

test.describe('Data Anonymizer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/data-anonymizer');
  });

  test('should load page with heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /data anonymizer/i })).toBeVisible();
  });

  test('should show Input Text textarea', async ({ page }) => {
    await expect(page.locator('textarea#input-text')).toBeVisible();
  });

  test('should show Anonymization Mode selector', async ({ page }) => {
    await expect(page.getByText('Anonymization Mode')).toBeVisible();
    await expect(page.getByRole('combobox')).toBeVisible();
  });

  test('should load sample data when Load Sample is clicked', async ({ page }) => {
    await page.getByRole('button', { name: /load sample/i }).click();
    const textarea = page.locator('textarea#input-text');
    const value = await textarea.inputValue();
    expect(value).toContain('john.smith@company.com');
  });

  test('should detect PII in sample text (email, phone)', async ({ page }) => {
    await page.getByRole('button', { name: /load sample/i }).click();
    // PII detection count should be > 0
    await expect(page.getByText(/detected pii/i)).toBeVisible();
    await expect(page.getByText(/\(\d+\)/)).toBeVisible();
  });

  test('should show highlighted PII preview', async ({ page }) => {
    await page.getByRole('button', { name: /load sample/i }).click();
    await expect(page.getByText('Preview (PII highlighted)')).toBeVisible();
  });

  test('should show Anonymized Output section', async ({ page }) => {
    await page.getByRole('button', { name: /load sample/i }).click();
    await expect(page.getByText('Anonymized Output')).toBeVisible();
  });

  test('should mask email in mask mode', async ({ page }) => {
    await page.locator('textarea#input-text').fill('Email: john.doe@example.com');
    // In mask mode, anonymized output should not contain the email
    await expect(page.getByText('Anonymized Output')).toBeVisible();
    const outputEl = page.getByText('Anonymized Output').locator('..').locator('..');
    await expect(outputEl).toContainText('***');
  });

  test('should show Anonymize In Place button when PII detected', async ({ page }) => {
    await page.getByRole('button', { name: /load sample/i }).click();
    await expect(page.getByRole('button', { name: /anonymize in place/i })).toBeVisible();
  });

  test('should clear input when Clear is clicked', async ({ page }) => {
    await page.getByRole('button', { name: /load sample/i }).click();
    await page.getByRole('button', { name: /clear/i }).click();
    await expect(page.locator('textarea#input-text')).toHaveValue('');
  });

  test('should list supported PII types', async ({ page }) => {
    await expect(page.getByText('Supported PII Types')).toBeVisible();
    await expect(page.getByText('Email')).toBeVisible();
    await expect(page.getByText('Credit Card')).toBeVisible();
  });

  test('should show local processing notice', async ({ page }) => {
    await expect(page.getByText(/all processing is done locally/i)).toBeVisible();
  });
});
