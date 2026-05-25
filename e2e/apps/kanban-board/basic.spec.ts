import { test, expect } from '@playwright/test';

test.describe('Kanban Board', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/kanban-board');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Kanban/i);
  });

  test('should show heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Kanban Board' })).toBeVisible();
  });

  test('should display three columns: Todo, In Progress, Done', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Todo/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /In Progress/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Done/i })).toBeVisible();
  });

  test('should open add card form when plus button clicked', async ({ page }) => {
    // Click the + button next to the first column (Todo)
    const plusButtons = page.getByRole('button').filter({ has: page.locator('svg') });
    await plusButtons.first().click();

    await expect(page.getByPlaceholder('Card title')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add' })).toBeVisible();
  });

  test('should add a new card to Todo column', async ({ page }) => {
    // Open add form for first column
    const plusButtons = page.getByRole('button').filter({ has: page.locator('svg') });
    await plusButtons.first().click();

    await page.getByPlaceholder('Card title').fill('Test Task');
    await page.getByRole('button', { name: 'Add' }).click();

    await expect(page.getByText('Test Task')).toBeVisible();
  });

  test('should cancel add card form', async ({ page }) => {
    const plusButtons = page.getByRole('button').filter({ has: page.locator('svg') });
    await plusButtons.first().click();
    await expect(page.getByPlaceholder('Card title')).toBeVisible();

    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByPlaceholder('Card title')).not.toBeVisible();
  });

  test('should add a card with description', async ({ page }) => {
    const plusButtons = page.getByRole('button').filter({ has: page.locator('svg') });
    await plusButtons.first().click();

    await page.getByPlaceholder('Card title').fill('Task with Desc');
    await page.getByPlaceholder('Description (optional)').fill('This is a description');
    await page.getByRole('button', { name: 'Add' }).click();

    await expect(page.getByText('Task with Desc')).toBeVisible();
    await expect(page.getByText('This is a description')).toBeVisible();
  });

  test('should move a card to the right column', async ({ page }) => {
    // Add a card to Todo
    const plusButtons = page.getByRole('button').filter({ has: page.locator('svg') });
    await plusButtons.first().click();
    await page.getByPlaceholder('Card title').fill('Move Me');
    await page.getByRole('button', { name: 'Add' }).click();

    // Click the right arrow button (ChevronRight) to move card
    await page.getByRole('button', { name: '' }).last().click();
    // Card should still be visible (now in In Progress)
    await expect(page.getByText('Move Me')).toBeVisible();
  });

  test('should delete a card', async ({ page }) => {
    // Add a card
    const plusButtons = page.getByRole('button').filter({ has: page.locator('svg') });
    await plusButtons.first().click();
    await page.getByPlaceholder('Card title').fill('Delete Me');
    await page.getByRole('button', { name: 'Add' }).click();
    await expect(page.getByText('Delete Me')).toBeVisible();

    // Click delete button (aria-label="Delete card")
    await page.getByRole('button', { name: 'Delete card' }).first().click();
    await expect(page.getByText('Delete Me')).not.toBeVisible();
  });
});
