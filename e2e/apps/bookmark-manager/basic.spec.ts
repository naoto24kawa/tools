import { test, expect } from '@playwright/test';

test.describe('Bookmark Manager', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/bookmark-manager');
    // Clear localStorage to ensure clean state
    await page.evaluate(() => localStorage.removeItem('bookmarks'));
    await page.reload();
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Bookmark Manager/i);
  });

  test('should display main heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Bookmark Manager' })).toBeVisible();
  });

  test('should show empty state message', async ({ page }) => {
    await expect(page.getByText(/No bookmarks yet/i)).toBeVisible();
  });

  test('should show Add Bookmark button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Add Bookmark/i })).toBeVisible();
  });

  test('should show add form when Add Bookmark is clicked', async ({ page }) => {
    await page.getByRole('button', { name: /Add Bookmark/i }).click();
    await expect(page.getByLabel('URL')).toBeVisible();
    await expect(page.getByLabel('Title')).toBeVisible();
  });

  test('should add a new bookmark', async ({ page }) => {
    await page.getByRole('button', { name: /Add Bookmark/i }).click();
    await page.getByLabel('URL').fill('https://example.com');
    await page.getByLabel('Title').fill('Example Site');
    await page.getByLabel('Description').fill('A test bookmark');
    await page.getByLabel(/Tags/).fill('test, example');
    await page.getByRole('button', { name: /^Add$/ }).click();

    await expect(page.getByText('Example Site')).toBeVisible();
    await expect(page.getByText('https://example.com')).toBeVisible();
  });

  test('should require URL and title when adding bookmark', async ({ page }) => {
    await page.getByRole('button', { name: /Add Bookmark/i }).click();
    await page.getByRole('button', { name: /^Add$/ }).click();
    // Validation toast should appear
    await expect(page.getByText(/URL and title are required/i)).toBeVisible();
  });

  test('should search bookmarks', async ({ page }) => {
    // Add a bookmark first
    await page.getByRole('button', { name: /Add Bookmark/i }).click();
    await page.getByLabel('URL').fill('https://playwright.dev');
    await page.getByLabel('Title').fill('Playwright Testing');
    await page.getByRole('button', { name: /^Add$/ }).click();

    // Search for it
    await page.getByPlaceholder('Search bookmarks...').fill('playwright');
    await expect(page.getByText('Playwright Testing')).toBeVisible();

    // Search for something that doesn't exist
    await page.getByPlaceholder('Search bookmarks...').fill('nonexistent');
    await expect(page.getByText(/No bookmarks match/i)).toBeVisible();
  });

  test('should delete a bookmark', async ({ page }) => {
    // Add a bookmark first
    await page.getByRole('button', { name: /Add Bookmark/i }).click();
    await page.getByLabel('URL').fill('https://example.com');
    await page.getByLabel('Title').fill('To Delete');
    await page.getByRole('button', { name: /^Add$/ }).click();

    await expect(page.getByText('To Delete')).toBeVisible();

    // Delete it
    await page.getByRole('button', { name: /Delete bookmark/i }).click();
    await expect(page.getByText('To Delete')).not.toBeVisible();
    await expect(page.getByText(/No bookmarks yet/i)).toBeVisible();
  });

  test('should edit a bookmark', async ({ page }) => {
    // Add a bookmark first
    await page.getByRole('button', { name: /Add Bookmark/i }).click();
    await page.getByLabel('URL').fill('https://example.com');
    await page.getByLabel('Title').fill('Original Title');
    await page.getByRole('button', { name: /^Add$/ }).click();

    // Edit it
    await page.getByRole('button', { name: /Edit bookmark/i }).click();
    await page.getByLabel('Title').fill('Updated Title');
    await page.getByRole('button', { name: /^Save$/ }).click();

    await expect(page.getByText('Updated Title')).toBeVisible();
  });

  test('should show export and import buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: /JSON/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /HTML/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Import/i })).toBeVisible();
  });

  test('should filter bookmarks by tag', async ({ page }) => {
    // Add a bookmark with a tag
    await page.getByRole('button', { name: /Add Bookmark/i }).click();
    await page.getByLabel('URL').fill('https://example.com');
    await page.getByLabel('Title').fill('Tagged Bookmark');
    await page.getByLabel(/Tags/).fill('work');
    await page.getByRole('button', { name: /^Add$/ }).click();

    // Tag button should appear
    await expect(page.getByText('work')).toBeVisible();
  });
});
