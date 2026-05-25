import { test, expect } from '@playwright/test';

test.describe('tsconfig.json Builder', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tsconfig-builder');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText(/tsconfig\.json Builder/i)).toBeVisible();
  });

  test('should show generated JSON output by default', async ({ page }) => {
    const pre = page.locator('pre');
    await expect(pre).toBeVisible();
    const text = await pre.textContent();
    expect(text).toContain('"compilerOptions"');
    expect(text).toContain('"strict"');
  });

  test('should reflect strict option toggle in JSON output', async ({ page }) => {
    // strict is checked by default; uncheck it
    const strictCheckbox = page.locator('input#strict');
    await strictCheckbox.uncheck();
    const pre = page.locator('pre');
    const text = await pre.textContent();
    // strict should be false or absent
    expect(text).not.toContain('"strict": true');
  });

  test('should update target when select is changed', async ({ page }) => {
    const targetSelect = page.locator('select#target');
    await targetSelect.selectOption('ES5');
    const pre = page.locator('pre');
    await expect(pre).toContainText('"ES5"');
  });

  test('should add a new include path', async ({ page }) => {
    // Click "Add" button in Include section
    const addButtons = page.getByRole('button', { name: /add/i });
    // The Include card Add button
    await addButtons.first().click();
    // A new input field should appear in the Include section
    const inputs = page.locator('input[placeholder="src"]');
    const count = await inputs.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('should show Copy and Download buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: /copy/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /download/i })).toBeVisible();
  });

  test('should have default include of src in generated JSON', async ({ page }) => {
    const pre = page.locator('pre');
    await expect(pre).toContainText('"src"');
  });
});
