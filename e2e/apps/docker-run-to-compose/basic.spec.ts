import { test, expect } from '@playwright/test';

test.describe('Docker Run to Compose', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/docker-run-to-compose');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText('Docker Run to Compose')).toBeVisible();
  });

  test('should show input textarea', async ({ page }) => {
    await expect(page.getByPlaceholder('docker run -d --name my-app -p 8080:80 nginx')).toBeVisible();
  });

  test('should show placeholder in output when input is empty', async ({ page }) => {
    await expect(page.getByText('# Enter a docker run command to generate compose YAML')).toBeVisible();
  });

  test('should show Load Sample button', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Load Sample' })).toBeVisible();
  });

  test('should load sample command when Load Sample is clicked', async ({ page }) => {
    await page.getByRole('button', { name: 'Load Sample' }).click();
    const textarea = page.locator('textarea').first();
    const value = await textarea.inputValue();
    expect(value).toContain('docker run');
    expect(value).toContain('my-app');
  });

  test('should generate docker-compose.yml from sample command', async ({ page }) => {
    await page.getByRole('button', { name: 'Load Sample' }).click();
    const output = page.locator('pre');
    await expect(output).toContainText('services:');
    await expect(output).toContainText('my-app');
  });

  test('should generate compose with port mapping', async ({ page }) => {
    const textarea = page.locator('textarea').first();
    await textarea.fill('docker run -d --name web -p 8080:80 nginx');
    const output = page.locator('pre');
    await expect(output).toContainText('ports:');
    await expect(output).toContainText('8080:80');
  });

  test('should generate compose with environment variables', async ({ page }) => {
    const textarea = page.locator('textarea').first();
    await textarea.fill('docker run -d -e NODE_ENV=production -e PORT=3000 node:18');
    const output = page.locator('pre');
    await expect(output).toContainText('environment:');
    await expect(output).toContainText('NODE_ENV=production');
  });

  test('should generate compose with volume mapping', async ({ page }) => {
    const textarea = page.locator('textarea').first();
    await textarea.fill('docker run -d -v /host/data:/container/data nginx');
    const output = page.locator('pre');
    await expect(output).toContainText('volumes:');
  });

  test('should show Copy button', async ({ page }) => {
    await page.getByRole('button', { name: 'Load Sample' }).click();
    await expect(page.getByRole('button', { name: /Copy/i })).toBeEnabled();
  });

  test('should clear input when Clear button is clicked', async ({ page }) => {
    const textarea = page.locator('textarea').first();
    await textarea.fill('docker run -d nginx');
    await page.getByRole('button', { name: /Clear/i }).click();
    await expect(textarea).toBeEmpty();
  });

  test('should show services key in generated YAML', async ({ page }) => {
    const textarea = page.locator('textarea').first();
    await textarea.fill('docker run -d --name test-app nginx:latest');
    const output = page.locator('pre');
    await expect(output).toContainText('services:');
    await expect(output).toContainText('test-app');
    await expect(output).toContainText('nginx:latest');
  });
});
