import { test, expect } from '@playwright/test';

const SAMPLE_ICS = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Test//Test//EN
BEGIN:VEVENT
UID:test-event-001@example.com
SUMMARY:Team Meeting
DTSTART:20240115T100000Z
DTEND:20240115T110000Z
LOCATION:Conference Room A
DESCRIPTION:Weekly sync
END:VEVENT
END:VCALENDAR`;

test.describe('iCalendar Parser', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ical-parser');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText(/iCalendar Parser/i)).toBeVisible();
  });

  test('should show textarea input and Parse button', async ({ page }) => {
    await expect(page.locator('textarea')).toBeVisible();
    await expect(page.getByRole('button', { name: /^parse$/i })).toBeVisible();
  });

  test('should have Parse button disabled when input is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /^parse$/i })).toBeDisabled();
  });

  test('should parse ICS content and display event', async ({ page }) => {
    await page.locator('textarea').fill(SAMPLE_ICS);
    await page.getByRole('button', { name: /^parse$/i }).click();
    await expect(page.getByRole('heading', { name: 'Team Meeting' })).toBeVisible();
  });

  test('should show parsed count in toast', async ({ page }) => {
    await page.locator('textarea').fill(SAMPLE_ICS);
    await page.getByRole('button', { name: /^parse$/i }).click();
    await expect(page.getByText('1 item(s) parsed', { exact: true })).toBeVisible();
  });

  test('should show Event type badge', async ({ page }) => {
    await page.locator('textarea').fill(SAMPLE_ICS);
    await page.getByRole('button', { name: /^parse$/i }).click();
    await expect(page.getByText(/^event$/i)).toBeVisible();
  });

  test('should show List View and Calendar View buttons after parse', async ({ page }) => {
    await page.locator('textarea').fill(SAMPLE_ICS);
    await page.getByRole('button', { name: /^parse$/i }).click();
    await expect(page.getByRole('button', { name: /list view/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /calendar view/i })).toBeVisible();
  });

  test('should switch to calendar view', async ({ page }) => {
    await page.locator('textarea').fill(SAMPLE_ICS);
    await page.getByRole('button', { name: /^parse$/i }).click();
    await page.getByRole('button', { name: /calendar view/i }).click();
    // Calendar shows day-of-week headers
    await expect(page.getByText('Sun')).toBeVisible();
    await expect(page.getByText('Mon')).toBeVisible();
  });

  test('should clear input and events when clicking Clear', async ({ page }) => {
    await page.locator('textarea').fill(SAMPLE_ICS);
    await page.getByRole('button', { name: /^parse$/i }).click();
    await expect(page.getByRole('heading', { name: 'Team Meeting' })).toBeVisible();
    await page.getByRole('button', { name: /clear/i }).click();
    await expect(page.locator('textarea')).toHaveValue('');
    await expect(page.getByRole('heading', { name: 'Team Meeting' })).not.toBeVisible();
  });
});
