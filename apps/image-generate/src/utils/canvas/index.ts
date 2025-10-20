/**
 * Canvas 描画とエクスポートのユーティリティ
 *
 * このモジュールは単一責任の原則に従って、以下のクラスに分離されています：
 *
 * - BackgroundRenderer: 背景色とパターンの描画
 * - TextRenderer: テキストの描画
 * - ImageGenerator: Canvas生成のオーケストレーション
 * - CanvasExporter: ファイルダウンロードとデータURL変換
 */

export { BackgroundRenderer } from './BackgroundRenderer';
export { TextRenderer } from './TextRenderer';
export type { TextRenderOptions } from './TextRenderer';
export { ImageGenerator } from './ImageGenerator';
export { CanvasExporter } from './CanvasExporter';
export type { ExportFormat, ExportOptions } from './CanvasExporter';
