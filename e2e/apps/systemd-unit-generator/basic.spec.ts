import { test, expect } from '@playwright/test';

test.describe('Systemd Unit Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/systemd-unit-generator');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText('Systemd Unit Generator')).toBeVisible();
  });

  test('should show unit type selector defaulting to Service', async ({ page }) => {
    await expect(page.getByText('Service (.service)')).toBeVisible();
  });

  test('should show generated unit file output', async ({ page }) => {
    await expect(page.getByText('Generated Unit File')).toBeVisible();
  });

  test('should show [Unit] section in generated output', async ({ page }) => {
    await expect(page.locator('pre').getByText('[Unit]')).toBeVisible();
  });

  test('should show [Service] section in generated output', async ({ page }) => {
    await expect(page.locator('pre').getByText('[Service]')).toBeVisible();
  });

  test('should show [Install] section in generated output', async ({ page }) => {
    await expect(page.locator('pre').getByText('[Install]')).toBeVisible();
  });

  test('should update Description in output when changed', async ({ page }) => {
    // Description label has no htmlFor - find input inside same div as Description label
    const descInput = page.locator('div.space-y-2').filter({ hasText: /^Description$/ }).locator('input').first();
    await descInput.clear();
    await descInput.fill('My Custom Service');
    await expect(page.locator('pre').getByText('My Custom Service')).toBeVisible();
  });

  test('should update ExecStart in output when changed', async ({ page }) => {
    // ExecStart label has no htmlFor - find input inside same div as ExecStart label
    const execInput = page.locator('div.space-y-2').filter({ hasText: /^ExecStart$/ }).locator('input');
    await execInput.clear();
    await execInput.fill('/usr/bin/myapp --config /etc/myapp.conf');
    await expect(page.locator('pre').getByText('/usr/bin/myapp')).toBeVisible();
  });

  test('should switch to Timer unit type', async ({ page }) => {
    // Use filter to target the unit type combobox (has 'Service' text)
    const typeSelect = page.getByRole('combobox').filter({ hasText: /Service/ });
    await typeSelect.click();
    await page.getByRole('option', { name: 'Timer (.timer)' }).click();
    await expect(page.getByText('Timer Configuration')).toBeVisible();
    await expect(page.locator('pre').getByText('[Timer]')).toBeVisible();
  });

  test('should show OnCalendar field for Timer type', async ({ page }) => {
    const typeSelect = page.getByRole('combobox').filter({ hasText: /Service/ });
    await typeSelect.click();
    await page.getByRole('option', { name: 'Timer (.timer)' }).click();
    // OnCalendar label has no htmlFor - check the label text is visible
    await expect(page.getByText('OnCalendar (cron-like schedule)')).toBeVisible();
  });

  test('should have Copy button for generated unit', async ({ page }) => {
    await expect(page.getByRole('button', { name: /copy/i })).toBeVisible();
  });

  test('should show security options checkboxes', async ({ page }) => {
    await expect(page.getByLabel('PrivateTmp')).toBeVisible();
    await expect(page.getByLabel('ProtectSystem')).toBeVisible();
  });

  test('should add Environment Variable when Add button clicked', async ({ page }) => {
    await page.getByRole('button', { name: /add/i }).click();
    await expect(page.getByPlaceholder('KEY')).toBeVisible();
    await expect(page.getByPlaceholder('value')).toBeVisible();
  });
});
