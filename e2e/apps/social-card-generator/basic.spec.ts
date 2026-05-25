import { test, expect } from '@playwright/test';

test.describe('Social Card Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/social-card-generator');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText('Social Card Generator')).toBeVisible();
  });

  test('should show canvas preview', async ({ page }) => {
    await expect(page.locator('canvas')).toBeVisible();
  });

  test('should have settings panel with title input', async ({ page }) => {
    await expect(page.locator('#title')).toBeVisible();
    await expect(page.locator('#subtitle')).toBeVisible();
    await expect(page.locator('#author')).toBeVisible();
  });

  test('should update title field', async ({ page }) => {
    const titleInput = page.locator('#title');
    await titleInput.fill('Test Blog Post');
    await expect(titleInput).toHaveValue('Test Blog Post');
  });

  test('should update subtitle field', async ({ page }) => {
    const subtitleInput = page.locator('#subtitle');
    await subtitleInput.fill('A test subtitle');
    await expect(subtitleInput).toHaveValue('A test subtitle');
  });

  test('should update author field', async ({ page }) => {
    const authorInput = page.locator('#author');
    await authorInput.fill('Jane Doe');
    await expect(authorInput).toHaveValue('Jane Doe');
  });

  test('should have layout selector', async ({ page }) => {
    await expect(page.getByText('Centered')).toBeVisible();
  });

  test('should have background type selector', async ({ page }) => {
    await expect(page.getByText('Gradient')).toBeVisible();
  });

  test('should show download button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /download png/i })).toBeVisible();
  });

  test('should show preview card section', async ({ page }) => {
    await expect(page.getByText('Preview')).toBeVisible();
  });

  test('should show settings card section', async ({ page }) => {
    await expect(page.getByText('Settings')).toBeVisible();
  });
});
