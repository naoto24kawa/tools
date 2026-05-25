import { test, expect } from '@playwright/test';

test.describe('Nginx Config Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/nginx-config-generator');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText(/Nginx Config Generator/i)).toBeVisible();
  });

  test('should show generated config on initial load', async ({ page }) => {
    const pre = page.locator('pre');
    await expect(pre).toBeVisible();
    const text = await pre.textContent();
    expect(text).toContain('server');
  });

  test('should generate reverse-proxy config by default', async ({ page }) => {
    const pre = page.locator('pre');
    const text = await pre.textContent();
    expect(text).toContain('proxy_pass');
  });

  test('should switch to static file server preset', async ({ page }) => {
    const presetSelect = page.getByRole('combobox').first();
    await presetSelect.click();
    await page.getByRole('option', { name: /Static File Server/i }).click();
    const pre = page.locator('pre');
    await expect(pre).toBeVisible();
    const text = await pre.textContent();
    expect(text).toContain('root');
  });

  test('should switch to SPA preset', async ({ page }) => {
    const presetSelect = page.getByRole('combobox').first();
    await presetSelect.click();
    await page.getByRole('option', { name: /Single Page Application/i }).click();
    const pre = page.locator('pre');
    await expect(pre).toBeVisible();
    const text = await pre.textContent();
    expect(text).toContain('try_files');
  });

  test('should update server name in generated config', async ({ page }) => {
    const serverNameInput = page.getByLabel(/Server Name/i);
    await serverNameInput.clear();
    await serverNameInput.fill('myapp.example.com');
    const pre = page.locator('pre');
    await expect(pre.getByText(/myapp\.example\.com/)).toBeVisible();
  });

  test('should enable SSL and add SSL fields to config', async ({ page }) => {
    const sslCheckbox = page.locator('#ssl');
    await sslCheckbox.check();
    const pre = page.locator('pre');
    const text = await pre.textContent();
    expect(text).toContain('ssl_certificate');
  });

  test('should enable CORS and add CORS headers to config', async ({ page }) => {
    const corsCheckbox = page.locator('#cors');
    await corsCheckbox.check();
    const pre = page.locator('pre');
    const text = await pre.textContent();
    expect(text).toContain('Access-Control-Allow-Origin');
  });

  test('should add a custom header row when Add button clicked', async ({ page }) => {
    await page.getByRole('button', { name: /Add/i }).click();
    await expect(page.getByPlaceholder('Header-Name')).toBeVisible();
  });

  test('should show Copy button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Copy/i })).toBeVisible();
  });
});
