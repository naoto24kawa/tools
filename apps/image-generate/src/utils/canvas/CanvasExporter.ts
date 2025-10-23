import { CANVAS_CONSTANTS } from '@config/canvas';

/**
 * エクスポート形式
 */
export type ExportFormat = 'png' | 'jpeg';

/**
 * ファイルサイズ制御モード
 */
export type FileSizeMode = 'none' | 'minimum' | 'maximum';

/**
 * エクスポートオプション
 */
export interface ExportOptions {
  /** ファイル名（拡張子なし） */
  filename: string;
  /** フォーマット */
  format: ExportFormat;
  /** JPEG品質（1-100） */
  quality: number;
  /** ファイルサイズ制御モード */
  fileSizeMode: FileSizeMode;
  /** ターゲットファイルサイズ（KB） */
  targetFileSize: number;
}

/**
 * Canvas のエクスポート（ダウンロード、データURL変換）を担当するクラス
 */
export class CanvasExporter {
  /**
   * Canvas を画像ファイルとしてダウンロード
   */
  async download(canvas: HTMLCanvasElement, options: ExportOptions): Promise<void> {
    // ファイルサイズ制御が必要な場合はJPEG品質を自動調整
    let finalQuality = options.quality;

    if (options.fileSizeMode !== 'none' && options.format === 'jpeg') {
      const optimalQuality = await this.findOptimalQuality(
        canvas,
        options.targetFileSize,
        options.fileSizeMode
      );
      if (optimalQuality !== null) {
        finalQuality = optimalQuality;
        console.log(`ファイルサイズ制御: 品質を ${optimalQuality} に調整しました`);
      } else {
        console.warn('ファイルサイズ制御: 最適な品質が見つかりませんでした');
      }
    }

    const { mimeType, qualityValue } = this.getExportParams(options.format, finalQuality);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          console.error('Failed to generate blob');
          return;
        }

        this.triggerDownload(blob, options.filename, options.format);
      },
      mimeType,
      qualityValue
    );
  }

  /**
   * Canvas をデータURL として取得
   */
  toDataURL(canvas: HTMLCanvasElement, format: ExportFormat, quality: number): string {
    const { mimeType, qualityValue } = this.getExportParams(format, quality);
    return canvas.toDataURL(mimeType, qualityValue);
  }

  /**
   * エクスポートパラメータを取得
   */
  private getExportParams(
    format: ExportFormat,
    quality: number
  ): { mimeType: string; qualityValue: number | undefined } {
    const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
    const qualityValue = format === 'jpeg' ? quality / 100 : undefined;
    return { mimeType, qualityValue };
  }

  /**
   * 最適なJPEG品質を二分探索で見つける
   */
  private async findOptimalQuality(
    canvas: HTMLCanvasElement,
    targetSizeKB: number,
    mode: FileSizeMode
  ): Promise<number | null> {
    const targetSizeBytes = targetSizeKB * 1024;
    const maxIterations = 10;
    let low = 1;
    let high = 100;
    let bestQuality: number | null = null;
    let bestDiff = Infinity;

    for (let i = 0; i < maxIterations; i++) {
      const mid = Math.floor((low + high) / 2);
      const size = await this.getFileSize(canvas, mid);

      if (size === null) {
        return null;
      }

      const diff = Math.abs(size - targetSizeBytes);

      // 条件を満たす場合のみbestQualityを更新
      const meetsCondition =
        mode === 'minimum' ? size >= targetSizeBytes : size <= targetSizeBytes;

      if (meetsCondition && diff < bestDiff) {
        bestQuality = mid;
        bestDiff = diff;
      }

      // 二分探索の更新
      if (size < targetSizeBytes) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }

      // 探索範囲が狭まったら終了
      if (low > high) {
        break;
      }
    }

    return bestQuality;
  }

  /**
   * 指定した品質でのファイルサイズを取得
   */
  private async getFileSize(canvas: HTMLCanvasElement, quality: number): Promise<number | null> {
    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(null);
            return;
          }
          resolve(blob.size);
        },
        'image/jpeg',
        quality / 100
      );
    });
  }

  /**
   * ダウンロードをトリガー
   */
  private triggerDownload(blob: Blob, filename: string, format: ExportFormat): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${filename}.${format}`;
    link.href = url;
    link.click();

    // メモリリーク防止
    setTimeout(() => URL.revokeObjectURL(url), CANVAS_CONSTANTS.URL_REVOKE_DELAY);
  }
}
