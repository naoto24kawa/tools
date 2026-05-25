import { test, expect } from '@playwright/test';

const UNFORMATTED_HCL = `resource "aws_instance" "web" {
ami = "ami-0c55b159cbfafe1f0"
instance_type = "t2.micro"
tags = {
Name = "HelloWorld"
}
}`;

test.describe('Terraform Formatter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/terraform-fmt');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText('Terraform Formatter')).toBeVisible();
  });

  test('should show HCL input textarea', async ({ page }) => {
    await expect(page.getByLabel('Terraform HCL input')).toBeVisible();
  });

  test('should have Format button disabled when input is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /^format$/i })).toBeDisabled();
  });

  test('should have Load Sample button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /load sample/i })).toBeVisible();
  });

  test('should load sample HCL when Load Sample clicked', async ({ page }) => {
    await page.getByRole('button', { name: /load sample/i }).click();
    const value = await page.getByLabel('Terraform HCL input').inputValue();
    expect(value).toContain('resource');
    expect(value).toContain('aws_instance');
  });

  test('should format HCL with proper indentation', async ({ page }) => {
    await page.getByLabel('Terraform HCL input').fill(UNFORMATTED_HCL);
    await page.getByRole('button', { name: /^format$/i }).click();
    // After formatting, the input should be replaced with formatted code
    const value = await page.getByLabel('Terraform HCL input').inputValue();
    // Formatted code should have proper indentation
    expect(value).toContain('  ami');
  });

  test('should show output panel', async ({ page }) => {
    await page.getByLabel('Terraform HCL input').fill(UNFORMATTED_HCL);
    await expect(page.getByText('Output')).toBeVisible();
  });

  test('should show "Changes detected" indicator for unformatted code', async ({ page }) => {
    await page.getByLabel('Terraform HCL input').fill(UNFORMATTED_HCL);
    await expect(page.getByText('Changes detected')).toBeVisible();
  });

  test('should show "Already formatted" when code is already formatted', async ({ page }) => {
    await page.getByRole('button', { name: /load sample/i }).click();
    // Format first
    await page.getByRole('button', { name: /^format$/i }).click();
    // Now the formatted code is in input — indicator should show already formatted
    await expect(page.getByText('Already formatted')).toBeVisible();
  });

  test('should have Copy button', async ({ page }) => {
    await page.getByLabel('Terraform HCL input').fill(UNFORMATTED_HCL);
    await expect(page.getByRole('button', { name: /copy/i })).toBeVisible();
  });

  test('should clear input when Clear button clicked', async ({ page }) => {
    await page.getByLabel('Terraform HCL input').fill(UNFORMATTED_HCL);
    await page.getByRole('button', { name: /clear/i }).click();
    await expect(page.getByLabel('Terraform HCL input')).toHaveValue('');
  });

  test('should format resource block with proper alignment', async ({ page }) => {
    await page.getByRole('button', { name: /load sample/i }).click();
    await page.getByRole('button', { name: /^format$/i }).click();
    const value = await page.getByLabel('Terraform HCL input').inputValue();
    // Formatted output should maintain resource block structure
    expect(value).toContain('resource "aws_instance"');
  });
});
