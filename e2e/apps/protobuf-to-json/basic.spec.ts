import { test, expect } from '@playwright/test';

test.describe('Protocol Buffers to JSON', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/protobuf-to-json');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Protocol Buffers to JSON' })).toBeVisible();
  });

  test('should convert a simple proto message to JSON', async ({ page }) => {
    const input = page.locator('textarea#input');
    await input.fill(
      'syntax = "proto3";\n\nmessage User {\n  string name = 1;\n  int32 age = 2;\n}'
    );
    await page.getByRole('button', { name: /Convert/i }).click();
    const output = page.locator('textarea#output');
    const value = await output.inputValue();
    expect(value).toContain('"name"');
    expect(value).toContain('"age"');
  });

  test('should show toast with message count after conversion', async ({ page }) => {
    const input = page.locator('textarea#input');
    await input.fill('message Foo {\n  string bar = 1;\n}');
    await page.getByRole('button', { name: /Convert/i }).click();
    await expect(page.getByText(/message\(s\) converted/i)).toBeVisible();
  });

  test('should have Convert button disabled when input is empty', async ({ page }) => {
    const convertBtn = page.getByRole('button', { name: /Convert/i });
    await expect(convertBtn).toBeDisabled();
  });

  test('should have Copy Result button disabled when output is empty', async ({ page }) => {
    const copyBtn = page.getByRole('button', { name: /Copy Result/i });
    await expect(copyBtn).toBeDisabled();
  });

  test('should clear both fields when Clear is clicked', async ({ page }) => {
    const input = page.locator('textarea#input');
    await input.fill('message Test {}');
    await page.getByRole('button', { name: /Convert/i }).click();
    await page.getByRole('button', { name: /Clear/i }).click();
    await expect(input).toHaveValue('');
    const output = page.locator('textarea#output');
    await expect(output).toHaveValue('');
  });

  test('should support pretty print and compact format options', async ({ page }) => {
    await expect(page.getByText('Pretty Print')).toBeVisible();
    await expect(page.getByText('Compact')).toBeVisible();
  });

  test('should generate JSON with nested message fields', async ({ page }) => {
    const input = page.locator('textarea#input');
    await input.fill(
      'message Order {\n  string id = 1;\n  repeated string items = 2;\n  bool active = 3;\n}'
    );
    await page.getByRole('button', { name: /Convert/i }).click();
    const output = page.locator('textarea#output');
    const value = await output.inputValue();
    expect(value).toContain('"id"');
    expect(value).toContain('"items"');
    expect(value).toContain('"active"');
  });
});
