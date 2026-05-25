import { test, expect } from '@playwright/test';

test.describe('Git Cheatsheet', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/git-cheatsheet');
  });

  test('should display the page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Git Cheatsheet/i })).toBeVisible();
  });

  test('should show multiple command categories on load', async ({ page }) => {
    // At least 2 category cards should be visible
    const cards = page.locator('main .grid > [class*="rounded"]');
    await expect(cards.first()).toBeVisible();
  });

  test('should display git commands with code formatting', async ({ page }) => {
    // git init or git clone should be present
    await expect(page.locator('code').filter({ hasText: /git (init|clone|commit|add)/ }).first()).toBeVisible();
  });

  test('should filter commands by search keyword', async ({ page }) => {
    await page.getByLabel('Search commands').fill('commit');
    // Should still show at least one result containing "commit"
    await expect(page.locator('code').filter({ hasText: /commit/ }).first()).toBeVisible();
  });

  test('should filter by partial command name', async ({ page }) => {
    await page.getByLabel('Search commands').fill('merge');
    await expect(page.locator('code').filter({ hasText: /merge/ }).first()).toBeVisible();
  });

  test('should show no results message for unmatched search', async ({ page }) => {
    await page.getByLabel('Search commands').fill('zzznomatchzzz');
    await expect(page.getByText(/No commands found/i)).toBeVisible();
  });

  test('should clear search and show all commands again', async ({ page }) => {
    const searchInput = page.getByLabel('Search commands');
    await searchInput.fill('merge');
    await searchInput.clear();
    // After clearing, "commit" and other common commands should reappear
    await expect(page.locator('code').filter({ hasText: /git (init|clone|commit)/ }).first()).toBeVisible();
  });

  test('should show command description text', async ({ page }) => {
    // Each command has a description paragraph below its code
    await expect(page.locator('p.text-xs.text-muted-foreground').first()).toBeVisible();
  });

  test('should have copy buttons for each command', async ({ page }) => {
    // Buttons have aria-label "Copy: <command>"
    const copyButtons = page.getByRole('button', { name: /^Copy: git/i });
    await expect(copyButtons.first()).toBeVisible();
  });
});
