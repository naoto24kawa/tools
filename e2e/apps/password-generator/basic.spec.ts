import { test, expect } from '@playwright/test';

test.describe('Password Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/password-generator');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText('Password Generator')).toBeVisible();
  });

  test('should generate passwords on button click', async ({ page }) => {
    await page.getByRole('button', { name: /generate passwords/i }).click();
    // 5 passwords are generated; check that code blocks appear
    const passwords = page.locator('code.font-mono');
    await expect(passwords).toHaveCount(5);
  });

  test('should generate non-empty passwords', async ({ page }) => {
    await page.getByRole('button', { name: /generate passwords/i }).click();
    const firstPassword = page.locator('code.font-mono').first();
    await expect(firstPassword).not.toBeEmpty();
  });

  test('should show strength indicator after generation', async ({ page }) => {
    await page.getByRole('button', { name: /generate passwords/i }).click();
    // Strength label text (Weak/Fair/Good/Strong/Very Strong)
    await expect(page.getByText(/weak|fair|good|strong/i).first()).toBeVisible();
  });

  test('should show copy and clear buttons after generation', async ({ page }) => {
    await page.getByRole('button', { name: /generate passwords/i }).click();
    await expect(page.getByRole('button', { name: /copy all/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /clear/i })).toBeVisible();
  });

  test('should clear passwords when clear button is clicked', async ({ page }) => {
    await page.getByRole('button', { name: /generate passwords/i }).click();
    await expect(page.locator('code.font-mono').first()).toBeVisible();
    await page.getByRole('button', { name: /clear/i }).click();
    await expect(page.locator('code.font-mono')).toHaveCount(0);
  });

  test('should have length slider', async ({ page }) => {
    await expect(page.locator('input#length')).toBeVisible();
  });

  test('should show checkbox options', async ({ page }) => {
    await expect(page.getByText(/Uppercase/i)).toBeVisible();
    await expect(page.getByText(/Lowercase/i)).toBeVisible();
    await expect(page.getByText(/Numbers/i)).toBeVisible();
  });
});
