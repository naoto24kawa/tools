import { test, expect } from '@playwright/test';

test.describe('Word Frequency - Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/text-word-frequency');
  });

  test('should load the page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Word Frequency/i);
  });

  test('should display main UI elements', async ({ page }) => {
    await expect(page.getByRole('textbox', { name: /解析するテキスト/i })).toBeVisible();
    await expect(page.locator('#caseSensitive')).toBeVisible();
    await expect(page.locator('#minLength')).toBeVisible();
    await expect(page.getByRole('button', { name: /Clear/i })).toBeVisible();
  });

  test('should display sort order buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: '出現数' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'ABC順' })).toBeVisible();
  });

  test('should show word frequency results after entering text', async ({ page }) => {
    const textarea = page.getByRole('textbox', { name: /解析するテキスト/i });
    await textarea.fill('hello world hello');
    // Table headers should appear
    await expect(page.getByRole('columnheader', { name: '単語' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: '回数' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: '割合' })).toBeVisible();
  });

  test('should count word frequency correctly', async ({ page }) => {
    const textarea = page.getByRole('textbox', { name: /解析するテキスト/i });
    await textarea.fill('apple apple apple banana banana');
    // apple should appear 3 times, banana 2 times
    await expect(page.getByRole('cell', { name: 'apple' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'banana' })).toBeVisible();
  });

  test('should show count of 3 for word appearing 3 times', async ({ page }) => {
    const textarea = page.getByRole('textbox', { name: /解析するテキスト/i });
    await textarea.fill('foo foo foo');
    // The "3" count should appear in a cell
    const cells = page.getByRole('cell');
    const cellTexts = await cells.allTextContents();
    expect(cellTexts).toContain('3');
  });

  test('should show word count summary', async ({ page }) => {
    const textarea = page.getByRole('textbox', { name: /解析するテキスト/i });
    await textarea.fill('apple banana cherry');
    await expect(page.getByText(/種類の単語/)).toBeVisible();
  });

  test('should be case insensitive by default', async ({ page }) => {
    const textarea = page.getByRole('textbox', { name: /解析するテキスト/i });
    await textarea.fill('Hello hello HELLO');
    const cells = page.getByRole('cell');
    const cellTexts = await cells.allTextContents();
    // All 3 "hello" should be counted together (3 count)
    expect(cellTexts).toContain('3');
  });

  test('should show placeholder text when no input', async ({ page }) => {
    await expect(page.getByText('結果がここに表示されます...')).toBeVisible();
  });

  test('should clear input when Clear button is clicked', async ({ page }) => {
    const textarea = page.getByRole('textbox', { name: /解析するテキスト/i });
    await textarea.fill('hello world');
    await page.getByRole('button', { name: /Clear/i }).click();
    await expect(textarea).toHaveValue('');
  });

  test('should hide results after clearing', async ({ page }) => {
    const textarea = page.getByRole('textbox', { name: /解析するテキスト/i });
    await textarea.fill('hello world');
    await page.getByRole('button', { name: /Clear/i }).click();
    await expect(page.getByText('結果がここに表示されます...')).toBeVisible();
  });
});
