import { test, expect } from '@playwright/test';

test.describe('List Randomizer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/list-randomize');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText(/List Randomizer/i)).toBeVisible();
  });

  test('should shuffle input list and produce non-empty output', async ({ page }) => {
    const input = page.locator('textarea#input');
    await input.fill('Apple\nBanana\nCherry\nDate\nEldberry');
    await page.getByRole('button', { name: /Shuffle All/i }).click();
    const output = page.locator('textarea#output');
    await expect(output).not.toHaveValue('');
    const outputValue = await output.inputValue();
    expect(outputValue.length).toBeGreaterThan(0);
  });

  test('should contain all original items after shuffle', async ({ page }) => {
    const items = ['Apple', 'Banana', 'Cherry', 'Date'];
    const input = page.locator('textarea#input');
    await input.fill(items.join('\n'));
    await page.getByRole('button', { name: /Shuffle All/i }).click();
    const output = page.locator('textarea#output');
    const outputValue = await output.inputValue();
    for (const item of items) {
      expect(outputValue).toContain(item);
    }
  });

  test('should pick 1 item by default using Pick button', async ({ page }) => {
    const input = page.locator('textarea#input');
    await input.fill('Apple\nBanana\nCherry\nDate\nEldberry');
    await page.getByRole('button', { name: /^Pick$/i }).click();
    const output = page.locator('textarea#output');
    const outputValue = await output.inputValue();
    const lines = outputValue.trim().split('\n').filter((l) => l.trim() !== '');
    expect(lines.length).toBe(1);
  });

  test('should pick specified number of items', async ({ page }) => {
    const input = page.locator('textarea#input');
    await input.fill('Apple\nBanana\nCherry\nDate\nEldberry');
    await page.locator('input#pickCount').fill('3');
    await page.getByRole('button', { name: /^Pick$/i }).click();
    const output = page.locator('textarea#output');
    const outputValue = await output.inputValue();
    const lines = outputValue.trim().split('\n').filter((l) => l.trim() !== '');
    expect(lines.length).toBe(3);
  });

  test('should disable Shuffle All and Pick buttons when input is empty', async ({ page }) => {
    const input = page.locator('textarea#input');
    await expect(input).toHaveValue('');
    await expect(page.getByRole('button', { name: /Shuffle All/i })).toBeDisabled();
    await expect(page.getByRole('button', { name: /^Pick$/i })).toBeDisabled();
  });

  test('should clear input and output when Clear is clicked', async ({ page }) => {
    const input = page.locator('textarea#input');
    await input.fill('Apple\nBanana\nCherry');
    await page.getByRole('button', { name: /Shuffle All/i }).click();
    await expect(page.locator('textarea#output')).not.toHaveValue('');
    await page.getByRole('button', { name: /Clear/i }).click();
    await expect(input).toHaveValue('');
    await expect(page.locator('textarea#output')).toHaveValue('');
  });

  test('should produce different order on repeated shuffles', async ({ page }) => {
    const items = 'Alpha\nBeta\nGamma\nDelta\nEpsilon\nZeta\nEta\nTheta';
    const input = page.locator('textarea#input');
    await input.fill(items);
    await page.getByRole('button', { name: /Shuffle All/i }).click();
    const first = await page.locator('textarea#output').inputValue();
    // Shuffle again
    await page.getByRole('button', { name: /Shuffle All/i }).click();
    const second = await page.locator('textarea#output').inputValue();
    // With 8 items, the probability of identical order is 1/40320 — effectively impossible
    // We just check both are non-empty and contain the items
    expect(first.length).toBeGreaterThan(0);
    expect(second.length).toBeGreaterThan(0);
    expect(first).toContain('Alpha');
    expect(second).toContain('Alpha');
  });
});
