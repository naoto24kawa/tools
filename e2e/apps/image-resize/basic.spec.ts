import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Image Resize - Comprehensive E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/image-resize');
  });

  test('should load the page successfully', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Image Resize/i })).toBeVisible();
    await expect(page.getByText(/画像を拡大・縮小/i)).toBeVisible();
  });

  test('should have file input', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeVisible();
  });

  test('should upload and display image', async ({ page }) => {
    // テスト用の画像ファイルパスを作成
    const testImagePath = path.join(__dirname, '../../shared/fixtures/test-image.png');
    
    // ファイル入力を取得
    const fileInput = page.locator('input[type="file"]');
    
    // 画像をアップロード
    await fileInput.setInputFiles(testImagePath);
    
    // 画像が表示されることを確認
    await expect(page.locator('img[alt="Original"]')).toBeVisible({ timeout: 5000 });
    
    // 元画像サイズが表示されることを確認
    await expect(page.getByText(/元画像サイズ/i)).toBeVisible();
  });

  test('should resize image by percentage', async ({ page }) => {
    const testImagePath = path.join(__dirname, '../../shared/fixtures/test-image.png');
    
    // 画像をアップロード
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testImagePath);
    
    // 画像が読み込まれるまで待機
    await expect(page.locator('img[alt="Original"]')).toBeVisible({ timeout: 5000 });
    
    // パーセント指定を選択
    const methodSelect = page.locator('select').first();
    await methodSelect.selectOption('percent');
    
    // スケールを50%に設定
    const scaleSlider = page.locator('input[type="range"]');
    await scaleSlider.fill('50');
    
    // リサイズボタンをクリック
    const resizeButton = page.getByRole('button', { name: /リサイズ実行/i });
    await resizeButton.click();
    
    // リサイズ後の画像が表示されることを確認
    await expect(page.locator('img[alt="Resized"]')).toBeVisible({ timeout: 5000 });
    
    // ダウンロードボタンが表示されることを確認
    await expect(page.getByRole('button', { name: /ダウンロード/i })).toBeVisible();
  });

  test('should resize image by pixel dimensions', async ({ page }) => {
    const testImagePath = path.join(__dirname, '../../shared/fixtures/test-image.png');
    
    // 画像をアップロード
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testImagePath);
    
    await expect(page.locator('img[alt="Original"]')).toBeVisible({ timeout: 5000 });
    
    // ピクセル指定を選択
    const methodSelect = page.locator('select').first();
    await methodSelect.selectOption('pixel');
    
    // 幅を800pxに設定
    const widthInput = page.locator('input[id="resize-width"]');
    await widthInput.fill('800');
    
    // リサイズボタンをクリック
    const resizeButton = page.getByRole('button', { name: /リサイズ実行/i });
    await resizeButton.click();
    
    // リサイズ後の画像が表示されることを確認
    await expect(page.locator('img[alt="Resized"]')).toBeVisible({ timeout: 5000 });
  });

  test('should change output format', async ({ page }) => {
    const testImagePath = path.join(__dirname, '../../shared/fixtures/test-image.png');
    
    // 画像をアップロード
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testImagePath);
    
    await expect(page.locator('img[alt="Original"]')).toBeVisible({ timeout: 5000 });
    
    // フォーマットをJPEGに変更
    const formatSelect = page.locator('select').nth(1);
    await formatSelect.selectOption('jpeg');
    
    // リサイズボタンをクリック
    const resizeButton = page.getByRole('button', { name: /リサイズ実行/i });
    await resizeButton.click();
    
    // リサイズ後の画像が表示されることを確認
    await expect(page.locator('img[alt="Resized"]')).toBeVisible({ timeout: 5000 });
  });

  test('should reset and select another image', async ({ page }) => {
    const testImagePath = path.join(__dirname, '../../shared/fixtures/test-image.png');
    
    // 画像をアップロード
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testImagePath);
    
    await expect(page.locator('img[alt="Original"]')).toBeVisible({ timeout: 5000 });
    
    // 別の画像を選択ボタンをクリック
    const resetButton = page.getByRole('button', { name: /別の画像を選択/i });
    await resetButton.click();
    
    // ファイル入力が再度表示されることを確認
    await expect(fileInput).toBeVisible();
  });

  test('should handle file size target', async ({ page }) => {
    const testImagePath = path.join(__dirname, '../../shared/fixtures/test-image.png');
    
    // 画像をアップロード
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testImagePath);
    
    await expect(page.locator('img[alt="Original"]')).toBeVisible({ timeout: 5000 });
    
    // ファイルサイズ指定を選択
    const methodSelect = page.locator('select').first();
    await methodSelect.selectOption('filesize');
    
    // 目標ファイルサイズを100KBに設定
    const fileSizeInput = page.locator('input[id="target-filesize"]');
    await fileSizeInput.fill('100');
    
    // リサイズボタンをクリック
    const resizeButton = page.getByRole('button', { name: /リサイズ実行/i });
    await resizeButton.click();
    
    // リサイズ後の画像が表示されることを確認（時間がかかる可能性があるため長めのタイムアウト）
    await expect(page.locator('img[alt="Resized"]')).toBeVisible({ timeout: 10000 });
  });
});
