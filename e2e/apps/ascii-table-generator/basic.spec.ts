import { test, expect } from '@playwright/test';

test.describe('ASCII Table Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ascii-table-generator');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page).toHaveTitle(/ASCII Table Generator/i);
    await expect(page.getByRole('heading', { name: 'ASCII Table Generator' })).toBeVisible();
  });

  test('should show Markdown Input and Grid Editor mode buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: /markdown input/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /grid editor/i })).toBeVisible();
  });

  test('should show markdown input textarea by default', async ({ page }) => {
    await expect(page.locator('#markdown-input')).toBeVisible();
  });

  test('should show convert buttons in markdown mode', async ({ page }) => {
    await expect(page.getByRole('button', { name: /markdown to ascii/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /ascii to markdown/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /load into grid/i })).toBeVisible();
  });

  test('should convert markdown table to ASCII', async ({ page }) => {
    const textarea = page.locator('#markdown-input');
    await textarea.fill('| Name | Age |\n| --- | --- |\n| Alice | 30 |\n| Bob | 25 |');

    await page.getByRole('button', { name: /markdown to ascii/i }).click();

    // Output section should appear with the ASCII table
    const output = page.locator('pre');
    await expect(output).toBeVisible();
    const outputText = await output.textContent();
    expect(outputText).toMatch(/Name|Age|Alice|Bob/);
    expect(outputText).toContain('+');
  });

  test('should switch to grid editor mode', async ({ page }) => {
    await page.getByRole('button', { name: /grid editor/i }).click();
    await expect(page.getByText('Grid Editor')).toBeVisible();
    await expect(page.locator('#num-rows')).toBeVisible();
    await expect(page.locator('#num-cols')).toBeVisible();
  });

  test('should generate ASCII table from grid editor', async ({ page }) => {
    await page.getByRole('button', { name: /grid editor/i }).click();

    // Set rows and cols
    await page.locator('#num-rows').fill('2');
    await page.locator('#num-cols').fill('2');

    // Generate
    await page.getByRole('button', { name: /generate ascii table/i }).click();

    const output = page.locator('pre');
    await expect(output).toBeVisible();
    const outputText = await output.textContent();
    expect(outputText).toContain('+');
  });

  test('should show rows and cols inputs in grid mode', async ({ page }) => {
    await page.getByRole('button', { name: /grid editor/i }).click();
    const rowsInput = page.locator('#num-rows');
    const colsInput = page.locator('#num-cols');
    await expect(rowsInput).toBeVisible();
    await expect(colsInput).toBeVisible();
    await expect(rowsInput).toHaveValue('3');
    await expect(colsInput).toHaveValue('3');
  });

  test('should show copy button after output is generated', async ({ page }) => {
    const textarea = page.locator('#markdown-input');
    await textarea.fill('| A | B |\n| --- | --- |\n| 1 | 2 |');
    await page.getByRole('button', { name: /markdown to ascii/i }).click();

    await expect(page.getByRole('button', { name: /copy/i })).toBeVisible();
  });

  test('should load markdown into grid editor', async ({ page }) => {
    const textarea = page.locator('#markdown-input');
    await textarea.fill('| Col1 | Col2 |\n| --- | --- |\n| a | b |');
    await page.getByRole('button', { name: /load into grid/i }).click();

    // Should switch to grid mode
    await expect(page.getByText('Grid Editor')).toBeVisible();
  });
});
