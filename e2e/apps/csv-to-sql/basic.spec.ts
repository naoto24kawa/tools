import { test, expect } from '@playwright/test';

test.describe('CSV to SQL', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/csv-to-sql');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText(/CSV to SQL/i)).toBeVisible();
  });

  test('should convert CSV to INSERT SQL statement', async ({ page }) => {
    const input = page.locator('textarea#input');
    await input.fill('name,age\nAlice,30');
    const output = page.locator('textarea#output');
    await expect(output).not.toHaveValue('');
    await expect(output).toContainText('INSERT');
  });

  test('should include column names in INSERT statement', async ({ page }) => {
    const input = page.locator('textarea#input');
    await input.fill('name,age,city\nBob,25,Tokyo');
    const output = page.locator('textarea#output');
    await expect(output).toContainText('name');
    await expect(output).toContainText('age');
    await expect(output).toContainText('city');
  });

  test('should include row values in INSERT statement', async ({ page }) => {
    const input = page.locator('textarea#input');
    await input.fill('name,age\nAlice,30');
    const output = page.locator('textarea#output');
    await expect(output).toContainText('Alice');
    await expect(output).toContainText('30');
  });

  test('should use default table name in SQL output', async ({ page }) => {
    const input = page.locator('textarea#input');
    await input.fill('id,name\n1,Test');
    const output = page.locator('textarea#output');
    const outputValue = await output.inputValue();
    // Default table name should appear in INSERT INTO statement (may use backtick quoting)
    expect(outputValue).toMatch(/INSERT INTO\s+[`\w]/i);
  });

  test('should use custom table name from settings', async ({ page }) => {
    await page.locator('input#tableName').fill('users');
    const input = page.locator('textarea#input');
    await input.fill('name,age\nAlice,30');
    const output = page.locator('textarea#output');
    await expect(output).toContainText('users');
  });

  test('should generate multiple INSERT statements for multiple rows', async ({ page }) => {
    const input = page.locator('textarea#input');
    await input.fill('name,age\nAlice,30\nBob,25\nCharlie,35');
    const output = page.locator('textarea#output');
    const outputValue = await output.inputValue();
    // Count INSERT occurrences
    const insertCount = (outputValue.match(/INSERT/gi) || []).length;
    expect(insertCount).toBeGreaterThanOrEqual(3);
  });

  test('should clear input when Clear button is clicked', async ({ page }) => {
    const input = page.locator('textarea#input');
    await input.fill('name,age\nAlice,30');
    await page.getByRole('button', { name: /Clear/i }).click();
    await expect(input).toHaveValue('');
  });

  test('should produce empty output when input is cleared', async ({ page }) => {
    const input = page.locator('textarea#input');
    await input.fill('name,age\nAlice,30');
    await page.getByRole('button', { name: /Clear/i }).click();
    const output = page.locator('textarea#output');
    await expect(output).toHaveValue('');
  });

  test('should quote string values when "文字列をクォート" is checked', async ({ page }) => {
    // quoteStrings checkbox is checked by default; verify string values are quoted
    const input = page.locator('textarea#input');
    await input.fill('name,age\nAlice,30');
    const output = page.locator('textarea#output');
    const outputValue = await output.inputValue();
    expect(outputValue).toContain("'Alice'");
  });
});
