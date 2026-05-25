import { test, expect } from '@playwright/test';

test.describe('Dockerfile Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dockerfile-generator');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText('Dockerfile Generator')).toBeVisible();
  });

  test('should generate a Dockerfile on load', async ({ page }) => {
    const preview = page.locator('pre');
    await expect(preview).toContainText('FROM');
  });

  test('should default to node base image', async ({ page }) => {
    const preview = page.locator('pre');
    await expect(preview).toContainText('node');
  });

  test('should show base image selector', async ({ page }) => {
    await expect(page.locator('#base-image')).toBeVisible();
  });

  test('should show port input', async ({ page }) => {
    await expect(page.locator('#port')).toBeVisible();
  });

  test('should update Dockerfile when port is changed', async ({ page }) => {
    const portInput = page.locator('#port');
    await portInput.fill('8080');
    const preview = page.locator('pre');
    await expect(preview).toContainText('8080');
  });

  test('should include EXPOSE directive in generated Dockerfile', async ({ page }) => {
    const preview = page.locator('pre');
    await expect(preview).toContainText('EXPOSE');
  });

  test('should add non-root user when checkbox is checked', async ({ page }) => {
    const checkbox = page.locator('input[type="checkbox"]').filter({ hasText: /non-root/i }).first();
    // Find non-root user checkbox by label
    await page.getByText('Non-root user').click();
    const preview = page.locator('pre');
    await expect(preview).toContainText('USER');
  });

  test('should add HEALTHCHECK when checkbox is checked', async ({ page }) => {
    await page.getByText('Healthcheck').click();
    const preview = page.locator('pre');
    await expect(preview).toContainText('HEALTHCHECK');
  });

  test('should show Copy Dockerfile button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Copy Dockerfile/i })).toBeVisible();
  });

  test('should support python base image', async ({ page }) => {
    await page.locator('#base-image').click();
    await page.getByRole('option', { name: /python/i }).click();
    const preview = page.locator('pre');
    await expect(preview).toContainText('python');
  });

  test('should support custom CMD', async ({ page }) => {
    await page.locator('#cmd').fill('npm start');
    const preview = page.locator('pre');
    // CMD is displayed as JSON array: CMD ["npm","start"]
    await expect(preview).toContainText('"npm"');
  });
});
