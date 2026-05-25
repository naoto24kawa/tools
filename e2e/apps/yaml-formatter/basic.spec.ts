import { test, expect } from '@playwright/test';

test.describe('YAML Formatter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/yaml-formatter');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/YAML Formatter/i);
  });

  test('should display YAML and JSON textareas', async ({ page }) => {
    await expect(page.locator('#yaml-input')).toBeVisible();
    await expect(page.locator('#json-output')).toBeVisible();
  });

  test('should convert YAML to JSON', async ({ page }) => {
    const yamlInput = page.locator('#yaml-input');
    await yamlInput.fill('name: Alice\nage: 30\ncity: Tokyo');
    await page.getByRole('button', { name: /yaml to json/i }).click();
    const jsonOutput = page.locator('#json-output');
    const value = await jsonOutput.inputValue();
    const parsed = JSON.parse(value);
    expect(parsed.name).toBe('Alice');
    expect(parsed.age).toBe(30);
    expect(parsed.city).toBe('Tokyo');
  });

  test('should convert JSON to YAML', async ({ page }) => {
    // First set up JSON output so the button is enabled
    const jsonOutput = page.locator('#json-output');
    await jsonOutput.fill('{"name":"Bob","score":100}');
    await page.getByRole('button', { name: /json to yaml/i }).click();
    const yamlInput = page.locator('#yaml-input');
    const value = await yamlInput.inputValue();
    expect(value).toContain('name');
    expect(value).toContain('Bob');
  });

  test('should format YAML with consistent indentation', async ({ page }) => {
    const yamlInput = page.locator('#yaml-input');
    // Unformatted YAML
    await yamlInput.fill('server:\n  host: localhost\n  port: 8080\ndatabase:\n  name: mydb');
    await page.getByRole('button', { name: /format yaml/i }).click();
    const value = await yamlInput.inputValue();
    expect(value).toContain('server');
    expect(value).toContain('host');
    expect(value).toContain('localhost');
  });

  test('should produce valid JSON from YAML list', async ({ page }) => {
    const yamlInput = page.locator('#yaml-input');
    await yamlInput.fill('items:\n  - apple\n  - banana\n  - cherry');
    await page.getByRole('button', { name: /yaml to json/i }).click();
    const jsonValue = await page.locator('#json-output').inputValue();
    const parsed = JSON.parse(jsonValue);
    expect(parsed.items).toContain('apple');
    expect(parsed.items).toContain('banana');
  });

  test('should clear input and output on clear button click', async ({ page }) => {
    const yamlInput = page.locator('#yaml-input');
    await yamlInput.fill('key: value');
    await page.getByRole('button', { name: /yaml to json/i }).click();
    await page.getByRole('button', { name: /clear/i }).click();
    expect(await yamlInput.inputValue()).toBe('');
    expect(await page.locator('#json-output').inputValue()).toBe('');
  });

  test('should disable YAML to JSON button when YAML input is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /yaml to json/i })).toBeDisabled();
  });

  test('should disable JSON to YAML button when JSON output is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /json to yaml/i })).toBeDisabled();
  });
});
