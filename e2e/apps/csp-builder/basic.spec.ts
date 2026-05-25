import { test, expect } from '@playwright/test';

test.describe('CSP Builder', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/csp-builder');
  });

  test('should load page with heading', async ({ page }) => {
    // CardTitle renders as <div>, not <h1>, so use getByText
    await expect(page.getByText('CSP Builder').first()).toBeVisible();
  });

  test('should show directive selector dropdown', async ({ page }) => {
    // Use getByRole('combobox') to avoid strict mode violation with the paragraph text
    await expect(page.getByRole('combobox')).toBeVisible();
  });

  test('should show empty state message when no directives added', async ({ page }) => {
    await expect(page.getByText(/no directives added yet/i)).toBeVisible();
  });

  test('should add a directive when selected and Add clicked', async ({ page }) => {
    // Open the directive dropdown via combobox role
    await page.getByRole('combobox').click();
    // Select default-src directive
    await page.getByRole('option', { name: /default-src/i }).click();
    await page.getByRole('button', { name: /^add$/i }).click();
    // default-src directive card should appear
    await expect(page.getByText('default-src')).toBeVisible();
  });

  test('should generate CSP string after adding directive with a source', async ({ page }) => {
    // Add default-src directive
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /default-src/i }).click();
    await page.getByRole('button', { name: /^add$/i }).click();
    // Click on 'self' common source button
    await page.getByRole('button', { name: "'self'" }).click();
    // Generated CSP header should appear
    await expect(page.getByText(/content-security-policy:/i)).toBeVisible();
    await expect(page.getByText(/default-src.*'self'/).first()).toBeVisible();
  });

  test('should show HTTP Header and HTML Meta Tag sections after building CSP', async ({ page }) => {
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /default-src/i }).click();
    await page.getByRole('button', { name: /^add$/i }).click();
    await page.getByRole('button', { name: "'self'" }).click();
    await expect(page.getByText(/HTTP Header/i)).toBeVisible();
    await expect(page.getByText(/HTML Meta Tag/i)).toBeVisible();
  });

  test('should add custom URL to directive', async ({ page }) => {
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /default-src/i }).click();
    await page.getByRole('button', { name: /^add$/i }).click();
    // Enter a custom URL
    await page.getByPlaceholder(/custom url/i).fill('https://cdn.example.com');
    await page.getByRole('button', { name: /^add$/i }).last().click();
    await expect(page.getByText('https://cdn.example.com').first()).toBeVisible();
  });

  test('should remove a directive when Remove button is clicked', async ({ page }) => {
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /default-src/i }).click();
    await page.getByRole('button', { name: /^add$/i }).click();
    await expect(page.getByText('default-src')).toBeVisible();
    await page.getByRole('button', { name: /remove/i }).click();
    await expect(page.getByText(/no directives added yet/i)).toBeVisible();
  });
});
