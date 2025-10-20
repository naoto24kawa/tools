import type { PatternType } from '@types';
import { CANVAS_CONSTANTS } from '@config/canvas';

/**
 * 背景とパターンの描画を担当するクラス
 */
export class BackgroundRenderer {
  /**
   * 背景色を塗りつぶす
   */
  fillBackground(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    color: string
  ): void {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
  }

  /**
   * パターンを描画する
   */
  drawPattern(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    pattern: PatternType
  ): void {
    if (pattern === 'none') return;

    switch (pattern) {
      case 'checkerboard':
        this.drawCheckerboard(ctx, width, height);
        break;
      case 'grid':
        this.drawGrid(ctx, width, height);
        break;
    }
  }

  /**
   * チェッカーボードパターンを描画
   */
  private drawCheckerboard(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ): void {
    const squareSize = CANVAS_CONSTANTS.PATTERN_SIZE;
    ctx.fillStyle = `rgba(0, 0, 0, ${CANVAS_CONSTANTS.CHECKERBOARD_ALPHA})`;

    for (let y = 0; y < height; y += squareSize) {
      for (let x = 0; x < width; x += squareSize) {
        if ((x / squareSize + y / squareSize) % 2 === 0) {
          ctx.fillRect(x, y, squareSize, squareSize);
        }
      }
    }
  }

  /**
   * グリッドパターンを描画
   */
  private drawGrid(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const gridSize = CANVAS_CONSTANTS.PATTERN_SIZE;
    ctx.strokeStyle = `rgba(0, 0, 0, ${CANVAS_CONSTANTS.PATTERN_ALPHA})`;
    ctx.lineWidth = 1;

    // 縦線
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // 横線
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }
}
