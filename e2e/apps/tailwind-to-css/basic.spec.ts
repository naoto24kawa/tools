import { test, expect } from '@playwright/test';

test.describe('Tailwind to CSS', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tailwind-to-css');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText('Tailwind to CSS')).toBeVisible();
  });

  test('should show Tailwind classes input textarea', async ({ page }) => {
    await expect(page.getByLabel('Tailwind classes input')).toBeVisible();
  });

  test('should convert flex to display:flex', async ({ page }) => {
    await page.getByLabel('Tailwind classes input').fill('flex');
    await expect(page.getByText(/display.*flex/i).first()).toBeVisible();
  });

  test('should convert items-center to align-items:center', async ({ page }) => {
    await page.getByLabel('Tailwind classes input').fill('items-center');
    await expect(page.getByText(/align-items.*center/i).first()).toBeVisible();
  });

  test('should convert justify-between to justify-content:space-between', async ({ page }) => {
    await page.getByLabel('Tailwind classes input').fill('justify-between');
    await expect(page.getByText(/justify-content.*space-between/i).first()).toBeVisible();
  });

  test('should convert multiple classes and show Class Mapping', async ({ page }) => {
    await page.getByLabel('Tailwind classes input').fill('flex items-center justify-between');
    await expect(page.getByText('Class Mapping')).toBeVisible();
  });

  test('should show Combined CSS section after input', async ({ page }) => {
    await page.getByLabel('Tailwind classes input').fill('p-4 m-2');
    await expect(page.getByText('Combined CSS')).toBeVisible();
  });

  test('should show Copy CSS button', async ({ page }) => {
    await page.getByLabel('Tailwind classes input').fill('flex');
    await expect(page.getByRole('button', { name: /copy css/i })).toBeVisible();
  });

  test('should show conversion count', async ({ page }) => {
    await page.getByLabel('Tailwind classes input').fill('flex items-center');
    await expect(page.getByText(/2 of 2 classes converted/i)).toBeVisible();
  });

  test('should mark unknown class with X indicator', async ({ page }) => {
    await page.getByLabel('Tailwind classes input').fill('not-a-real-class');
    // Unknown class should show in list
    await expect(page.getByText('not-a-real-class').first()).toBeVisible();
    // Should show 0 of 1 converted
    await expect(page.getByText(/0 of 1 classes converted/i)).toBeVisible();
  });

  test('should clear input when Clear button clicked', async ({ page }) => {
    await page.getByLabel('Tailwind classes input').fill('flex');
    await page.getByRole('button', { name: /clear/i }).click();
    await expect(page.getByLabel('Tailwind classes input')).toHaveValue('');
  });

  test('should convert p-4 to padding', async ({ page }) => {
    await page.getByLabel('Tailwind classes input').fill('p-4');
    await expect(page.getByText(/padding/).first()).toBeVisible();
  });
});
