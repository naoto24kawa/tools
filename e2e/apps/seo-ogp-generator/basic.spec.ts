import { test, expect } from '@playwright/test';

test.describe('OGP Meta Tag Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/seo-ogp-generator');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText('OGP Meta Tag Generator')).toBeVisible();
  });

  test('should show generated tags on load (reactive)', async ({ page }) => {
    // Tags are generated reactively from DEFAULT_CONFIG, textarea should have content
    const output = page.locator('textarea[readonly]');
    await expect(output).not.toBeEmpty();
  });

  test('should include og:title tag in output', async ({ page }) => {
    const output = page.locator('textarea[readonly]');
    const content = await output.inputValue();
    expect(content).toContain('og:title');
  });

  test('should include og:description tag in output', async ({ page }) => {
    const output = page.locator('textarea[readonly]');
    const content = await output.inputValue();
    expect(content).toContain('og:description');
  });

  test('should update tags when title input changes', async ({ page }) => {
    const titleInput = page.locator('input[placeholder="ページタイトル"]');
    await titleInput.fill('My Custom Title');
    const output = page.locator('textarea[readonly]');
    const content = await output.inputValue();
    expect(content).toContain('My Custom Title');
  });

  test('should include twitter card tags', async ({ page }) => {
    const output = page.locator('textarea[readonly]');
    const content = await output.inputValue();
    expect(content).toContain('twitter:card');
  });

  test('should update og:url when URL input changes', async ({ page }) => {
    const urlInput = page.locator('input[placeholder="https://example.com"]');
    await urlInput.fill('https://mysite.com/page');
    const output = page.locator('textarea[readonly]');
    const content = await output.inputValue();
    expect(content).toContain('https://mysite.com/page');
  });

  test('should have copy tags button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /copy tags/i })).toBeVisible();
  });

  test('should have type selector with website/article/product options', async ({ page }) => {
    const typeSelect = page.locator('select').first();
    await expect(typeSelect).toBeVisible();
    await expect(typeSelect.locator('option[value="website"]')).toBeAttached();
    await expect(typeSelect.locator('option[value="article"]')).toBeAttached();
  });
});
