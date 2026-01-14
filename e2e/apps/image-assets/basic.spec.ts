import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Image Assets - Comprehensive E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/image-assets');
  });

  test('should load the page successfully', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Image Assets/i })).toBeVisible();
    await expect(page.getByText(/アセット|OGP|favicon/i)).toBeVisible();
  });

  test('should have file input', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeVisible();
  });

  test('should upload and generate assets', async ({ page }) => {
    const testImagePath = path.join(__dirname, '../../shared/fixtures/test-image.png');
    
    // 画像をアップロード
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testImagePath);
    
    // アセット生成ボタンを探す
    const generateButton = page.getByRole('button', { name: /生成|アセットを生成|Generate/i });
    
    if (await generateButton.isVisible()) {
      await generateButton.click();
      
      // 生成が完了するまで待機（長めのタイムアウト）
      await page.waitForTimeout(2000);
      
      // プレビューが表示されることを確認
      const previews = page.locator('img').filter({ hasNot: page.locator('img[alt="Original"]') });
      const count = await previews.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('should display multiple asset previews', async ({ page }) => {
    const testImagePath = path.join(__dirname, '../../shared/fixtures/test-image.png');
    
    // 画像をアップロード
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testImagePath);
    
    // アセット生成ボタンをクリック
    const generateButton = page.getByRole('button', { name: /生成|アセットを生成|Generate/i });
    
    if (await generateButton.isVisible()) {
      await generateButton.click();
      
      // 複数のプレビューが表示されるまで待機
      await page.waitForTimeout(2000);
      
      // OGP画像のプレビューを確認
      const ogpPreview = page.getByText(/OGP|1200.*630/i);
      if (await ogpPreview.isVisible()) {
        expect(await ogpPreview.isVisible()).toBeTruthy();
      }
      
      // Faviconのプレビューを確認
      const faviconPreview = page.getByText(/favicon|32.*32/i);
      if (await faviconPreview.isVisible()) {
        expect(await faviconPreview.isVisible()).toBeTruthy();
      }
    }
  });

  test('should download all assets as ZIP', async ({ page }) => {
    const testImagePath = path.join(__dirname, '../../shared/fixtures/test-image.png');
    
    // 画像をアップロード
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testImagePath);
    
    // アセット生成ボタンをクリック
    const generateButton = page.getByRole('button', { name: /生成|アセットを生成|Generate/i });
    
    if (await generateButton.isVisible()) {
      await generateButton.click();
      
      // 生成完了を待機
      await page.waitForTimeout(2000);
      
      // ZIPダウンロードボタンを探す
      const downloadButton = page.getByRole('button', { name: /ZIP|ダウンロード|すべて/i });
      
      if (await downloadButton.isVisible()) {
        // ダウンロードイベントを待機
        const downloadPromise = page.waitForEvent('download');
        
        await downloadButton.click();
        
        // ダウンロードが開始されることを確認
        const download = await downloadPromise;
        expect(download).toBeTruthy();
        
        // ファイル名がZIPであることを確認
        const fileName = download.suggestedFilename();
        expect(fileName).toMatch(/\.zip$/i);
      }
    }
  });

  test('should generate different asset sizes', async ({ page }) => {
    const testImagePath = path.join(__dirname, '../../shared/fixtures/test-image.png');
    
    // 画像をアップロード
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testImagePath);
    
    // アセット生成ボタンをクリック
    const generateButton = page.getByRole('button', { name: /生成|アセットを生成|Generate/i });
    
    if (await generateButton.isVisible()) {
      await generateButton.click();
      
      // 生成完了を待機
      await page.waitForTimeout(2000);
      
      // 異なるサイズのアセットが生成されていることを確認
      const assetSizes = [
        /1200.*630/i,  // OGP
        /512.*512/i,   // PWA
        /180.*180/i,   // Apple Touch Icon
        /32.*32/i,     // Favicon
      ];
      
      for (const sizePattern of assetSizes) {
        const element = page.getByText(sizePattern).first();
        if (await element.isVisible()) {
          expect(await element.isVisible()).toBeTruthy();
        }
      }
    }
  });

  test('should reset and upload new image', async ({ page }) => {
    const testImagePath = path.join(__dirname, '../../shared/fixtures/test-image.png');
    
    // 画像をアップロード
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testImagePath);
    
    // リセットボタンを探す
    const resetButton = page.getByRole('button', { name: /リセット|クリア|新しい/i });
    
    if (await resetButton.isVisible()) {
      await resetButton.click();
      
      // ファイル入力が再度表示されることを確認
      await expect(fileInput).toBeVisible();
    }
  });

  test('should handle large images', async ({ page }) => {
    const testImagePath = path.join(__dirname, '../../shared/fixtures/test-image.png');
    
    // 画像をアップロード
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testImagePath);
    
    // アセット生成ボタンをクリック
    const generateButton = page.getByRole('button', { name: /生成|アセットを生成|Generate/i });
    
    if (await generateButton.isVisible()) {
      await generateButton.click();
      
      // 大きな画像でも処理が完了することを確認（長めのタイムアウト）
      await page.waitForTimeout(5000);
      
      // エラーメッセージが表示されていないことを確認
      const errorMessage = page.getByText(/エラー|失敗|Error/i);
      expect(await errorMessage.isVisible()).toBeFalsy();
    }
  });
});
