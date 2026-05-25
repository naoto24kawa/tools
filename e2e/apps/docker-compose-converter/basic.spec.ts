import { test, expect } from '@playwright/test';

test.describe('Docker Run to Compose', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/docker-compose-converter');
  });

  test('should display the page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Docker Run to Compose/i })).toBeVisible();
  });

  test('should convert a simple docker run command', async ({ page }) => {
    const input = page.getByLabel('Docker Run Command');
    await input.fill('docker run -d --name web nginx');
    await page.getByRole('button', { name: /convert/i }).click();
    const output = page.getByLabel('docker-compose.yml');
    const value = await output.inputValue();
    expect(value).toContain('services');
    expect(value).toContain('nginx');
  });

  test('should include port mapping in output', async ({ page }) => {
    const input = page.getByLabel('Docker Run Command');
    await input.fill('docker run -d -p 8080:80 --name app nginx');
    await page.getByRole('button', { name: /convert/i }).click();
    const output = page.getByLabel('docker-compose.yml');
    const value = await output.inputValue();
    expect(value).toContain('8080');
    expect(value).toContain('80');
  });

  test('should include volume mapping in output', async ({ page }) => {
    const input = page.getByLabel('Docker Run Command');
    await input.fill('docker run -d -v /host/data:/container/data nginx');
    await page.getByRole('button', { name: /convert/i }).click();
    const output = page.getByLabel('docker-compose.yml');
    const value = await output.inputValue();
    expect(value).toContain('volumes');
  });

  test('should include environment variable in output', async ({ page }) => {
    const input = page.getByLabel('Docker Run Command');
    await input.fill('docker run -d -e MY_VAR=hello nginx');
    await page.getByRole('button', { name: /convert/i }).click();
    const output = page.getByLabel('docker-compose.yml');
    const value = await output.inputValue();
    expect(value).toContain('MY_VAR');
  });

  test('should disable Convert button when input is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /convert/i })).toBeDisabled();
  });

  test('should disable Copy Result button when output is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /copy result/i })).toBeDisabled();
  });

  test('should clear input and output when Clear is clicked', async ({ page }) => {
    const input = page.getByLabel('Docker Run Command');
    await input.fill('docker run nginx');
    await page.getByRole('button', { name: /convert/i }).click();
    await page.getByRole('button', { name: /clear/i }).click();
    await expect(input).toHaveValue('');
    await expect(page.getByLabel('docker-compose.yml')).toHaveValue('');
  });

  test('should produce YAML output with version or services key', async ({ page }) => {
    const input = page.getByLabel('Docker Run Command');
    await input.fill('docker run -d --name myapp -p 3000:3000 node:18');
    await page.getByRole('button', { name: /convert/i }).click();
    const output = page.getByLabel('docker-compose.yml');
    const value = await output.inputValue();
    // Should contain at minimum the services key
    expect(value).toMatch(/services|version/);
  });
});
