import type { PixelCrop, ExportSettings } from '@types';
import { getCroppedImg } from '@utils/imageCropper';

/**
 * 画像エクスポート結果
 */
export interface ExportResult {
  success: boolean;
  error?: string;
}

/**
 * 画像エクスポートサービス
 *
 * ## 責務
 * - 画像のクロップ処理
 * - Blobの生成
 * - ファイルのダウンロード
 *
 * ## Single Responsibility Principle
 * このクラスは画像のエクスポート処理のみに責任を持ちます。
 * エラー通知やUI状態管理は呼び出し側が担当します。
 *
 * ## 使用例
 * ```typescript
 * const exporter = new ImageExporter();
 * const result = await exporter.exportImage(
 *   imgElement,
 *   crop,
 *   { format: 'png', quality: 0.95, filename: 'cropped.png' }
 * );
 *
 * if (!result.success) {
 *   console.error(result.error);
 * }
 * ```
 */
export class ImageExporter {
  /**
   * 画像をクロップしてダウンロード
   *
   * @param image クロップ対象の画像要素
   * @param crop クロップ領域（ピクセル単位）
   * @param settings エクスポート設定
   * @returns エクスポート結果
   */
  async exportImage(
    image: HTMLImageElement,
    crop: PixelCrop,
    settings: ExportSettings
  ): Promise<ExportResult> {
    try {
      // 画像をクロップしてBlobを生成
      const blob = await getCroppedImg(image, crop, settings.format, settings.quality);

      if (!blob) {
        return {
          success: false,
          error: '画像の処理に失敗しました',
        };
      }

      // ファイル名の生成
      const filename = this.generateFilename(settings.filename, settings.format);

      // ダウンロード実行
      this.downloadBlob(blob, filename);

      return { success: true };
    } catch (error) {
      console.error('Export failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'エクスポートに失敗しました',
      };
    }
  }

  /**
   * ファイル名を生成
   *
   * @param baseFilename ベースファイル名
   * @param format 画像フォーマット
   * @returns 生成されたファイル名
   */
  private generateFilename(baseFilename: string | undefined, format: string): string {
    if (baseFilename) {
      return baseFilename;
    }
    return `cropped-${Date.now()}.${format}`;
  }

  /**
   * Blobをダウンロード
   *
   * @param blob ダウンロード対象のBlob
   * @param filename ファイル名
   */
  private downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    try {
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
    } finally {
      // メモリリークを防ぐため、URLを解放
      URL.revokeObjectURL(url);
    }
  }

  /**
   * プレビュー画像を生成（将来の拡張用）
   *
   * @param image クロップ対象の画像要素
   * @param crop クロップ領域
   * @param settings エクスポート設定
   * @returns プレビュー用のData URL
   */
  async generatePreview(
    image: HTMLImageElement,
    crop: PixelCrop,
    settings: ExportSettings
  ): Promise<string | null> {
    try {
      const blob = await getCroppedImg(image, crop, settings.format, settings.quality);
      if (!blob) {
        return null;
      }
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Preview generation failed:', error);
      return null;
    }
  }

  /**
   * ファイルサイズを推定（将来の拡張用）
   *
   * @param image クロップ対象の画像要素
   * @param crop クロップ領域
   * @param settings エクスポート設定
   * @returns 推定ファイルサイズ（バイト）
   */
  async estimateFileSize(
    image: HTMLImageElement,
    crop: PixelCrop,
    settings: ExportSettings
  ): Promise<number | null> {
    try {
      const blob = await getCroppedImg(image, crop, settings.format, settings.quality);
      return blob ? blob.size : null;
    } catch (error) {
      console.error('File size estimation failed:', error);
      return null;
    }
  }
}
