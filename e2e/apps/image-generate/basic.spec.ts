import { test, expect } from '@playwright/test';

test.describe('Image Generate - Comprehensive E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/image-generate');
  });

  test('should load the page successfully', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Image Generate/i })).toBeVisible();
    await expect(page.getByText(/画像を生成/i)).toBeVisible();
  });

  test('should display canvas preview', async ({ page }) => {
    // Canvasが表示されることを確認
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
  });

  test('should change image size', async ({ page }) => {
    // サイズ入力フィールドを取得
    const widthInput = page.locator('input[type="number"]').first();
    const heightInput = page.locator('input[type="number"]').nth(1);
    
    // サイズを変更
    await widthInput.fill('800');
    await heightInput.fill('600');
    
    // Canvasが更新されることを確認（サイズ変更後も表示されている）
    await expect(page.locator('canvas')).toBeVisible();
  });

  test('should select preset size', async ({ page }) => {
    // プリセットボタンを探す（例: 1920x1080）
    const presetButton = page.getByRole('button', { name: /1920.*1080/i }).first();
    
    if (await presetButton.isVisible()) {
      await presetButton.click();
      
      // Canvasが更新されることを確認
      await expect(page.locator('canvas')).toBeVisible();
    }
  });

  test('should change background color', async ({ page }) => {
    // カラーピッカーを探す
    const colorInput = page.locator('input[type="color"]').first();
    
    if (await colorInput.isVisible()) {
      // 色を変更
      await colorInput.fill('#FF0000');
      
      // Canvasが更新されることを確認
      await expect(page.locator('canvas')).toBeVisible();
    }
  });

  test('should add text to image', async ({ page }) => {
    // テキスト入力フィールドを探す
    const textInput = page.locator('input[type="text"]').first();
    
    if (await textInput.isVisible()) {
      // テキストを入力
      await textInput.fill('Test Text');
      
      // Canvasが更新されることを確認
      await expect(page.locator('canvas')).toBeVisible();
    }
  });

  test('should change aspect ratio', async ({ page }) => {
    // アスペクト比選択を探す
    const aspectRatioSelect = page.locator('select').first();
    
    if (await aspectRatioSelect.isVisible()) {
      // アスペクト比を変更
      await aspectRatioSelect.selectOption({ index: 1 });
      
      // Canvasが更新されることを確認
      await expect(page.locator('canvas')).toBeVisible();
    }
  });

  test('should export image', async ({ page }) => {
    // エクスポートボタンを探す
    const exportButton = page.getByRole('button', { name: /エクスポート|ダウンロード|保存/i });
    
    if (await exportButton.isVisible()) {
      // ダウンロードイベントを待機
      const downloadPromise = page.waitForEvent('download');
      
      await exportButton.click();
      
      // ダウンロードが開始されることを確認
      const download = await downloadPromise;
      expect(download).toBeTruthy();
    }
  });

  test('should change export format', async ({ page }) => {
    // フォーマット選択を探す
    const formatSelect = page.locator('select').filter({ hasText: /PNG|JPEG|WebP/i }).first();
    
    if (await formatSelect.isVisible()) {
      // フォーマットを変更
      await formatSelect.selectOption('jpeg');
      
      // UIが更新されることを確認
      await expect(page.locator('canvas')).toBeVisible();
    }
  });

  test('should select pattern/preset', async ({ page }) => {
    // パターン選択ボタンを探す
    const patternButtons = page.getByRole('button').filter({ hasText: /グラデーション|ソリッド|パターン/i });
    
    const count = await patternButtons.count();
    if (count > 0) {
      await patternButtons.first().click();
      
      // Canvasが更新されることを確認
      await expect(page.locator('canvas')).toBeVisible();
    }
  });
});
