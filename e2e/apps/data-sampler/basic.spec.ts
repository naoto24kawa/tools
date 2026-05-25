import { test, expect } from '@playwright/test';

test.describe('Data Sampler', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/data-sampler');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText('Data Sampler')).toBeVisible();
  });

  test('should show empty state before data is loaded', async ({ page }) => {
    await expect(page.getByText('Upload or paste data to begin')).toBeVisible();
  });

  test('should parse pasted CSV text and show preview', async ({ page }) => {
    const textarea = page.getByLabel('Paste data');
    await textarea.fill('name,age,city\nAlice,30,Tokyo\nBob,25,Osaka\nCarol,35,Kyoto');
    await page.getByRole('button', { name: 'Parse Text' }).click();
    await expect(page.getByText('name')).toBeVisible();
    await expect(page.getByText('Alice')).toBeVisible();
    await expect(page.getByText('Bob')).toBeVisible();
  });

  test('should display row count after parsing', async ({ page }) => {
    const textarea = page.getByLabel('Paste data');
    await textarea.fill('name,age\nAlice,30\nBob,25\nCarol,35');
    await page.getByRole('button', { name: 'Parse Text' }).click();
    await expect(page.getByText(/Parsed 4 rows/i)).toBeVisible();
  });

  test('should enable Sample Data button after parsing', async ({ page }) => {
    const sampleBtn = page.getByRole('button', { name: 'Sample Data' });
    await expect(sampleBtn).toBeDisabled();

    const textarea = page.getByLabel('Paste data');
    await textarea.fill('name,age\nAlice,30\nBob,25\nCarol,35');
    await page.getByRole('button', { name: 'Parse Text' }).click();
    await expect(sampleBtn).toBeEnabled();
  });

  test('should perform random sampling and show sampled data header', async ({ page }) => {
    const textarea = page.getByLabel('Paste data');
    await textarea.fill('name,age,city\nAlice,30,Tokyo\nBob,25,Osaka\nCarol,35,Kyoto\nDave,28,Nagoya\nEve,22,Sapporo');
    await page.getByRole('button', { name: 'Parse Text' }).click();

    // Set sample size to 2
    const sampleSizeInput = page.getByRole('spinbutton');
    await sampleSizeInput.fill('2');
    await page.getByRole('button', { name: 'Sample Data' }).click();

    await expect(page.getByText('Sampled Data')).toBeVisible();
  });

  test('should show Download CSV button after sampling', async ({ page }) => {
    const textarea = page.getByLabel('Paste data');
    await textarea.fill('name,age\nAlice,30\nBob,25\nCarol,35');
    await page.getByRole('button', { name: 'Parse Text' }).click();
    await page.getByRole('button', { name: 'Sample Data' }).click();
    await expect(page.getByRole('button', { name: /Download CSV/i })).toBeVisible();
  });

  test('should show Clear button after data is loaded', async ({ page }) => {
    const textarea = page.getByLabel('Paste data');
    await textarea.fill('name,age\nAlice,30\nBob,25');
    await page.getByRole('button', { name: 'Parse Text' }).click();
    await expect(page.getByRole('button', { name: /Clear/i })).toBeVisible();
  });

  test('should clear data when Clear button is clicked', async ({ page }) => {
    const textarea = page.getByLabel('Paste data');
    await textarea.fill('name,age\nAlice,30\nBob,25');
    await page.getByRole('button', { name: 'Parse Text' }).click();
    await page.getByRole('button', { name: /Clear/i }).click();
    await expect(page.getByText('Upload or paste data to begin')).toBeVisible();
  });

  test('should show sampling method selector', async ({ page }) => {
    await expect(page.getByText('Method')).toBeVisible();
    // The Select trigger should be visible
    await expect(page.getByRole('combobox')).toBeVisible();
  });

  test('should show error when parsing empty input', async ({ page }) => {
    await page.getByRole('button', { name: 'Parse Text' }).click();
    await expect(page.getByText(/Please enter or upload data/i)).toBeVisible();
  });
});
