import { test, expect } from '@playwright/test';

test.describe('Text Invisible Characters Detector', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/text-invisible-chars');
  });

  test('should load page with title', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /invisible characters detector/i }),
    ).toBeVisible();
  });

  test('should show text input area', async ({ page }) => {
    await expect(page.locator('textarea#input')).toBeVisible();
  });

  test('should not show detection results when input is empty', async ({ page }) => {
    await expect(page.getByText('Detection Results')).not.toBeVisible();
  });

  test('should show detection results when text is entered', async ({ page }) => {
    await page.locator('textarea#input').fill('Hello World');
    await expect(page.getByText('Detection Results')).toBeVisible();
  });

  test('should report no invisible characters for plain text', async ({ page }) => {
    await page.locator('textarea#input').fill('Hello World, this is plain text!');
    await expect(page.getByText(/no invisible characters found/i)).toBeVisible();
  });

  test('should detect zero-width space character', async ({ page }) => {
    // Zero-width space (U+200B)
    const textWithZWS = 'Hello​World';
    await page.locator('textarea#input').fill(textWithZWS);
    await expect(page.getByText(/found \d+ invisible character/i)).toBeVisible();
    await expect(page.getByText('Zero Width Space')).toBeVisible();
  });

  test('should show Remove All button when invisible chars are found', async ({ page }) => {
    await page.locator('textarea#input').fill('Hello​World');
    await expect(page.getByRole('button', { name: /remove all/i })).toBeVisible();
  });

  test('should remove invisible characters when Remove All is clicked', async ({ page }) => {
    await page.locator('textarea#input').fill('Hello​World');
    await page.getByRole('button', { name: /remove all/i }).click();
    await expect(page.getByText(/no invisible characters found/i)).toBeVisible();
    const value = await page.locator('textarea#input').inputValue();
    expect(value).toBe('HelloWorld');
  });

  test('should show table with position, code point, and type columns when chars found', async ({
    page,
  }) => {
    await page.locator('textarea#input').fill('Test​text');
    await expect(page.getByText('Position')).toBeVisible();
    await expect(page.getByText('Code Point')).toBeVisible();
    await expect(page.getByText('Type')).toBeVisible();
  });
});
