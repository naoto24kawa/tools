import { test, expect } from '@playwright/test';

test.describe('Git Commit Message Builder', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/git-commit-message');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page).toHaveTitle(/Git Commit Message/i);
    await expect(page.getByText('Git Commit Message Builder')).toBeVisible();
  });

  test('should show Message Builder section', async ({ page }) => {
    await expect(page.getByText('Message Builder')).toBeVisible();
    await expect(page.locator('#type')).toBeVisible();
    await expect(page.locator('#description')).toBeVisible();
  });

  test('should show Preview section', async ({ page }) => {
    await expect(page.getByText('Preview')).toBeVisible();
    await expect(page.getByText(/enter a description to generate/i)).toBeVisible();
  });

  test('should generate commit message when description is entered', async ({ page }) => {
    await page.locator('#description').fill('add user authentication');

    await expect(page.locator('pre')).toContainText('feat: add user authentication');
  });

  test('should use selected commit type in message', async ({ page }) => {
    // Change type to fix
    await page.locator('#type').click();
    await page.getByRole('option', { name: /fix/i }).first().click();

    await page.locator('#description').fill('resolve login bug');

    await expect(page.locator('pre')).toContainText('fix: resolve login bug');
  });

  test('should include scope in message when provided', async ({ page }) => {
    await page.locator('#scope').fill('auth');
    await page.locator('#description').fill('add OAuth support');

    await expect(page.locator('pre')).toContainText('feat(auth): add OAuth support');
  });

  test('should include footer in message when provided', async ({ page }) => {
    await page.locator('#description').fill('update config');
    await page.locator('#footer').fill('Closes #123');

    await expect(page.locator('pre')).toContainText('Closes #123');
  });

  test('should mark as breaking change when checkbox is checked', async ({ page }) => {
    await page.locator('#description').fill('change API response format');
    await page.locator('#breaking').check();

    await expect(page.locator('pre')).toContainText('BREAKING CHANGE');
  });

  test('should show description character count', async ({ page }) => {
    await page.locator('#description').fill('test description');

    await expect(page.getByText(/16\/100 characters/)).toBeVisible();
  });

  test('should enable Copy Message button when description is entered', async ({ page }) => {
    await page.locator('#description').fill('some change');

    await expect(page.getByRole('button', { name: /copy message/i })).toBeEnabled();
  });

  test('should have Copy Message button disabled when no description', async ({ page }) => {
    await expect(page.getByRole('button', { name: /copy message/i })).toBeDisabled();
  });

  test('should reset all fields when Reset button is clicked', async ({ page }) => {
    await page.locator('#scope').fill('ui');
    await page.locator('#description').fill('some change');
    await page.locator('#footer').fill('Closes #99');

    await page.getByRole('button', { name: /reset/i }).click();

    await expect(page.locator('#scope')).toHaveValue('');
    await expect(page.locator('#description')).toHaveValue('');
    await expect(page.locator('#footer')).toHaveValue('');
  });

  test('should show body textarea', async ({ page }) => {
    await expect(page.locator('#body')).toBeVisible();
  });
});
