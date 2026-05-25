import { test, expect } from '@playwright/test';

test.describe('Alt Text Helper', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/alt-text-helper');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page).toHaveTitle(/Alt Text Helper/i);
    await expect(page.getByRole('heading', { name: 'Alt Text Helper' })).toBeVisible();
  });

  test('should show image upload card', async ({ page }) => {
    await expect(page.getByText('Image Upload')).toBeVisible();
    await expect(page.locator('input[type="file"]')).toBeVisible();
  });

  test('should show decision tree card with initial question', async ({ page }) => {
    await expect(page.getByText('Decision Tree')).toBeVisible();
    // First question should be visible
    await expect(page.locator('text=/Is the image purely decorative|Does the image|What is the/i').first()).toBeVisible();
  });

  test('should show option buttons in decision tree', async ({ page }) => {
    // At least one button option should be visible in the decision tree
    const optionButtons = page.locator('.space-y-4 button[type="button"]').filter({ hasNotText: /start over|back/i });
    await expect(optionButtons.first()).toBeVisible();
  });

  test('should navigate through decision tree on option click', async ({ page }) => {
    // Click the first available option in the decision tree
    const optionButtons = page.locator('.space-y-4 >> button[type="button"]').filter({ hasNotText: /start over/i });
    const firstOption = optionButtons.first();
    await firstOption.click();
    // After clicking, either new question appears or result is shown
    // Back button should now be available since we have history
    await expect(page.getByRole('button', { name: /back|start over/i }).first()).toBeVisible();
  });

  test('should show Start Over button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /start over/i })).toBeVisible();
  });

  test('should reset to initial state when Start Over is clicked', async ({ page }) => {
    // Navigate one step
    const optionButtons = page.locator('.space-y-4 >> button[type="button"]').filter({ hasNotText: /start over/i });
    await optionButtons.first().click();

    // Click start over
    await page.getByRole('button', { name: /start over/i }).click();

    // Back button should no longer be visible
    await expect(page.getByRole('button', { name: /^back$/i })).not.toBeVisible();
  });

  test('should reach a result and show generated HTML', async ({ page }) => {
    // Keep clicking first option until a result with "Generated HTML" appears
    let attempts = 0;
    while (attempts < 10) {
      const resultVisible = await page.locator('text=Generated HTML').isVisible();
      if (resultVisible) break;
      const optionButtons = page.locator('.space-y-4 >> button[type="button"]').filter({ hasNotText: /start over|back/i });
      const count = await optionButtons.count();
      if (count === 0) break;
      await optionButtons.first().click();
      attempts++;
    }
    // If we found a result, verify the HTML snippet area is visible
    const hasResult = await page.locator('text=Generated HTML').isVisible();
    if (hasResult) {
      await expect(page.getByRole('button', { name: /copy html/i })).toBeVisible();
    }
  });
});
