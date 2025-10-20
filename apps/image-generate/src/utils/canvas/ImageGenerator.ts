import type { ImageGeneratorSettings } from '@types';
import { BackgroundRenderer } from './BackgroundRenderer';
import { TextRenderer } from './TextRenderer';

/**
 * Canvas を生成して画像を描画するクラス
 *
 * BackgroundRenderer と TextRenderer を組み合わせて、
 * 画像生成の全体フローをオーケストレーションする。
 */
export class ImageGenerator {
  private backgroundRenderer: BackgroundRenderer;
  private textRenderer: TextRenderer;

  constructor() {
    this.backgroundRenderer = new BackgroundRenderer();
    this.textRenderer = new TextRenderer();
  }

  /**
   * 設定に基づいて Canvas を生成する
   */
  generate(settings: ImageGeneratorSettings): HTMLCanvasElement {
    const canvas = this.createCanvas(settings.width, settings.height);
    const ctx = this.getContext(canvas);

    // 背景を描画
    this.backgroundRenderer.fillBackground(
      ctx,
      settings.width,
      settings.height,
      settings.backgroundColor
    );

    // パターンを描画
    this.backgroundRenderer.drawPattern(ctx, settings.width, settings.height, settings.pattern);

    // テキストを描画
    this.textRenderer.drawText(ctx, {
      text: settings.text,
      color: settings.textColor,
      fontSize: settings.fontSize,
      alignment: settings.textAlignment,
      verticalAlignment: settings.textVerticalAlignment,
      canvasWidth: settings.width,
      canvasHeight: settings.height,
    });

    return canvas;
  }

  /**
   * Canvas 要素を作成
   */
  private createCanvas(width: number, height: number): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  /**
   * Canvas の 2D コンテキストを取得
   */
  private getContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas context not available');
    }
    return ctx;
  }
}
