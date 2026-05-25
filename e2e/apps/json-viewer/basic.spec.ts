import { test, expect } from '@playwright/test';

test.describe('JSON Viewer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/json-viewer');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/JSON Viewer/i);
  });

  test('should show heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'JSON Viewer' })).toBeVisible();
  });

  test('should show Tree View panel', async ({ page }) => {
    await expect(page.getByText('Tree View')).toBeVisible();
  });

  test('should render tree for valid JSON object', async ({ page }) => {
    const input = page.locator('#json-input');
    await input.fill('{"name": "Alice", "age": 30}');
    // The tree renders keys as text in the tree view
    await expect(page.getByText('name:')).toBeVisible();
    await expect(page.getByText('age:')).toBeVisible();
  });

  test('should render tree for nested JSON', async ({ page }) => {
    const input = page.locator('#json-input');
    await input.fill('{"user": {"id": 1, "role": "admin"}}');
    await expect(page.getByRole('button', { name: /collapse user/i })).toBeVisible();
  });

  test('should show expand/collapse toggle buttons for objects', async ({ page }) => {
    const input = page.locator('#json-input');
    await input.fill('{"items": [1, 2, 3]}');
    // Expand/collapse buttons should appear
    await expect(page.getByRole('button', { name: /expand|collapse/i }).first()).toBeVisible();
  });

  test('should collapse a node when toggle button is clicked', async ({ page }) => {
    const input = page.locator('#json-input');
    await input.fill('{"data": {"x": 1, "y": 2}}');
    const collapseBtn = page.getByRole('button', { name: /collapse data/i });
    await expect(collapseBtn).toBeVisible();
    await collapseBtn.click();
    // After collapsing, button label changes to "Expand data"
    await expect(page.getByRole('button', { name: /expand data/i })).toBeVisible();
  });

  test('should expand a collapsed node', async ({ page }) => {
    const input = page.locator('#json-input');
    await input.fill('{"data": {"x": 1}}');
    const collapseBtn = page.getByRole('button', { name: /collapse data/i });
    await collapseBtn.click();
    // After collapsing, button label changes to "Expand data"
    const expandBtn = page.getByRole('button', { name: /expand data/i });
    await expect(expandBtn).toBeVisible();
    await expandBtn.click();
    // After expanding, button label changes back to "Collapse data"
    await expect(page.getByRole('button', { name: /collapse data/i })).toBeVisible();
  });

  test('should show error for invalid JSON', async ({ page }) => {
    const input = page.locator('#json-input');
    await input.fill('{not valid}');
    await expect(page.getByRole('alert')).toBeVisible();
  });

  test('should show placeholder text when input is empty', async ({ page }) => {
    await expect(page.getByText('JSONを入力してください')).toBeVisible();
  });
});
