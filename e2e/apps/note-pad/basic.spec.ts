import { test, expect } from '@playwright/test';

test.describe('Note Pad', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/note-pad');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText(/Note Pad/i)).toBeVisible();
  });

  test('should show New note button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /New/i })).toBeVisible();
  });

  test('should create a new note when New button is clicked', async ({ page }) => {
    await page.getByRole('button', { name: /New/i }).click();
    // After creation the editor or note list should be populated
    const textarea = page.getByLabel('Note content');
    await expect(textarea).toBeVisible();
  });

  test('should allow typing content into the note editor', async ({ page }) => {
    await page.getByRole('button', { name: /New/i }).click();
    const textarea = page.getByLabel('Note content');
    await textarea.fill('My first test note');
    await expect(textarea).toHaveValue('My first test note');
  });

  test('should show Preview button when a note is selected', async ({ page }) => {
    await page.getByRole('button', { name: /New/i }).click();
    await expect(page.getByRole('button', { name: /Preview/i })).toBeVisible();
  });

  test('should switch to preview mode and back to edit mode', async ({ page }) => {
    await page.getByRole('button', { name: /New/i }).click();
    const textarea = page.getByLabel('Note content');
    await textarea.fill('# Hello');
    // Switch to preview
    await page.getByRole('button', { name: /Preview/i }).click();
    await expect(page.getByRole('button', { name: /Edit/i })).toBeVisible();
    // Switch back
    await page.getByRole('button', { name: /Edit/i }).click();
    await expect(textarea).toBeVisible();
  });

  test('should show search input', async ({ page }) => {
    await expect(page.getByPlaceholder(/Search notes/i)).toBeVisible();
  });

  test('should filter notes via search', async ({ page }) => {
    // Create a note
    await page.getByRole('button', { name: /New/i }).click();
    const textarea = page.getByLabel('Note content');
    await textarea.fill('unique-search-keyword-xyz');

    // Search for it
    await page.getByPlaceholder(/Search notes/i).fill('unique-search-keyword-xyz');
    // At least one note item should remain visible in the sidebar
    await expect(page.locator('nav').getByRole('button').filter({ hasText: /Untitled|New Note/ }).first()).toBeVisible();
  });

  test('should show Export button for a selected note', async ({ page }) => {
    await page.getByRole('button', { name: /New/i }).click();
    await expect(page.getByRole('button', { name: /Export/i })).toBeVisible();
  });
});
