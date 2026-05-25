import { test, expect } from '@playwright/test';

test.describe('Flashcard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/flashcard');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page).toHaveTitle(/Flashcard/i);
    await expect(page.getByText('Flashcard')).toBeVisible();
  });

  test('should show Create Deck section', async ({ page }) => {
    await expect(page.getByText('Create Deck').first()).toBeVisible();
    await expect(page.getByPlaceholder(/deck name/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /create/i })).toBeVisible();
  });

  test('should show empty state when no decks exist', async ({ page }) => {
    // Clear localStorage to ensure empty state
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await expect(page.getByText(/no decks yet/i)).toBeVisible();
  });

  test('should create a new deck', async ({ page }) => {
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    await page.getByPlaceholder(/deck name/i).fill('Spanish Vocabulary');
    await page.getByRole('button', { name: /create/i }).click();

    await expect(page.getByText('Spanish Vocabulary')).toBeVisible();
  });

  test('should show card count and progress after deck creation', async ({ page }) => {
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    await page.getByPlaceholder(/deck name/i).fill('Test Deck');
    await page.getByRole('button', { name: /create/i }).click();

    await expect(page.getByText(/0 cards/)).toBeVisible();
    await expect(page.getByText(/0% known/)).toBeVisible();
  });

  test('should navigate to cards view when deck is clicked', async ({ page }) => {
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    await page.getByPlaceholder(/deck name/i).fill('My Deck');
    await page.getByRole('button', { name: /create/i }).click();

    await page.getByText('My Deck').click();

    await expect(page.getByText('Add Card').first()).toBeVisible();
    await expect(page.getByLabel('Front')).toBeVisible();
    await expect(page.getByLabel('Back')).toBeVisible();
  });

  test('should add a card to a deck', async ({ page }) => {
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    await page.getByPlaceholder(/deck name/i).fill('My Deck');
    await page.getByRole('button', { name: /create/i }).click();
    await page.getByText('My Deck').click();

    await page.getByLabel('Front').fill('What is 2+2?');
    await page.getByLabel('Back').fill('4');
    await page.getByRole('button', { name: /add card/i }).click();

    await expect(page.getByText('What is 2+2?')).toBeVisible();
  });

  test('should start study session when Study button is clicked', async ({ page }) => {
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    await page.getByPlaceholder(/deck name/i).fill('Study Deck');
    await page.getByRole('button', { name: /create/i }).click();
    await page.getByText('Study Deck').click();

    await page.getByLabel('Front').fill('Question');
    await page.getByLabel('Back').fill('Answer');
    await page.getByRole('button', { name: /add card/i }).click();

    await page.getByRole('button', { name: /study/i }).click();

    await expect(page.getByText(/FRONT/i)).toBeVisible();
    await expect(page.getByText(/click to flip/i)).toBeVisible();
  });

  test('should flip card when clicked in study mode', async ({ page }) => {
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    await page.getByPlaceholder(/deck name/i).fill('Flip Test');
    await page.getByRole('button', { name: /create/i }).click();
    await page.getByText('Flip Test').click();

    await page.getByLabel('Front').fill('Front Side');
    await page.getByLabel('Back').fill('Back Side');
    await page.getByRole('button', { name: /add card/i }).click();

    await page.getByRole('button', { name: /study/i }).click();

    // Click to flip
    await page.getByText(/click to flip/i).click();
    await expect(page.getByText(/BACK/i).first()).toBeVisible();
    await expect(page.getByText('Back Side')).toBeVisible();
  });

  test('should have Export and Import buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: /export/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /import/i })).toBeVisible();
  });
});
