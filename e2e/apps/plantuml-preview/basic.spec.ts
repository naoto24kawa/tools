import { test, expect } from '@playwright/test';

test.describe('PlantUML Preview', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/plantuml-preview');
  });

  test('should load page with title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'PlantUML Preview' })).toBeVisible();
  });

  test('should render SVG diagram from default input', async ({ page }) => {
    // The preview area contains an SVG generated from the default sample
    const svg = page.locator('svg').first();
    await expect(svg).toBeVisible();
  });

  test('should show class names from default Animal example', async ({ page }) => {
    // Default sample defines Animal, Dog, Cat classes
    await expect(page.getByText('Animal')).toBeVisible();
    await expect(page.getByText('Dog')).toBeVisible();
    await expect(page.getByText('Cat')).toBeVisible();
  });

  test('should show class and relation count in footer', async ({ page }) => {
    // Footer shows "N classes, M relations"
    await expect(page.getByText(/classes,/i)).toBeVisible();
    await expect(page.getByText(/relations/i)).toBeVisible();
  });

  test('should update diagram when input changes', async ({ page }) => {
    const textarea = page.locator('textarea').first();
    await textarea.fill('@startuml\nclass Foo {\n  +bar(): void\n}\n@enduml');
    await expect(page.getByText('Foo')).toBeVisible();
  });

  test('should have Copy SVG, SVG, and PNG export buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Copy SVG' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'SVG' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'PNG' })).toBeVisible();
  });

  test('should load Observer Pattern example from dropdown', async ({ page }) => {
    const select = page.getByRole('combobox');
    await select.click();
    await page.getByRole('option', { name: 'Observer Pattern' }).click();
    // Observer pattern includes Subject class
    await expect(page.getByText('Subject')).toBeVisible();
  });
});
