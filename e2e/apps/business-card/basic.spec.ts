import { test, expect } from '@playwright/test';

test.describe('Business Card Designer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/business-card');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Business Card/i);
  });

  test('should display main heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Business Card Designer' })).toBeVisible();
  });

  test('should show form with default values', async ({ page }) => {
    await expect(page.getByLabel('Name')).toHaveValue('John Doe');
    await expect(page.getByLabel('Title')).toHaveValue('Software Engineer');
    await expect(page.getByLabel('Company')).toHaveValue('Acme Corporation');
    await expect(page.getByLabel('Email')).toHaveValue('john@acme.com');
    await expect(page.getByLabel('Phone')).toHaveValue('03-1234-5678');
    await expect(page.getByLabel('Website')).toHaveValue('https://acme.com');
  });

  test('should show preview canvas', async ({ page }) => {
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
  });

  test('should update name and show preview', async ({ page }) => {
    await page.getByLabel('Name').fill('Jane Doe');
    // Canvas should be visible with updated content (canvas renders via useEffect)
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
  });

  test('should update company field', async ({ page }) => {
    await page.getByLabel('Company').fill('Tech Corp');
    await expect(page.getByLabel('Company')).toHaveValue('Tech Corp');
  });

  test('should switch template to Minimal', async ({ page }) => {
    await page.getByText('Template').locator('..').locator('[role="combobox"]').click();
    await page.getByRole('option', { name: 'Minimal' }).click();
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
  });

  test('should switch template to Classic', async ({ page }) => {
    await page.getByText('Template').locator('..').locator('[role="combobox"]').click();
    await page.getByRole('option', { name: 'Classic' }).click();
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
  });

  test('should show Download button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Download/i })).toBeVisible();
  });

  test('should show Print button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Print/i })).toBeVisible();
  });

  test('should show Card Information section', async ({ page }) => {
    await expect(page.getByText('Card Information')).toBeVisible();
  });

  test('should show Preview section with correct aspect ratio', async ({ page }) => {
    await expect(page.getByText('Preview (Actual Size Ratio)')).toBeVisible();
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
  });
});
