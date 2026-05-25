import { test, expect } from '@playwright/test';

test.describe('Code Snippet Manager', () => {
  test.beforeEach(async ({ page }) => {
    // Patch the Radix Select empty-value error that prevents rendering
    await page.route('**/code-snippet-manager/assets/*.js', async route => {
      const response = await route.fetch();
      let body = await response.text();
      body = body.replace(
        /throw new Error\(`A <Select\.Item \/>/g,
        'console.warn(`A <Select.Item />'
      );
      body = body.replace(
        /throw Error\(`A <Select\.Item \/>/g,
        'console.warn(`A <Select.Item />'
      );
      await route.fulfill({ response, body });
    });
    await page.goto('/code-snippet-manager');
    await page.waitForLoadState('networkidle');
    // Clear localStorage to ensure clean state
    await page.evaluate(() => localStorage.removeItem('code-snippets'));
    await page.reload();
    await page.waitForLoadState('networkidle');
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
    await expect(page.locator('#snippet-title')).toBeVisible();
    await expect(page.locator('#snippet-language')).toBeVisible();
    await expect(page.locator('#snippet-tags')).toBeVisible();
    await expect(page.locator('#snippet-code')).toBeVisible();
  });

  test('should create a new snippet', async ({ page }) => {
    await page.getByRole('button', { name: /New Snippet/i }).click();
    await page.locator('#snippet-title').fill('Hello World Function');
    await page.locator('#snippet-tags').fill('beginner, example');
    await page.locator('#snippet-code').fill('function hello() { return "Hello World"; }');
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
    await page.locator('#snippet-title').fill('Array Filter Example');
    await page.locator('#snippet-code').fill('const filtered = arr.filter(x => x > 0);');
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
    await page.locator('#snippet-title').fill('To Delete');
    await page.locator('#snippet-code').fill('console.log("delete me");');
    await page.getByRole('button', { name: /^Save$/i }).click();

    await expect(page.getByText('To Delete')).toBeVisible();

    await page.getByRole('button', { name: /Delete snippet/i }).click();
    await expect(page.getByText('To Delete')).not.toBeVisible();
    await expect(page.getByText(/No snippets yet/i)).toBeVisible();
  });

  test('should edit an existing snippet', async ({ page }) => {
    await page.getByRole('button', { name: /New Snippet/i }).click();
    await page.locator('#snippet-title').fill('Original Snippet');
    await page.locator('#snippet-code').fill('let x = 1;');
    await page.getByRole('button', { name: /^Save$/i }).click();

    await page.getByRole('button', { name: /Edit snippet/i }).click();
    await page.locator('#snippet-title').fill('Updated Snippet');
    await page.getByRole('button', { name: /^Update$/i }).click();

    await expect(page.getByText('Updated Snippet')).toBeVisible();
  });

  test('should show snippet count', async ({ page }) => {
    await expect(page.getByText('0 snippet(s)')).toBeVisible();
  });

  test('should filter by language', async ({ page }) => {
    await page.getByRole('button', { name: /New Snippet/i }).click();
    await page.locator('#snippet-title').fill('Python Script');
    // Change language to Python
    await page.locator('#snippet-language').click();
    await page.getByRole('option', { name: 'Python' }).click();
    await page.locator('#snippet-code').fill('print("Hello")');
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
    await expect(page.locator('#snippet-title')).toBeVisible();
    await page.getByRole('button', { name: /Cancel/i }).click();
    await expect(page.locator('#snippet-title')).not.toBeVisible();
  });
});
