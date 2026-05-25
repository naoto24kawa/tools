import { test, expect } from '@playwright/test';

test.describe('Mermaid Preview', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/mermaid-preview');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText(/Mermaid Preview/i)).toBeVisible();
  });

  test('should render SVG diagram from default flowchart syntax', async ({ page }) => {
    // Default example is loaded on mount — SVG should appear immediately
    await expect(page.locator('svg')).toBeVisible();
  });

  test('should update diagram when syntax is changed', async ({ page }) => {
    const textarea = page.getByRole('textbox').first();
    await textarea.fill('graph LR\n  X --> Y');
    // SVG should still be visible after change
    await expect(page.locator('svg')).toBeVisible();
    // Node/edge count reflects updated diagram
    await expect(page.getByText(/Nodes:/)).toBeVisible();
  });

  test('should show node and edge counts', async ({ page }) => {
    await expect(page.getByText(/Nodes:/)).toBeVisible();
    await expect(page.getByText(/Edges:/)).toBeVisible();
  });

  test('should load example template via select', async ({ page }) => {
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: /Sequence/i }).click();
    await expect(page.locator('svg')).toBeVisible();
  });

  test('should display Copy SVG button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Copy SVG/i })).toBeVisible();
  });

  test('should display SVG and PNG download buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: /^SVG$/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /^PNG$/i })).toBeVisible();
  });
});
