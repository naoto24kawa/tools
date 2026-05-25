import { test, expect } from '@playwright/test';

test.describe('SQL Playground', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sql-playground');
    // Wait for SQL engine to initialize
    await expect(page.getByText('SQL Playground')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('SQL Editor')).toBeVisible({ timeout: 15000 });
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText('SQL Playground')).toBeVisible();
  });

  test('should show SQL editor textarea', async ({ page }) => {
    await expect(page.getByLabel('SQL editor')).toBeVisible();
  });

  test('should have example queries pre-loaded', async ({ page }) => {
    const editor = page.getByLabel('SQL editor');
    const value = await editor.inputValue();
    expect(value).toContain('CREATE TABLE users');
  });

  test('should have Run button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /run/i })).toBeVisible();
  });

  test('should have Clear History button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /clear history/i })).toBeVisible();
  });

  test('should show Tables panel', async ({ page }) => {
    await expect(page.getByText('Tables')).toBeVisible();
  });

  test('should execute SELECT query and show results', async ({ page }) => {
    const editor = page.getByLabel('SQL editor');
    await editor.fill('CREATE TABLE test (id INTEGER, name TEXT);\nINSERT INTO test VALUES (1, \'hello\');\nSELECT * FROM test;');
    await page.getByRole('button', { name: /run/i }).click();
    // Results table should appear with column headers
    await expect(page.getByText('Results')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('hello')).toBeVisible({ timeout: 5000 });
  });

  test('should show row count after SELECT', async ({ page }) => {
    const editor = page.getByLabel('SQL editor');
    await editor.fill('CREATE TABLE t2 (id INTEGER);\nINSERT INTO t2 VALUES (1);\nINSERT INTO t2 VALUES (2);\nSELECT * FROM t2;');
    await page.getByRole('button', { name: /run/i }).click();
    // Toast or result count
    await expect(page.getByText(/row/i)).toBeVisible({ timeout: 5000 });
  });

  test('should show error for invalid SQL', async ({ page }) => {
    const editor = page.getByLabel('SQL editor');
    await editor.fill('SELEKT invalid syntax here;');
    await page.getByRole('button', { name: /run/i }).click();
    await expect(page.getByRole('alert')).toBeVisible({ timeout: 5000 });
  });

  test('should create table and show it in tables panel', async ({ page }) => {
    const editor = page.getByLabel('SQL editor');
    await editor.fill('CREATE TABLE mytable (id INTEGER);');
    await page.getByRole('button', { name: /run/i }).click();
    await expect(page.getByText('mytable')).toBeVisible({ timeout: 5000 });
  });
});
