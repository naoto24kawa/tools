import type { TextAlignment, TextVerticalAlignment } from '@types';
import { CANVAS_CONSTANTS } from '@config/canvas';

/**
 * テキスト描画の設定
 */
export interface TextRenderOptions {
  /** テキスト内容 */
  text: string;
  /** テキスト色 */
  color: string;
  /** フォントサイズ */
  fontSize: number;
  /** 水平配置 */
  alignment: TextAlignment;
  /** 垂直配置 */
  verticalAlignment: TextVerticalAlignment;
  /** Canvas の幅 */
  canvasWidth: number;
  /** Canvas の高さ */
  canvasHeight: number;
}

/**
 * テキストの描画を担当するクラス
 */
export class TextRenderer {
  /**
   * テキストを描画する
   */
  drawText(ctx: CanvasRenderingContext2D, options: TextRenderOptions): void {
    if (!options.text) return;

    ctx.fillStyle = options.color;
    ctx.font = `${options.fontSize}px sans-serif`;

    const lines = options.text.split('\n');
    const lineHeight = options.fontSize * CANVAS_CONSTANTS.LINE_HEIGHT_RATIO;
    const startY = this.calculateVerticalStartPosition(
      options.canvasHeight,
      options.fontSize,
      lines.length,
      lineHeight,
      options.verticalAlignment
    );

    lines.forEach((line, index) => {
      const y = startY + lineHeight * index;
      const x = this.calculateHorizontalPosition(ctx, options.canvasWidth, options.alignment);

      ctx.fillText(line, x, y);
    });
  }

  /**
   * 垂直方向の開始位置を計算
   */
  private calculateVerticalStartPosition(
    canvasHeight: number,
    fontSize: number,
    lineCount: number,
    lineHeight: number,
    verticalAlignment: TextVerticalAlignment
  ): number {
    switch (verticalAlignment) {
      case 'top':
        return fontSize;
      case 'bottom':
        return canvasHeight - lineHeight * (lineCount - 1) - fontSize / 2;
      case 'middle':
        return (canvasHeight - lineHeight * (lineCount - 1)) / 2 + fontSize / 2;
    }
  }

  /**
   * 水平方向の位置を計算
   */
  private calculateHorizontalPosition(
    ctx: CanvasRenderingContext2D,
    canvasWidth: number,
    alignment: TextAlignment
  ): number {
    switch (alignment) {
      case 'left':
        ctx.textAlign = 'left';
        return CANVAS_CONSTANTS.TEXT_HORIZONTAL_MARGIN;
      case 'right':
        ctx.textAlign = 'right';
        return canvasWidth - CANVAS_CONSTANTS.TEXT_HORIZONTAL_MARGIN;
      case 'center':
        ctx.textAlign = 'center';
        return canvasWidth / 2;
    }
  }
}
