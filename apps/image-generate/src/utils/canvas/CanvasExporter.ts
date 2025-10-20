import { CANVAS_CONSTANTS } from '@config/canvas';

/**
 * エクスポート形式
 */
export type ExportFormat = 'png' | 'jpeg';

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
}

/**
 * Canvas のエクスポート（ダウンロード、データURL変換）を担当するクラス
 */
export class CanvasExporter {
  /**
   * Canvas を画像ファイルとしてダウンロード
   */
  download(canvas: HTMLCanvasElement, options: ExportOptions): void {
    const { mimeType, qualityValue } = this.getExportParams(options.format, options.quality);

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
