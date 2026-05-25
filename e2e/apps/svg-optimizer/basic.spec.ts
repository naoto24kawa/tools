import { test, expect } from '@playwright/test';

const SAMPLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
  <!-- circle icon -->
  <metadata>Some metadata</metadata>
  <g id="group1">
    <circle cx="12" cy="12" r="10" fill="blue"/>
  </g>
</svg>`;

test.describe('SVG Optimizer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/svg-optimizer');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText('SVG Optimizer')).toBeVisible();
  });

  test('should show SVG input textarea', async ({ page }) => {
    await expect(page.getByLabel('SVG input')).toBeVisible();
  });

  test('should have Optimize SVG button disabled when empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /optimize svg/i })).toBeDisabled();
  });

  test('should optimize SVG and show size comparison', async ({ page }) => {
    await page.getByLabel('SVG input').fill(SAMPLE_SVG);
    await page.getByRole('button', { name: /optimize svg/i }).click();
    await expect(page.getByText('Size Comparison')).toBeVisible();
    await expect(page.getByText('Original')).toBeVisible();
    await expect(page.getByText('Optimized', { exact: true }).first()).toBeVisible();
  });

  test('should show savings percentage after optimization', async ({ page }) => {
    await page.getByLabel('SVG input').fill(SAMPLE_SVG);
    await page.getByRole('button', { name: /optimize svg/i }).click();
    // Should display a percentage
    await expect(page.getByText(/\d+%/)).toBeVisible();
  });

  test('should show optimized SVG output textarea', async ({ page }) => {
    await page.getByLabel('SVG input').fill(SAMPLE_SVG);
    await page.getByRole('button', { name: /optimize svg/i }).click();
    await expect(page.getByLabel('Optimized SVG output')).toBeVisible();
  });

  test('should show options panel with checkboxes', async ({ page }) => {
    await expect(page.getByText('Options')).toBeVisible();
    await expect(page.getByText('Remove comments')).toBeVisible();
  });

  test('should show Copy and Download buttons after optimization', async ({ page }) => {
    await page.getByLabel('SVG input').fill(SAMPLE_SVG);
    await page.getByRole('button', { name: /optimize svg/i }).click();
    await expect(page.getByRole('button', { name: /copy/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /download/i })).toBeVisible();
  });

  test('should clear SVG input when Clear button clicked', async ({ page }) => {
    await page.getByLabel('SVG input').fill(SAMPLE_SVG);
    await page.getByRole('button', { name: /clear/i }).click();
    await expect(page.getByLabel('SVG input')).toHaveValue('');
  });

  test('should remove comments from SVG when option is enabled', async ({ page }) => {
    await page.getByLabel('SVG input').fill(SAMPLE_SVG);
    await page.getByRole('button', { name: /optimize svg/i }).click();
    const output = await page.getByLabel('Optimized SVG output').inputValue();
    expect(output).not.toContain('<!-- circle icon -->');
  });
});
