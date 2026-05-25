import { test, expect } from '@playwright/test';

test.describe('Changelog Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/changelog-generator');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Changelog Generator/i);
  });

  test('should display main heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Changelog Generator' })).toBeVisible();
  });

  test('should show project name input', async ({ page }) => {
    await expect(page.getByLabel(/Project Name/i)).toBeVisible();
  });

  test('should show initial version card', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Versions' })).toBeVisible();
    await expect(page.getByText('Unreleased').first()).toBeVisible();
  });

  test('should show preview panel with initial content', async ({ page }) => {
    await expect(page.getByText('Preview')).toBeVisible();
    // Default output should contain changelog boilerplate
    await expect(page.locator('pre')).toBeVisible();
  });

  test('should update version number', async ({ page }) => {
    await page.getByPlaceholder('1.0.0').first().fill('1.2.3');
    // Preview should update automatically
    await expect(page.locator('pre')).toContainText('1.2.3');
  });

  test('should set project name and show in preview', async ({ page }) => {
    await page.getByLabel(/Project Name/i).fill('MyApp');
    await expect(page.locator('pre')).toContainText('MyApp');
  });

  test('should add a new version', async ({ page }) => {
    await page.getByRole('button', { name: /Add Version/i }).click();
    // Two version cards should now exist; use Remove version button count as proxy (one per version card)
    const removeButtons = page.getByRole('button', { name: /Remove version/i });
    await expect(removeButtons).toHaveCount(2);
  });

  test('should add entry to a version', async ({ page }) => {
    await page.getByRole('button', { name: /Add Entry/i }).click();
    // Description input for entry should appear
    await expect(page.getByPlaceholder('Description of change...')).toBeVisible();
  });

  test('should generate changelog with Added category entry', async ({ page }) => {
    // Set version
    await page.getByPlaceholder('1.0.0').first().fill('1.0.0');

    // Add entry
    await page.getByRole('button', { name: /Add Entry/i }).click();
    await page.getByPlaceholder('Description of change...').fill('New feature added');

    // Preview should contain the entry
    await expect(page.locator('pre')).toContainText('New feature added');
  });

  test('should change entry category to Fixed', async ({ page }) => {
    await page.getByRole('button', { name: /Add Entry/i }).click();
    // Click category select
    await page.locator('[role="combobox"]').last().click();
    await page.getByRole('option', { name: 'Fixed' }).click();
    // Add description
    await page.getByPlaceholder('Description of change...').fill('Bug fix');
    await expect(page.locator('pre')).toContainText('Bug fix');
  });

  test('should remove an entry', async ({ page }) => {
    await page.getByRole('button', { name: /Add Entry/i }).click();
    await page.getByPlaceholder('Description of change...').fill('Test entry');
    // Remove entry
    await page.getByRole('button', { name: /Remove entry/i }).click();
    await expect(page.getByPlaceholder('Description of change...')).not.toBeVisible();
  });

  test('should show Copy and Download buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: /^Copy$/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Download/i })).toBeVisible();
  });

  test('should show Unreleased section in preview when no version is set', async ({ page }) => {
    await expect(page.locator('pre')).toContainText('Unreleased');
  });
});
