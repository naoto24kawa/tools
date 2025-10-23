import type { ExportSettings } from '@types';

/**
 * Canvasから画像をエクスポート
 *
 * Canvas APIのtoBlobメソッドを使用してBlobオブジェクトを生成します。
 *
 * @param canvas - エクスポート元のCanvasオブジェクト
 * @param settings - エクスポート設定（フォーマット・品質）
 * @returns エクスポートされた画像のBlobオブジェクト
 * @throws エクスポートに失敗した場合（Blobの生成失敗）
 */
export async function exportCanvasAsImage(
  canvas: HTMLCanvasElement,
  settings: ExportSettings
): Promise<Blob> {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(
            new Error(
              '画像のエクスポートに失敗しました。フォーマットまたは品質設定を確認してください。'
            )
          );
        }
      },
      `image/${settings.format}`,
      settings.quality
    );
  });
}

/**
 * Blobを画像ファイルとしてダウンロード
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * ファイル名パターンを実際のファイル名に変換
 */
export function generateFilename(
  pattern: string,
  originalFilename: string,
  width: number,
  height: number,
  format: string
): string {
  const nameWithoutExt = originalFilename.replace(/\.[^.]+$/, '');

  let filename = pattern
    .replace(/\{name\}/g, nameWithoutExt)
    .replace(/\{width\}/g, width.toString())
    .replace(/\{height\}/g, height.toString());

  if (!filename.endsWith(`.${format}`)) {
    filename += `.${format}`;
  }

  return filename;
}

/**
 * 画像をリサイズしてエクスポート
 *
 * Canvas APIを使用して画像を指定サイズにリサイズし、Blobとして出力します。
 * 高品質なリサイズのため、imageSmoothingQualityを'high'に設定しています。
 *
 * 処理フロー:
 * 1. Canvas要素を作成し、目標サイズに設定
 * 2. 2Dコンテキストを取得
 * 3. 画像を読み込み
 * 4. 高品質スムージングを有効化
 * 5. Canvasに画像を描画（自動的にリサイズ）
 * 6. 指定フォーマット・品質でBlobに変換
 *
 * @param imageSrc - リサイズする画像のソース（Data URL）
 * @param targetWidth - 目標幅（ピクセル）
 * @param targetHeight - 目標高さ（ピクセル）
 * @param settings - エクスポート設定（フォーマット・品質）
 * @returns リサイズされた画像のBlobオブジェクト
 * @throws Canvas APIが利用できない場合、または画像の読み込みに失敗した場合
 */
export async function resizeAndExport(
  imageSrc: string,
  targetWidth: number,
  targetHeight: number,
  settings: ExportSettings
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error(
      'Canvas APIが利用できません。お使いのブラウザがCanvas APIをサポートしているか確認してください。'
    );
  }

  const img = new Image();
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = () =>
      reject(
        new Error('画像の読み込みに失敗しました。画像データが破損していないか確認してください。')
      );
    img.src = imageSrc;
  });

  // 高品質なリサイズのための設定
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  return exportCanvasAsImage(canvas, settings);
}

/**
 * ファイルサイズをフォーマット
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
}
