import { test, expect } from '@playwright/test';

test.describe('SRI Hash Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sri-hash-generator');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText('SRI Hash Generator')).toBeVisible();
  });

  test('should show content textarea', async ({ page }) => {
    await expect(page.locator('#input-text')).toBeVisible();
  });

  test('should have algorithm selector with SHA-384 default', async ({ page }) => {
    await expect(page.getByText('SHA-384 (Recommended)')).toBeVisible();
  });

  test('should have Generate Hash button disabled when no input', async ({ page }) => {
    await expect(page.getByRole('button', { name: /generate hash/i })).toBeDisabled();
  });

  test('should generate SHA-384 hash from text input', async ({ page }) => {
    await page.locator('#input-text').fill('console.log("hello world");');
    await page.getByRole('button', { name: /generate hash/i }).click();
    // SHA-384 hash starts with sha384- displayed in the integrity hash result div (text-sm)
    await expect(page.locator('.font-mono.text-sm.break-all').filter({ hasText: /sha384-/ })).toBeVisible({ timeout: 5000 });
  });

  test('should generate SHA-256 hash when algorithm changed', async ({ page }) => {
    // Change algorithm to SHA-256
    await page.getByRole('combobox').first().click();
    await page.getByRole('option', { name: 'SHA-256' }).click();
    await page.locator('#input-text').fill('test content');
    await page.getByRole('button', { name: /generate hash/i }).click();
    await expect(page.locator('.font-mono.text-sm.break-all').filter({ hasText: /sha256-/ })).toBeVisible({ timeout: 5000 });
  });

  test('should show HTML snippet after hash generation', async ({ page }) => {
    await page.locator('#input-text').fill('body { margin: 0; }');
    await page.getByRole('button', { name: /generate hash/i }).click();
    await expect(page.getByText('HTML Snippet', { exact: true })).toBeVisible({ timeout: 5000 });
  });

  test('should show integrity hash section after generation', async ({ page }) => {
    await page.locator('#input-text').fill('alert(1)');
    await page.getByRole('button', { name: /generate hash/i }).click();
    await expect(page.getByText('Integrity Hash', { exact: true })).toBeVisible({ timeout: 5000 });
  });

  test('should show resource URL input after hash generation', async ({ page }) => {
    await page.locator('#input-text').fill('body {}');
    await page.getByRole('button', { name: /generate hash/i }).click();
    // Resource URL input should appear
    await expect(page.getByPlaceholder('Resource URL')).toBeVisible({ timeout: 5000 });
  });

  test('should have file upload input', async ({ page }) => {
    await expect(page.locator('#file-upload')).toBeVisible();
  });
});
