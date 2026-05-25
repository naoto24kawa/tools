import { test, expect } from '@playwright/test';

test.describe('Certificate Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/certificate-generator');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Certificate Generator/i);
  });

  test('should display main heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Certificate Generator' })).toBeVisible();
  });

  test('should show form with default values', async ({ page }) => {
    await expect(page.getByLabel('Certificate Title')).toHaveValue('Certificate of Achievement');
    await expect(page.getByLabel('Recipient Name')).toHaveValue('Jane Smith');
    await expect(page.getByLabel('Issuer')).toHaveValue('Acme Corporation');
  });

  test('should show preview canvas', async ({ page }) => {
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
  });

  test('should update recipient name and re-render', async ({ page }) => {
    await page.getByLabel('Recipient Name').fill('Alice Johnson');
    await expect(page.getByLabel('Recipient Name')).toHaveValue('Alice Johnson');
    // Canvas should still be visible
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
  });

  test('should update certificate title', async ({ page }) => {
    await page.getByLabel('Certificate Title').fill('Certificate of Excellence');
    await expect(page.getByLabel('Certificate Title')).toHaveValue('Certificate of Excellence');
  });

  test('should update description', async ({ page }) => {
    await page.getByLabel('Description').fill('For outstanding performance.');
    await expect(page.getByLabel('Description')).toHaveValue('For outstanding performance.');
  });

  test('should update issuer', async ({ page }) => {
    await page.getByLabel('Issuer').fill('Global Academy');
    await expect(page.getByLabel('Issuer')).toHaveValue('Global Academy');
  });

  test('should have date input', async ({ page }) => {
    const dateInput = page.getByLabel('Date');
    await expect(dateInput).toBeVisible();
    // Should have a date value (defaults to today)
    const value = await dateInput.inputValue();
    expect(value).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  test('should switch template to Modern', async ({ page }) => {
    await page.getByText('Template').locator('..').locator('[role="combobox"]').click();
    await page.getByRole('option', { name: 'Modern' }).click();
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
  });

  test('should show Download button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Download/i })).toBeVisible();
  });

  test('should show Print button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Print/i })).toBeVisible();
  });

  test('should show Certificate Details section', async ({ page }) => {
    await expect(page.getByText('Certificate Details')).toBeVisible();
  });

  test('should show Preview section', async ({ page }) => {
    await expect(page.getByText('Preview')).toBeVisible();
  });
});
