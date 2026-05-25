import { test, expect } from '@playwright/test';

test.describe('Habit Tracker', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/habit-tracker');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByText(/Habit Tracker/i)).toBeVisible();
  });

  test('should show Add New Habit form', async ({ page }) => {
    await expect(page.getByLabel(/habit name/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /add/i })).toBeVisible();
  });

  test('should add a new habit and display it in the table', async ({ page }) => {
    await page.getByLabel(/habit name/i).fill('Exercise');
    await page.getByRole('button', { name: /^add$/i }).click();
    await expect(page.getByText('Exercise')).toBeVisible();
  });

  test('should show toast when habit name is empty on add', async ({ page }) => {
    await page.getByRole('button', { name: /^add$/i }).click();
    await expect(page.getByText('Please enter a habit name', { exact: true })).toBeVisible();
  });

  test('should add habit with Enter key', async ({ page }) => {
    await page.getByLabel(/habit name/i).fill('Meditate');
    await page.getByLabel(/habit name/i).press('Enter');
    await expect(page.getByText('Meditate')).toBeVisible();
  });

  test('should delete a habit after adding it', async ({ page }) => {
    await page.getByLabel(/habit name/i).fill('Read');
    await page.getByRole('button', { name: /^add$/i }).click();
    await expect(page.getByText('Read')).toBeVisible();
    await page.getByRole('button', { name: /delete habit/i }).first().click();
    await expect(page.getByText('Read')).not.toBeVisible();
  });

  test('should toggle day checkbox for a habit', async ({ page }) => {
    await page.getByLabel(/habit name/i).fill('Run');
    await page.getByRole('button', { name: /^add$/i }).click();
    // The 7-day grid buttons have class w-8 h-8
    const dayButtons = page.locator('table tbody button.w-8');
    const count = await dayButtons.count();
    expect(count).toBeGreaterThan(0);
    await dayButtons.last().click();
    // After toggle, button should have green styling
    await expect(dayButtons.last()).toHaveClass(/bg-green-500/);
  });

  test('should show Export JSON and Import JSON buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: /export json/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /import json/i })).toBeVisible();
  });
});
