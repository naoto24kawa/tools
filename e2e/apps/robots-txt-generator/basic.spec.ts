import { test, expect } from '@playwright/test';

test.describe('robots.txt Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/robots-txt-generator');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'robots.txt Generator' })).toBeVisible();
  });

  test('should show default user-agent group with wildcard', async ({ page }) => {
    // Default group uses "*" user-agent
    const select = page.locator('select').first();
    await expect(select).toHaveValue('*');
  });

  test('should display a live preview of robots.txt output', async ({ page }) => {
    // Preview card shows "User-agent:" text
    await expect(page.locator('pre').filter({ hasText: 'User-agent:' })).toBeVisible();
  });

  test('should update preview when a path rule is changed', async ({ page }) => {
    const pathInput = page.locator('input[placeholder="/path/"]').first();
    await pathInput.fill('/admin/');
    await expect(page.locator('pre').filter({ hasText: '/admin/' })).toBeVisible();
  });

  test('should add a new user-agent group', async ({ page }) => {
    const addGroupBtn = page.getByRole('button', { name: /Add Group/i });
    await addGroupBtn.click();
    // Two group sections now visible
    const groups = page.locator('.border.rounded-md.space-y-4');
    expect(await groups.count()).toBeGreaterThanOrEqual(2);
  });

  test('should add a new path rule within a group', async ({ page }) => {
    const addRuleBtn = page.getByRole('button', { name: /Add Rule/i }).first();
    await addRuleBtn.click();
    const pathInputs = page.locator('input[placeholder="/path/"]');
    expect(await pathInputs.count()).toBeGreaterThanOrEqual(2);
  });

  test('should add sitemap URL to preview', async ({ page }) => {
    const sitemapInput = page.getByPlaceholder('https://example.com/sitemap.xml');
    await sitemapInput.fill('https://example.com/sitemap.xml');
    await expect(page.locator('pre').filter({ hasText: 'Sitemap:' })).toBeVisible();
  });

  test('should have Copy and Download buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Copy/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Download/i })).toBeVisible();
  });
});
