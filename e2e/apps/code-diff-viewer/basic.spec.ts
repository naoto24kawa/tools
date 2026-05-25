import { test, expect } from '@playwright/test';

test.describe('Diff Viewer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/code-diff-viewer');
  });

  test('should display the page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Diff Viewer/i })).toBeVisible();
  });

  test('should show diff when text A and text B differ', async ({ page }) => {
    const textA = page.getByLabel('Text A - original text');
    const textB = page.getByLabel('Text B - modified text');
    await textA.fill('hello world');
    await textB.fill('hello earth');
    await expect(page.getByRole('heading', { name: /Diff/i })).toBeVisible();
  });

  test('should show added lines with + prefix', async ({ page }) => {
    const textA = page.getByLabel('Text A - original text');
    const textB = page.getByLabel('Text B - modified text');
    await textA.fill('line one');
    await textB.fill('line one\nline two');
    // The diff panel shows + for added lines
    const diffPanel = page.locator('.font-mono.text-sm.border.rounded');
    await expect(diffPanel).toBeVisible();
    await expect(diffPanel).toContainText('+');
  });

  test('should show removed lines with - prefix', async ({ page }) => {
    const textA = page.getByLabel('Text A - original text');
    const textB = page.getByLabel('Text B - modified text');
    await textA.fill('line one\nline two');
    await textB.fill('line one');
    const diffPanel = page.locator('.font-mono.text-sm.border.rounded');
    await expect(diffPanel).toContainText('-');
  });

  test('should display stats with added and removed counts', async ({ page }) => {
    const textA = page.getByLabel('Text A - original text');
    const textB = page.getByLabel('Text B - modified text');
    await textA.fill('apple\nbanana\ncherry');
    await textB.fill('apple\nblueberry\ncherry');
    // Stats show +N and -N in the card description
    await expect(page.locator('text=/\\+\\d/')).toBeVisible();
    await expect(page.locator('text=/-\\d/')).toBeVisible();
  });

  test('should not show diff panel when both inputs are empty', async ({ page }) => {
    // The diff Card is conditionally rendered only when textA or textB is non-empty
    await expect(page.getByRole('heading', { name: /^Diff$/i })).toBeHidden();
  });

  test('should show diff panel when only text A has content', async ({ page }) => {
    await page.getByLabel('Text A - original text').fill('only in A');
    await expect(page.getByText('Diff').first()).toBeVisible();
  });

  test('should show unchanged lines when texts are identical', async ({ page }) => {
    const same = 'same content here';
    await page.getByLabel('Text A - original text').fill(same);
    await page.getByLabel('Text B - modified text').fill(same);
    await expect(page.locator('text=unchanged')).toBeVisible();
  });
});
