import { test, expect } from '@playwright/test';

test.describe('Code Snippet Manager', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/code-snippet-manager');
    // Clear localStorage to ensure clean state
    await page.evaluate(() => localStorage.removeItem('code-snippets'));
    await page.reload();
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Code Snippet Manager/i);
  });

  test('should display main heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Code Snippet Manager' })).toBeVisible();
  });

  test('should show empty state message', async ({ page }) => {
    await expect(page.getByText(/No snippets yet/i)).toBeVisible();
  });

  test('should show New Snippet button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /New Snippet/i })).toBeVisible();
  });

  test('should show snippet creation form when New Snippet clicked', async ({ page }) => {
    await page.getByRole('button', { name: /New Snippet/i }).click();
    await expect(page.getByLabel('Title')).toBeVisible();
    await expect(page.getByLabel('Language')).toBeVisible();
    await expect(page.getByLabel(/Tags/i)).toBeVisible();
    await expect(page.getByLabel('Code')).toBeVisible();
  });

  test('should create a new snippet', async ({ page }) => {
    await page.getByRole('button', { name: /New Snippet/i }).click();
    await page.getByLabel('Title').fill('Hello World Function');
    await page.getByLabel(/Tags/i).fill('beginner, example');
    await page.getByLabel('Code').fill('function hello() { return "Hello World"; }');
    await page.getByRole('button', { name: /^Save$/i }).click();

    await expect(page.getByText('Hello World Function')).toBeVisible();
    await expect(page.getByText('JavaScript')).toBeVisible();
  });

  test('should require title and code when creating snippet', async ({ page }) => {
    await page.getByRole('button', { name: /New Snippet/i }).click();
    await page.getByRole('button', { name: /^Save$/i }).click();
    await expect(page.getByText(/Title and code are required/i)).toBeVisible();
  });

  test('should search snippets by title', async ({ page }) => {
    // Create a snippet
    await page.getByRole('button', { name: /New Snippet/i }).click();
    await page.getByLabel('Title').fill('Array Filter Example');
    await page.getByLabel('Code').fill('const filtered = arr.filter(x => x > 0);');
    await page.getByRole('button', { name: /^Save$/i }).click();

    // Search for it
    await page.getByPlaceholder('Search snippets...').fill('Array');
    await expect(page.getByText('Array Filter Example')).toBeVisible();

    // Search for something that doesn't match
    await page.getByPlaceholder('Search snippets...').fill('nonexistent');
    await expect(page.getByText(/No snippets match/i)).toBeVisible();
  });

  test('should delete a snippet', async ({ page }) => {
    await page.getByRole('button', { name: /New Snippet/i }).click();
    await page.getByLabel('Title').fill('To Delete');
    await page.getByLabel('Code').fill('console.log("delete me");');
    await page.getByRole('button', { name: /^Save$/i }).click();

    await expect(page.getByText('To Delete')).toBeVisible();

    await page.getByRole('button', { name: /Delete snippet/i }).click();
    await expect(page.getByText('To Delete')).not.toBeVisible();
    await expect(page.getByText(/No snippets yet/i)).toBeVisible();
  });

  test('should edit an existing snippet', async ({ page }) => {
    await page.getByRole('button', { name: /New Snippet/i }).click();
    await page.getByLabel('Title').fill('Original Snippet');
    await page.getByLabel('Code').fill('let x = 1;');
    await page.getByRole('button', { name: /^Save$/i }).click();

    await page.getByRole('button', { name: /Edit snippet/i }).click();
    await page.getByLabel('Title').fill('Updated Snippet');
    await page.getByRole('button', { name: /^Update$/i }).click();

    await expect(page.getByText('Updated Snippet')).toBeVisible();
  });

  test('should show snippet count', async ({ page }) => {
    await expect(page.getByText('0 snippet(s)')).toBeVisible();
  });

  test('should filter by language', async ({ page }) => {
    await page.getByRole('button', { name: /New Snippet/i }).click();
    await page.getByLabel('Title').fill('Python Script');
    // Change language to Python
    await page.getByLabel('Language').click();
    await page.getByRole('option', { name: 'Python' }).click();
    await page.getByLabel('Code').fill('print("Hello")');
    await page.getByRole('button', { name: /^Save$/i }).click();

    await expect(page.getByText('Python Script')).toBeVisible();
    await expect(page.getByText('Python').first()).toBeVisible();
  });

  test('should show Export and Import buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Export/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Import/i })).toBeVisible();
  });

  test('should cancel snippet creation', async ({ page }) => {
    await page.getByRole('button', { name: /New Snippet/i }).click();
    await expect(page.getByLabel('Title')).toBeVisible();
    await page.getByRole('button', { name: /Cancel/i }).click();
    await expect(page.getByLabel('Title')).not.toBeVisible();
  });
});
