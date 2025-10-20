import type { ImageGeneratorSettings } from '@types';
import { ImageGenerator, CanvasExporter } from './canvas';

/**
 * シングルトンインスタンス
 */
const imageGenerator = new ImageGenerator();
const canvasExporter = new CanvasExporter();

/**
 * Canvas 要素を生成して画像を描画
 *
 * @param settings 画像生成設定
 * @returns 描画された Canvas 要素
 *
 * @example
 * ```tsx
 * const canvas = generateCanvas(settings);
 * ```
 */
export function generateCanvas(settings: ImageGeneratorSettings): HTMLCanvasElement {
  return imageGenerator.generate(settings);
}

/**
 * Canvas を画像ファイルとしてダウンロード
 *
 * @param canvas ダウンロードする Canvas 要素
 * @param filename ファイル名（拡張子なし）
 * @param format エクスポート形式（'png' | 'jpeg'）
 * @param quality JPEG品質（1-100）
 *
 * @example
 * ```tsx
 * downloadCanvas(canvas, 'my-image', 'png', 90);
 * ```
 */
export function downloadCanvas(
  canvas: HTMLCanvasElement,
  filename: string,
  format: 'png' | 'jpeg',
  quality: number
): void {
  canvasExporter.download(canvas, { filename, format, quality });
}

/**
 * Canvas をデータ URL として取得
 *
 * @param canvas 変換する Canvas 要素
 * @param format エクスポート形式（'png' | 'jpeg'）
 * @param quality JPEG品質（1-100）
 * @returns データURL文字列
 *
 * @example
 * ```tsx
 * const dataURL = getCanvasDataURL(canvas, 'jpeg', 85);
 * ```
 */
export function getCanvasDataURL(
  canvas: HTMLCanvasElement,
  format: 'png' | 'jpeg',
  quality: number
): string {
  return canvasExporter.toDataURL(canvas, format, quality);
}
