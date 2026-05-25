import { test, expect } from '@playwright/test';

test.describe('Markdown to Slides', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/markdown-to-slides');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Markdown.*Slides|Slides/i);
  });

  test('should show heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Markdown to Slides' })).toBeVisible();
  });

  test('should pre-populate sample markdown', async ({ page }) => {
    const textarea = page.getByLabel('Markdown input');
    await expect(textarea).toHaveValue(/Welcome to Slides/);
  });

  test('should auto-parse slides on mount and show slide preview', async ({ page }) => {
    await expect(page.getByText('Slide Preview')).toBeVisible();
    // Preview area should have content from the sample
    await expect(page.getByText('Slide 1 of')).toBeVisible();
  });

  test('should parse slides and show navigation', async ({ page }) => {
    await page.getByRole('button', { name: 'Parse Slides' }).click();

    await expect(page.getByRole('button', { name: /Previous/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Next/ })).toBeVisible();
  });

  test('should navigate to next slide', async ({ page }) => {
    await page.getByRole('button', { name: 'Parse Slides' }).click();

    const slideCounter = page.getByText(/Slide \d+ of \d+/);
    const initialText = await slideCounter.textContent();

    await page.getByRole('button', { name: /Next/ }).click();

    const newText = await slideCounter.textContent();
    expect(newText).not.toBe(initialText);
  });

  test('should disable Previous button on first slide', async ({ page }) => {
    await page.getByRole('button', { name: 'Parse Slides' }).click();

    await expect(page.getByRole('button', { name: /Previous/ })).toBeDisabled();
  });

  test('should parse custom markdown with slides', async ({ page }) => {
    const textarea = page.getByLabel('Markdown input');
    await textarea.fill('# Slide One\nContent A\n---\n# Slide Two\nContent B\n---\n# Slide Three\nContent C');

    await page.getByRole('button', { name: 'Parse Slides' }).click();

    await expect(page.getByText('Slide 1 of 3')).toBeVisible();
    // First slide should show "Slide One"
    await expect(page.getByText('Slide One')).toBeVisible();
  });

  test('should navigate through all slides with dot indicators', async ({ page }) => {
    await page.getByRole('button', { name: 'Parse Slides' }).click();

    // Dot navigation buttons
    const dots = page.getByRole('button', { name: /Go to slide/ });
    expect(await dots.count()).toBeGreaterThan(1);

    // Click second dot
    await page.getByRole('button', { name: 'Go to slide 2' }).click();
    await expect(page.getByText('Slide 2 of')).toBeVisible();
  });

  test('should show fullscreen button', async ({ page }) => {
    await page.getByRole('button', { name: 'Parse Slides' }).click();

    // Maximize button (fullscreen icon)
    const fullscreenBtn = page.locator('button').filter({ has: page.locator('svg') }).last();
    await expect(fullscreenBtn).toBeVisible();
  });
});
