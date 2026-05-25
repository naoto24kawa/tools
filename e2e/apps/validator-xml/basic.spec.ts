import { test, expect } from '@playwright/test';

test.describe('XML Validator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/validator-xml');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText(/XML Validator/i)).toBeVisible();
  });

  test('should show "Valid XML" for well-formed XML', async ({ page }) => {
    const textarea = page.locator('textarea#xml-input');
    await textarea.fill('<?xml version="1.0"?><root><item>Hello</item></root>');
    await expect(page.getByText(/Valid XML/i)).toBeVisible();
  });

  test('should show "Invalid XML" for malformed XML', async ({ page }) => {
    const textarea = page.locator('textarea#xml-input');
    await textarea.fill('<root><unclosed>');
    await expect(page.getByText(/Invalid XML/i)).toBeVisible();
  });

  test('should show error message for invalid XML', async ({ page }) => {
    const textarea = page.locator('textarea#xml-input');
    await textarea.fill('<root><item>no closing tag</root>');
    await expect(page.getByRole('alert')).toBeVisible();
  });

  test('should show formatted XML in result panel for valid input', async ({ page }) => {
    const textarea = page.locator('textarea#xml-input');
    await textarea.fill('<root><item>value</item></root>');
    // Output textarea (readOnly) should contain the tag names
    const output = page.locator('textarea[readonly]');
    await expect(output).not.toHaveValue('');
  });

  test('should not show validation status when input is empty', async ({ page }) => {
    const textarea = page.locator('textarea#xml-input');
    await expect(textarea).toHaveValue('');
    await expect(page.getByText(/Valid XML/i)).not.toBeVisible();
    await expect(page.getByText(/Invalid XML/i)).not.toBeVisible();
  });

  test('should validate simple XML without declaration', async ({ page }) => {
    const textarea = page.locator('textarea#xml-input');
    await textarea.fill('<data><name>Alice</name><age>30</age></data>');
    await expect(page.getByText(/Valid XML/i)).toBeVisible();
  });

  test('should update validation result in real-time', async ({ page }) => {
    const textarea = page.locator('textarea#xml-input');
    await textarea.fill('<root>');
    await expect(page.getByText(/Invalid XML/i)).toBeVisible();
    await textarea.fill('<root></root>');
    await expect(page.getByText(/Valid XML/i)).toBeVisible();
  });
});
