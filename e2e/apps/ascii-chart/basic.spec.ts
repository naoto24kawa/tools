import { test, expect } from '@playwright/test';

test.describe('ASCII Chart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ascii-chart');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page).toHaveTitle(/ASCII Chart/i);
    await expect(page.getByRole('heading', { name: 'ASCII Chart' })).toBeVisible();
  });

  test('should show data input textarea with sample data', async ({ page }) => {
    const textarea = page.locator('textarea');
    await expect(textarea).toBeVisible();
    await expect(textarea).toHaveValue(/JavaScript/);
  });

  test('should show chart type selector', async ({ page }) => {
    await expect(page.getByText('Chart Type')).toBeVisible();
  });

  test('should show bar character input', async ({ page }) => {
    await expect(page.getByText('Bar Character')).toBeVisible();
  });

  test('should show max width input', async ({ page }) => {
    await expect(page.getByText('Max Width')).toBeVisible();
  });

  test('should show show values checkbox', async ({ page }) => {
    await expect(page.getByText('Show Values')).toBeVisible();
    await expect(page.locator('input[type="checkbox"]')).toBeVisible();
  });

  test('should generate horizontal chart output with sample data', async ({ page }) => {
    // Sample data is pre-loaded, output should be visible
    const output = page.locator('pre');
    await expect(output).toBeVisible();
    const outputText = await output.textContent();
    expect(outputText).toContain('#');
  });

  test('should update chart when custom data is entered', async ({ page }) => {
    const textarea = page.locator('textarea');
    await textarea.fill('Apple, 10\nBanana, 20\nCherry, 5');

    const output = page.locator('pre');
    await expect(output).toBeVisible();
    const outputText = await output.textContent();
    expect(outputText).toMatch(/Apple|Banana|Cherry/);
  });

  test('should switch to vertical chart type', async ({ page }) => {
    // Click the chart type select trigger
    const selectTrigger = page.locator('[role="combobox"]').first();
    await selectTrigger.click();
    await page.getByRole('option', { name: 'Vertical' }).click();

    const output = page.locator('pre');
    await expect(output).toBeVisible();
    const outputText = await output.textContent();
    expect(outputText?.length).toBeGreaterThan(0);
  });

  test('should have Copy button for output', async ({ page }) => {
    await expect(page.getByRole('button', { name: /copy/i })).toBeVisible();
  });

  test('should update chart when bar character changes', async ({ page }) => {
    const barCharInput = page.locator('input.font-mono');
    await barCharInput.fill('*');

    const output = page.locator('pre');
    const outputText = await output.textContent();
    expect(outputText).toContain('*');
  });
});
