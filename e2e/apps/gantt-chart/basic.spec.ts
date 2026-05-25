import { test, expect } from '@playwright/test';

test.describe('Gantt Chart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/gantt-chart');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page).toHaveTitle(/Gantt Chart/i);
    await expect(page.getByText('Gantt Chart')).toBeVisible();
  });

  test('should show Task Data panel with inputs', async ({ page }) => {
    await expect(page.getByText('Task Data')).toBeVisible();
    await expect(page.getByText('Chart Title')).toBeVisible();
    await expect(page.getByText(/Tasks/)).toBeVisible();
  });

  test('should show default chart title input', async ({ page }) => {
    const titleInput = page.getByPlaceholder(/task name, yyyy-mm-dd/i).or(
      page.locator('input').filter({ hasText: '' }).first()
    );
    // Check chart title input has value
    await expect(page.locator('input').first()).toHaveValue('Project Gantt Chart');
  });

  test('should show sample data in textarea', async ({ page }) => {
    await expect(page.getByRole('textbox').last()).toContainText('Planning');
    await expect(page.getByRole('textbox').last()).toContainText('2024-01-01');
  });

  test('should show tasks parsed count', async ({ page }) => {
    await expect(page.getByText(/tasks parsed/)).toBeVisible();
  });

  test('should render canvas element for chart', async ({ page }) => {
    await expect(page.locator('canvas')).toBeVisible();
  });

  test('should show Timeline section with Download PNG button', async ({ page }) => {
    await expect(page.getByText('Timeline')).toBeVisible();
    await expect(page.getByRole('button', { name: /download png/i })).toBeVisible();
  });

  test('should update task count when tasks are added', async ({ page }) => {
    const textarea = page.getByRole('textbox').last();
    await textarea.fill('Task A, 2024-01-01, 5, dev\nTask B, 2024-01-06, 3, test');

    await expect(page.getByText(/2 tasks parsed/)).toBeVisible();
  });

  test('should update chart title when input changes', async ({ page }) => {
    const titleInput = page.locator('input').first();
    await titleInput.fill('My Custom Project');

    await expect(titleInput).toHaveValue('My Custom Project');
  });

  test('should show 0 tasks when textarea is cleared', async ({ page }) => {
    const textarea = page.getByRole('textbox').last();
    await textarea.fill('');

    await expect(page.getByText(/0 tasks parsed/)).toBeVisible();
  });
});
