import { Page } from '@playwright/test';

/**
 * Wait for a specific amount of time
 * @param ms - Milliseconds to wait
 */
export async function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Wait for network to be idle
 * @param page - Playwright page object
 * @param timeout - Maximum time to wait in milliseconds
 */
export async function waitForNetworkIdle(page: Page, timeout = 5000): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout });
}

/**
 * Take a screenshot with a custom name
 * @param page - Playwright page object
 * @param name - Screenshot name
 */
export async function takeScreenshot(page: Page, name: string): Promise<void> {
  await page.screenshot({ path: `test-results/screenshots/${name}.png`, fullPage: true });
}

/**
 * Check if an element is visible and enabled
 * @param page - Playwright page object
 * @param selector - Element selector
 */
export async function isElementReady(page: Page, selector: string): Promise<boolean> {
  const element = page.locator(selector);
  return (await element.isVisible()) && (await element.isEnabled());
}

/**
 * Fill input and wait for it to be updated
 * @param page - Playwright page object
 * @param selector - Input selector
 * @param value - Value to fill
 */
export async function fillInput(page: Page, selector: string, value: string): Promise<void> {
  await page.locator(selector).fill(value);
  await page.waitForTimeout(100); // Small delay to ensure state update
}

/**
 * Click button and wait for action to complete
 * @param page - Playwright page object
 * @param selector - Button selector
 */
export async function clickButton(page: Page, selector: string): Promise<void> {
  await page.locator(selector).click();
  await page.waitForTimeout(100); // Small delay to ensure action completes
}

/**
 * Get text content of an element
 * @param page - Playwright page object
 * @param selector - Element selector
 */
export async function getTextContent(page: Page, selector: string): Promise<string> {
  const element = page.locator(selector);
  return (await element.textContent()) || '';
}

/**
 * Check if page has loaded successfully
 * @param page - Playwright page object
 */
export async function waitForPageLoad(page: Page): Promise<void> {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('load');
}

/**
 * Navigate to a path and wait for load
 * @param page - Playwright page object
 * @param path - Path to navigate to
 */
export async function navigateAndWait(page: Page, path: string): Promise<void> {
  await page.goto(path);
  await waitForPageLoad(page);
}
