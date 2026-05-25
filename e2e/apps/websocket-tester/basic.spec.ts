import { test, expect } from '@playwright/test';

test.describe('WebSocket Tester', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/websocket-tester');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText('WebSocket Tester')).toBeVisible();
  });

  test('should show connection card with URL input', async ({ page }) => {
    await expect(page.getByText('Connection')).toBeVisible();
    const urlInput = page.getByPlaceholder('wss://echo.websocket.org');
    await expect(urlInput).toBeVisible();
    await expect(urlInput).toHaveValue('wss://echo.websocket.org');
  });

  test('should show connect button when disconnected', async ({ page }) => {
    await expect(page.getByRole('button', { name: /connect/i })).toBeVisible();
  });

  test('should show initial disconnected status', async ({ page }) => {
    await expect(page.getByText('Disconnected')).toBeVisible();
  });

  test('should show message log area', async ({ page }) => {
    // CardTitle contains a nested Clear button, so full text is "Messages Clear" — target by CSS class
    await expect(page.locator('div.text-2xl', { hasText: /^Messages/ })).toBeVisible();
    await expect(page.getByText('No messages yet. Connect and send a message to start.')).toBeVisible();
  });

  test('should show send button (disabled when disconnected)', async ({ page }) => {
    const sendBtn = page.getByRole('button', { name: /send/i });
    await expect(sendBtn).toBeDisabled();
  });

  test('should show error status when connecting to invalid URL', async ({ page }) => {
    const urlInput = page.getByPlaceholder('wss://echo.websocket.org');
    await urlInput.fill('http://invalid-url');
    await page.getByRole('button', { name: /connect/i }).click();
    // Should show invalid URL error toast - use exact text to avoid strict mode violation
    await expect(page.getByText('Invalid URL', { exact: true })).toBeVisible();
  });

  test('should attempt connection and show connecting/error status for unreachable URL', async ({ page }) => {
    const urlInput = page.getByPlaceholder('wss://echo.websocket.org');
    await urlInput.fill('ws://localhost:19999');
    await page.getByRole('button', { name: /connect/i }).click();
    // Should show connecting message in the log
    await expect(page.getByText(/connecting to/i)).toBeVisible({ timeout: 3000 });
  });

  test('should have auto-reconnect checkbox', async ({ page }) => {
    const checkbox = page.locator('#auto-reconnect');
    await expect(checkbox).toBeAttached();
    await expect(checkbox).not.toBeChecked();
  });

  test('should allow clearing messages', async ({ page }) => {
    const clearBtn = page.getByRole('button', { name: /clear/i });
    await expect(clearBtn).toBeVisible();
  });
});
