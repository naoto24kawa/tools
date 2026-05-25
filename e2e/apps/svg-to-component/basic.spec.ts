import { test, expect } from '@playwright/test';

const SAMPLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <circle cx="12" cy="12" r="10"/>
  <path d="M12 6v6l4 2"/>
</svg>`;

test.describe('SVG to Component Converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/svg-to-component');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText('SVG to Component Converter')).toBeVisible();
  });

  test('should show SVG input textarea', async ({ page }) => {
    await expect(page.getByLabel('SVG input')).toBeVisible();
  });

  test('should have Load Sample button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /load sample/i })).toBeVisible();
  });

  test('should load sample SVG when Load Sample clicked', async ({ page }) => {
    await page.getByRole('button', { name: /load sample/i }).click();
    const value = await page.getByLabel('SVG input').inputValue();
    expect(value).toContain('<svg');
  });

  test('should convert SVG to React TSX component', async ({ page }) => {
    await page.getByLabel('SVG input').fill(SAMPLE_SVG);
    // Output should appear automatically (useMemo)
    await expect(page.locator('pre code')).toBeVisible({ timeout: 3000 });
    const code = await page.locator('pre code').innerText();
    expect(code).toContain('import React');
    expect(code).toContain('SvgIcon');
  });

  test('should show component name input with default SvgIcon', async ({ page }) => {
    await expect(page.getByPlaceholder('SvgIcon')).toBeVisible();
  });

  test('should update component name in output', async ({ page }) => {
    await page.getByLabel('SVG input').fill(SAMPLE_SVG);
    await page.getByPlaceholder('SvgIcon').fill('MyIcon');
    const code = await page.locator('pre code').innerText();
    expect(code).toContain('MyIcon');
  });

  test('should have output format selector', async ({ page }) => {
    await expect(page.getByText('React (TSX)')).toBeVisible();
  });

  test('should convert to Vue SFC when format changed', async ({ page }) => {
    await page.getByLabel('SVG input').fill(SAMPLE_SVG);
    // Select Vue SFC format
    const formatSelect = page.getByRole('combobox').first();
    await formatSelect.click();
    await page.getByRole('option', { name: 'Vue (SFC)' }).click();
    const code = await page.locator('pre code').innerText();
    expect(code).toContain('<template>');
  });

  test('should show Copy button when output is available', async ({ page }) => {
    await page.getByLabel('SVG input').fill(SAMPLE_SVG);
    await expect(page.getByRole('button', { name: /copy/i })).toBeEnabled({ timeout: 3000 });
  });

  test('should show error for invalid SVG input', async ({ page }) => {
    await page.getByLabel('SVG input').fill('<div>not an svg</div>');
    await expect(page.getByRole('alert')).toBeVisible();
  });

  test('should have width/height props checkbox', async ({ page }) => {
    await expect(page.getByText('Add width/height props')).toBeVisible();
  });
});
