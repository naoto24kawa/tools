import { test, expect } from '@playwright/test';

test.describe('.htpasswd Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/htpasswd-generator');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText('.htpasswd Generator')).toBeVisible();
  });

  test('should have username and password inputs', async ({ page }) => {
    await expect(page.locator('input#username')).toBeVisible();
    await expect(page.locator('input#password')).toBeVisible();
  });

  test('should disable generate button when inputs are empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /generate/i })).toBeDisabled();
  });

  test('should enable generate button when inputs are filled', async ({ page }) => {
    await page.locator('input#username').fill('admin');
    await page.locator('input#password').fill('secret');
    await expect(page.getByRole('button', { name: /generate/i })).toBeEnabled();
  });

  test('should generate htpasswd entry', async ({ page }) => {
    await page.locator('input#username').fill('admin');
    await page.locator('input#password').fill('secret123');
    await page.getByRole('button', { name: /generate/i }).click();
    // htpasswd format: username:hash
    const output = page.locator('textarea#output');
    await expect(output).not.toBeEmpty({ timeout: 10000 });
    const content = await output.inputValue();
    expect(content).toContain('admin:');
  });

  test('should generate bcrypt hash by default (starts with $2)', async ({ page }) => {
    await page.locator('input#username').fill('user');
    await page.locator('input#password').fill('password');
    await page.getByRole('button', { name: /generate/i }).click();
    const output = page.locator('textarea#output');
    await expect(output).not.toBeEmpty({ timeout: 10000 });
    const content = await output.inputValue();
    expect(content).toContain('$2');
  });

  test('should show hash type selector', async ({ page }) => {
    await expect(page.locator('#hashType')).toBeVisible();
  });

  test('should enable copy button after generation', async ({ page }) => {
    await page.locator('input#username').fill('admin');
    await page.locator('input#password').fill('secret');
    await page.getByRole('button', { name: /generate/i }).click();
    await expect(page.getByRole('button', { name: /copy result/i })).toBeEnabled({ timeout: 10000 });
  });

  test('should clear all inputs when clear button clicked', async ({ page }) => {
    await page.locator('input#username').fill('admin');
    await page.locator('input#password').fill('secret');
    await page.getByRole('button', { name: /clear/i }).click();
    await expect(page.locator('input#username')).toHaveValue('');
    await expect(page.locator('input#password')).toHaveValue('');
  });
});
