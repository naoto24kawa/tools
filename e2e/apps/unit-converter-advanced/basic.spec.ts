import { test, expect } from '@playwright/test';

test.describe('Unit Converter Advanced', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/unit-converter-advanced');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText(/Unit Converter Advanced/i)).toBeVisible();
  });

  test('should show category selector', async ({ page }) => {
    // shadcn Select uses a button trigger with role="combobox"
    await expect(page.locator('[id="category"]')).toBeVisible();
    // Label for category
    await expect(page.getByText('Category', { exact: true })).toBeVisible();
  });

  test('should convert temperature: 0 Celsius to Fahrenheit', async ({ page }) => {
    // Select Temperature category using shadcn Select
    const categoryTrigger = page.locator('[id="category"]');
    await categoryTrigger.click();
    await page.getByRole('option', { name: /temperature/i }).click();

    // Enter value 0
    const valueInput = page.locator('input#from-value');
    await valueInput.fill('0');

    // Select Celsius as from unit and Fahrenheit as to unit
    const selects = page.getByRole('combobox');
    // From unit select (second combobox - after category)
    await selects.nth(1).click();
    await page.getByRole('option', { name: /celsius/i }).first().click();

    // To unit select (third combobox)
    await selects.nth(2).click();
    await page.getByRole('option', { name: /fahrenheit/i }).first().click();

    await page.getByRole('button', { name: /convert/i }).click();
    // Result "32" appears in multiple elements; use the result display div
    await expect(page.getByText('32', { exact: true })).toBeVisible();
  });

  test('should show Convert button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /convert/i })).toBeVisible();
  });

  test('should show error for invalid number input', async ({ page }) => {
    const valueInput = page.locator('input#from-value');
    // input[type=number] can't accept text, use JS to set value and dispatch event
    await valueInput.evaluate((el: HTMLInputElement) => {
      Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')!.set!.call(el, 'abc');
      el.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await page.getByRole('button', { name: /convert/i }).click();
    await expect(page.getByText('Invalid input', { exact: true })).toBeVisible();
  });

  test('should swap units on swap button click', async ({ page }) => {
    const swapButton = page.getByRole('button', { name: /swap units/i });
    await expect(swapButton).toBeVisible();
    // Get initial from/to unit values
    const selects = page.getByRole('combobox');
    const fromVal = await selects.nth(1).textContent();
    const toVal = await selects.nth(2).textContent();
    await swapButton.click();
    const newFromVal = await selects.nth(1).textContent();
    const newToVal = await selects.nth(2).textContent();
    expect(newFromVal).toBe(toVal);
    expect(newToVal).toBe(fromVal);
  });

  test('should display formula after conversion', async ({ page }) => {
    const valueInput = page.locator('input#from-value');
    await valueInput.fill('1');
    await page.getByRole('button', { name: /convert/i }).click();
    await expect(page.getByText(/formula/i)).toBeVisible();
  });
});
