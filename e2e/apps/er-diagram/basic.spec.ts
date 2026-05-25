import { test, expect } from '@playwright/test';

test.describe('ER Diagram', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/er-diagram');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText('ER Diagram')).toBeVisible();
  });

  test('should have sample data pre-filled in textarea', async ({ page }) => {
    const textarea = page.locator('textarea');
    const value = await textarea.inputValue();
    expect(value).toContain('[Users]');
    expect(value).toContain('[Posts]');
  });

  test('should show Table Definitions and Diagram sections', async ({ page }) => {
    await expect(page.getByText('Table Definitions', { exact: true })).toBeVisible();
    await expect(page.getByText('Diagram', { exact: true })).toBeVisible();
  });

  test('should generate SVG diagram from sample data', async ({ page }) => {
    // SVG should be rendered in the diagram area
    await expect(page.locator('svg')).toBeVisible();
  });

  test('should show table count based on input', async ({ page }) => {
    // The sample has 5 tables: Users, Posts, Comments, Tags, PostTags
    await expect(page.getByText(/5 tables/)).toBeVisible();
  });

  test('should show relationship count', async ({ page }) => {
    // The sample has relationships (FK references)
    await expect(page.getByText(/relationships/)).toBeVisible();
  });

  test('should update diagram when new table is added', async ({ page }) => {
    const textarea = page.locator('textarea');
    await textarea.fill('[Users]\nid INT PK\nname VARCHAR(50)\n\n[Orders]\nid INT PK\nuser_id INT FK -> Users.id');
    await expect(page.getByText(/2 tables/)).toBeVisible();
    await expect(page.locator('svg')).toBeVisible();
  });

  test('should show Copy SVG button', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Copy SVG' })).toBeVisible();
  });

  test('should show SVG download button', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'SVG', exact: true })).toBeVisible();
  });

  test('should show PNG download button', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'PNG' })).toBeVisible();
  });

  test('should render entity names in the SVG', async ({ page }) => {
    // Users entity should appear in the SVG
    const diagramArea = page.locator('.border.rounded-md.p-4');
    await expect(diagramArea).toContainText('Users');
    await expect(diagramArea).toContainText('Posts');
  });
});
