import { test, expect } from '@playwright/test';

test.describe('JSON to XML', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/json-to-xml');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/JSON to XML/i);
  });

  test('should show heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'JSON to XML' })).toBeVisible();
  });

  test('should convert simple JSON object to XML', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('{"name": "Alice", "age": 30}');
    const output = page.locator('#xml-output');
    const value = await output.inputValue();
    expect(value).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(value).toContain('<root>');
    expect(value).toContain('<name>Alice</name>');
    expect(value).toContain('<age>30</age>');
    expect(value).toContain('</root>');
  });

  test('should use custom root tag', async ({ page }) => {
    const rootTagInput = page.locator('#rootTag');
    await rootTagInput.fill('person');
    const input = page.locator('#input');
    await input.fill('{"name": "Bob"}');
    const output = page.locator('#xml-output');
    const value = await output.inputValue();
    expect(value).toContain('<person>');
    expect(value).toContain('</person>');
  });

  test('should include XML declaration', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('{"key": "value"}');
    const output = page.locator('#xml-output');
    await expect(output).toHaveValue(/\<\?xml version="1\.0"/);
  });

  test('should handle nested JSON', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('{"user": {"id": 1}}');
    const output = page.locator('#xml-output');
    const value = await output.inputValue();
    expect(value).toContain('<user>');
    expect(value).toContain('<id>1</id>');
    expect(value).toContain('</user>');
  });

  test('should show error for invalid JSON', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('{bad json}');
    await expect(page.getByRole('alert')).toBeVisible();
  });

  test('should show empty output for empty input', async ({ page }) => {
    const output = page.locator('#xml-output');
    await expect(output).toHaveValue('');
  });

  test('should clear input when Clear button is clicked', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('{"key": "value"}');
    await page.getByRole('button', { name: /clear/i }).click();
    await expect(input).toHaveValue('');
  });

  test('should have Copy XML button disabled when output is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /copy xml/i })).toBeDisabled();
  });

  test('should enable Copy XML button when conversion succeeds', async ({ page }) => {
    const input = page.locator('#input');
    await input.fill('{"key": "value"}');
    await expect(page.getByRole('button', { name: /copy xml/i })).toBeEnabled();
  });
});
