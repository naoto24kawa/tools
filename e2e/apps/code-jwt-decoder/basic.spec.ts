import { test, expect } from '@playwright/test';

// Standard test JWT: { "sub": "1234567890", "name": "John Doe", "iat": 1516239022 }
const VALID_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' +
  '.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ' +
  '.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

test.describe('JWT Decoder', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/code-jwt-decoder');
  });

  test('should display the page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /JWT Decoder/i })).toBeVisible();
  });

  test('should decode a valid JWT and show header section', async ({ page }) => {
    await page.getByLabel('JWT token input').fill(VALID_JWT);
    await expect(page.getByText('Header').first()).toBeVisible();
  });

  test('should show alg and typ in decoded header', async ({ page }) => {
    await page.getByLabel('JWT token input').fill(VALID_JWT);
    // Header pre block should contain alg and typ fields
    const headerPre = page.locator('pre').first();
    await expect(headerPre).toContainText('"alg"');
    await expect(headerPre).toContainText('HS256');
  });

  test('should decode JWT payload with sub and name fields', async ({ page }) => {
    await page.getByLabel('JWT token input').fill(VALID_JWT);
    await expect(page.getByText('Payload').first()).toBeVisible();
    // Payload pre block
    const payloadPre = page.locator('pre').nth(1);
    await expect(payloadPre).toContainText('"sub"');
    await expect(payloadPre).toContainText('1234567890');
    await expect(payloadPre).toContainText('"name"');
    await expect(payloadPre).toContainText('John Doe');
  });

  test('should show signature section', async ({ page }) => {
    await page.getByLabel('JWT token input').fill(VALID_JWT);
    await expect(page.getByText('Signature').first()).toBeVisible();
  });

  test('should show error alert for invalid JWT', async ({ page }) => {
    await page.getByLabel('JWT token input').fill('not.a.valid.jwt.token');
    await expect(page.getByRole('alert')).toBeVisible();
  });

  test('should not show decoded sections when input is empty', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Header/i })).toBeHidden();
    await expect(page.getByRole('heading', { name: /Payload/i })).toBeHidden();
  });

  test('should clear token when Clear is clicked', async ({ page }) => {
    const input = page.getByLabel('JWT token input');
    await input.fill(VALID_JWT);
    await page.getByRole('button', { name: /clear/i }).click();
    await expect(input).toHaveValue('');
    await expect(page.getByRole('heading', { name: /Header/i })).toBeHidden();
  });
});
