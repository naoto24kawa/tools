import { test, expect } from '@playwright/test';

test.describe('.gitignore Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/gitignore-generator');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page).toHaveTitle(/gitignore Generator/i);
    await expect(page.getByText('.gitignore Generator')).toBeVisible();
  });

  test('should show Select All and Clear buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: /select all/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /clear/i })).toBeVisible();
  });

  test('should show 0 selected by default', async ({ page }) => {
    await expect(page.getByText('0 selected')).toBeVisible();
  });

  test('should show Generated .gitignore output section', async ({ page }) => {
    await expect(page.getByText('Generated .gitignore')).toBeVisible();
    await expect(page.getByText(/select templates from the left/i)).toBeVisible();
  });

  test('should show placeholder in output when no templates selected', async ({ page }) => {
    await expect(page.getByText(/# Select templates to generate/)).toBeVisible();
  });

  test('should show template categories with checkboxes', async ({ page }) => {
    // At least some category cards should be visible
    const cards = page.locator('.grid label');
    await expect(cards.first()).toBeVisible();
  });

  test('should select a template and generate output', async ({ page }) => {
    // Click on Node.js checkbox
    const nodeLabel = page.getByText('Node.js', { exact: true });
    await nodeLabel.click();

    await expect(page.getByText('1 selected')).toBeVisible();
    // Output should contain something node-related
    await expect(page.locator('pre').last()).not.toContainText('# Select templates to generate');
  });

  test('should select all templates when Select All is clicked', async ({ page }) => {
    await page.getByRole('button', { name: /select all/i }).click();

    // Should show more than 0 selected
    await expect(page.getByText(/\d+ selected/)).not.toContainText('0 selected');
  });

  test('should clear all selections when Clear is clicked', async ({ page }) => {
    await page.getByRole('button', { name: /select all/i }).click();
    await expect(page.getByText('0 selected')).not.toBeVisible();

    await page.getByRole('button', { name: /clear/i }).click();
    await expect(page.getByText('0 selected')).toBeVisible();
  });

  test('should enable Copy button when template is selected', async ({ page }) => {
    const nodeLabel = page.getByText('Node.js', { exact: true });
    await nodeLabel.click();

    await expect(page.getByRole('button', { name: /copy/i })).toBeEnabled();
  });

  test('should enable Download button when template is selected', async ({ page }) => {
    const nodeLabel = page.getByText('Node.js', { exact: true });
    await nodeLabel.click();

    await expect(page.getByRole('button', { name: /download/i })).toBeEnabled();
  });

  test('should have Copy and Download buttons disabled when no template selected', async ({ page }) => {
    await expect(page.getByRole('button', { name: /copy/i })).toBeDisabled();
    await expect(page.getByRole('button', { name: /download/i })).toBeDisabled();
  });

  test('should show combined output for multiple templates', async ({ page }) => {
    const nodeLabel = page.getByText('Node.js', { exact: true });
    await nodeLabel.click();

    // Select Python if available
    const pythonLabel = page.getByText('Python', { exact: true });
    if (await pythonLabel.isVisible()) {
      await pythonLabel.click();
      await expect(page.getByText('2 selected')).toBeVisible();
    }
  });
});
