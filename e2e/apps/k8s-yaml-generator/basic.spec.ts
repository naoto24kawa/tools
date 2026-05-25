import { test, expect } from '@playwright/test';

test.describe('K8s YAML Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/k8s-yaml-generator');
  });

  test('should load page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/K8s|Kubernetes/i);
  });

  test('should show heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'K8s YAML Generator' })).toBeVisible();
  });

  test('should show Deployment YAML by default', async ({ page }) => {
    await expect(page.getByText('Deployment Config')).toBeVisible();
    const pre = page.locator('pre').first();
    await expect(pre).toContainText('kind: Deployment');
  });

  test('should update YAML when deployment name is changed', async ({ page }) => {
    // YAML should already contain the default name 'my-app'
    const pre = page.locator('pre').first();
    await expect(pre).toContainText('my-app');
  });

  test('should switch to Service resource type and show Service YAML', async ({ page }) => {
    // Use combobox role for Radix UI Select trigger
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: 'Service' }).click();

    await expect(page.getByText('Service Config')).toBeVisible();
    const pre = page.locator('pre').first();
    await expect(pre).toContainText('kind: Service');
  });

  test('should switch to ConfigMap and show ConfigMap YAML', async ({ page }) => {
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: 'ConfigMap' }).click();

    await expect(page.getByText('ConfigMap Config')).toBeVisible();
    const pre = page.locator('pre').first();
    await expect(pre).toContainText('kind: ConfigMap');
  });

  test('should switch to Secret and show Secret YAML', async ({ page }) => {
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: 'Secret' }).click();

    await expect(page.getByText('Secret Config')).toBeVisible();
    const pre = page.locator('pre').first();
    await expect(pre).toContainText('kind: Secret');
  });

  test('should update replicas in Deployment YAML', async ({ page }) => {
    // Default replicas is 3, find input by value
    const replicasInput = page.locator('input[value="3"]').first();
    await replicasInput.clear();
    await replicasInput.fill('5');

    const pre = page.locator('pre').first();
    await expect(pre).toContainText('replicas: 5');
  });

  test('should show copy button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Copy/ })).toBeVisible();
  });
});
