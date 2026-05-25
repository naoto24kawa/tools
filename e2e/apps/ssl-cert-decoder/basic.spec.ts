import { test, expect } from '@playwright/test';

test.describe('SSL Certificate Decoder', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ssl-cert-decoder');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText('SSL Certificate Decoder')).toBeVisible();
  });

  test('should show PEM certificate input textarea', async ({ page }) => {
    await expect(page.getByLabel('PEM certificate input')).toBeVisible();
  });

  test('should have Decode button disabled when input is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /decode/i })).toBeDisabled();
  });

  test('should have Load Sample button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /load sample/i })).toBeVisible();
  });

  test('should load sample certificate when Load Sample clicked', async ({ page }) => {
    await page.getByRole('button', { name: /load sample/i }).click();
    const textarea = page.getByLabel('PEM certificate input');
    const value = await textarea.inputValue();
    expect(value).toContain('-----BEGIN CERTIFICATE-----');
  });

  test('should decode sample certificate and show details', async ({ page }) => {
    await page.getByRole('button', { name: /load sample/i }).click();
    await page.getByRole('button', { name: /decode/i }).click();
    await expect(page.getByText('Certificate Details')).toBeVisible();
  });

  test('should display version after decoding sample', async ({ page }) => {
    await page.getByRole('button', { name: /load sample/i }).click();
    await page.getByRole('button', { name: /decode/i }).click();
    await expect(page.getByText('Version')).toBeVisible();
  });

  test('should display signature algorithm after decoding', async ({ page }) => {
    await page.getByRole('button', { name: /load sample/i }).click();
    await page.getByRole('button', { name: /decode/i }).click();
    await expect(page.getByText('Signature Algorithm')).toBeVisible();
  });

  test('should show serial number after decoding', async ({ page }) => {
    await page.getByRole('button', { name: /load sample/i }).click();
    await page.getByRole('button', { name: /decode/i }).click();
    await expect(page.getByText('Serial Number')).toBeVisible();
  });

  test('should show error for invalid PEM input', async ({ page }) => {
    await page.getByLabel('PEM certificate input').fill('this is not a certificate');
    await page.getByRole('button', { name: /decode/i }).click();
    await expect(page.getByRole('alert')).toBeVisible();
  });

  test('should clear all when Clear button clicked', async ({ page }) => {
    await page.getByRole('button', { name: /load sample/i }).click();
    await page.getByRole('button', { name: /clear/i }).click();
    await expect(page.getByLabel('PEM certificate input')).toHaveValue('');
  });
});
