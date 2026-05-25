import { test, expect } from '@playwright/test';

test.describe('GraphQL Formatter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/graphql-formatter');
  });

  test('should display the page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /GraphQL Formatter/i })).toBeVisible();
  });

  test('should format a compact GraphQL query', async ({ page }) => {
    const input = page.getByLabel('Input');
    await input.fill('query{user{id name email}}');
    await page.getByRole('button', { name: /format/i }).click();
    const output = page.getByLabel('Output');
    const value = await output.inputValue();
    expect(value).toContain('query');
    expect(value).toContain('user');
    expect(value.split('\n').length).toBeGreaterThan(1);
  });

  test('should minify a multi-line GraphQL query', async ({ page }) => {
    const multiLine = `query {
  user {
    id
    name
  }
}`;
    const input = page.getByLabel('Input');
    await input.fill(multiLine);
    await page.getByRole('button', { name: /minify/i }).click();
    const output = page.getByLabel('Output');
    const value = await output.inputValue();
    expect(value).toContain('user');
    expect(value.split('\n').length).toBeLessThanOrEqual(2);
  });

  test('should format a mutation', async ({ page }) => {
    const input = page.getByLabel('Input');
    await input.fill('mutation{createUser(name:"Alice"){id name}}');
    await page.getByRole('button', { name: /format/i }).click();
    const output = page.getByLabel('Output');
    const value = await output.inputValue();
    expect(value).toContain('mutation');
    expect(value).toContain('createUser');
  });

  test('should disable Format button when input is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /format/i })).toBeDisabled();
  });

  test('should disable Minify button when input is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /minify/i })).toBeDisabled();
  });

  test('should clear both input and output when Clear is clicked', async ({ page }) => {
    const input = page.getByLabel('Input');
    await input.fill('query{user{id}}');
    await page.getByRole('button', { name: /format/i }).click();
    await page.getByRole('button', { name: /clear/i }).click();
    await expect(input).toHaveValue('');
    await expect(page.getByLabel('Output')).toHaveValue('');
  });

  test('should disable Copy Result button when output is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: /copy result/i })).toBeDisabled();
  });
});
