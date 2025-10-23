import type { ResizeSettings, ResizeResult, ExportSettings } from '@types';
import { resizeAndExport } from './exportImage';

/**
 * 画像を指定されたサイズにリサイズする
 */
export async function resizeImage(
  imageSrc: string,
  settings: ResizeSettings,
  originalWidth: number,
  originalHeight: number,
  format: 'png' | 'jpeg' | 'webp' = 'png',
  quality: number = 0.92
): Promise<ResizeResult> {
  // 目標サイズを計算
  const targetSize = calculateTargetSize(settings, originalWidth, originalHeight);

  // 共通のCanvas処理関数を使用してリサイズ
  const exportSettings: ExportSettings = {
    format,
    quality,
    filenamePattern: '{name}_{width}x{height}',
  };
  const blob = await resizeAndExport(imageSrc, targetSize.width, targetSize.height, exportSettings);

  return {
    blob,
    width: targetSize.width,
    height: targetSize.height,
    fileSize: blob.size,
  };
}

/**
 * ファイルサイズ指定でリサイズ（二分探索）
 *
 * アルゴリズム:
 * 1. スケール範囲を0.1～1.0で初期化
 * 2. 二分探索で最適なスケールを探索（最大10回）
 * 3. 各反復で中間スケールの画像を生成し、ファイルサイズを測定
 * 4. 目標サイズとの差が5%以内なら探索終了
 * 5. それ以外の場合、サイズが大きければスケールを下げ、小さければ上げる
 * 6. 最も目標に近い結果を返す
 */
export async function resizeByFileSize(
  imageSrc: string,
  targetFileSize: number,
  originalWidth: number,
  originalHeight: number,
  format: 'png' | 'jpeg' | 'webp',
  quality: number
): Promise<ResizeResult> {
  let left = 0.1;
  let right = 1.0;
  let bestResult: ResizeResult | null = null;
  const maxIterations = 10;
  const exportSettings: ExportSettings = {
    format,
    quality,
    filenamePattern: '{name}_{width}x{height}',
  };

  for (let i = 0; i < maxIterations; i++) {
    const scale = (left + right) / 2;
    const width = Math.round(originalWidth * scale);
    const height = Math.round(originalHeight * scale);

    // 共通のCanvas処理関数を使用
    const blob = await resizeAndExport(imageSrc, width, height, exportSettings);

    const result: ResizeResult = {
      blob,
      width,
      height,
      fileSize: blob.size,
    };

    // 目標サイズに最も近い結果を保存
    if (
      !bestResult ||
      Math.abs(blob.size - targetFileSize) < Math.abs(bestResult.fileSize - targetFileSize)
    ) {
      bestResult = result;
    }

    // 目標サイズに十分近い場合は終了（許容誤差5%）
    if (Math.abs(blob.size - targetFileSize) < targetFileSize * 0.05) {
      break;
    }

    // 二分探索を続ける
    if (blob.size > targetFileSize) {
      right = scale;
    } else {
      left = scale;
    }
  }

  if (!bestResult) {
    throw new Error('ファイルサイズの最適化に失敗しました。目標サイズを確認してください。');
  }

  return bestResult;
}

/**
 * 目標サイズを計算
 *
 * 各リサイズ方法の動作:
 *
 * 1. パーセント指定:
 *    - 元のサイズにスケールを適用
 *    - 例: 100% = 元のサイズ、50% = 半分、200% = 2倍
 *
 * 2. ピクセル指定（アスペクト比維持）:
 *    - 幅のみ指定: 幅を基準に高さを計算
 *    - 高さのみ指定: 高さを基準に幅を計算
 *    - 両方指定: 指定された範囲内に収まる最大サイズを計算
 *
 * 3. ピクセル指定（アスペクト比維持なし）:
 *    - 指定された幅と高さに直接リサイズ
 *
 * 4. ファイルサイズ指定:
 *    - 初期推定値を計算（実際の最適化はresizeByFileSizeで実行）
 *    - 推定式: √(目標サイズ / (幅 × 高さ × 3))
 *      ※ 3はRGBチャンネル数の近似値
 */
function calculateTargetSize(
  settings: ResizeSettings,
  originalWidth: number,
  originalHeight: number
): { width: number; height: number } {
  switch (settings.method) {
    case 'percent': {
      const scale = settings.percent / 100;
      return {
        width: Math.round(originalWidth * scale),
        height: Math.round(originalHeight * scale),
      };
    }

    case 'pixel': {
      if (settings.maintainAspectRatio) {
        // アスペクト比を維持する場合
        const aspectRatio = originalWidth / originalHeight;

        // 幅が指定されている場合
        if (settings.width > 0 && settings.height === 0) {
          return {
            width: settings.width,
            height: Math.round(settings.width / aspectRatio),
          };
        }

        // 高さが指定されている場合
        if (settings.height > 0 && settings.width === 0) {
          return {
            width: Math.round(settings.height * aspectRatio),
            height: settings.height,
          };
        }

        // 両方指定されている場合は、小さい方に合わせる（はみ出さないようにフィット）
        const widthRatio = settings.width / originalWidth;
        const heightRatio = settings.height / originalHeight;
        const scale = Math.min(widthRatio, heightRatio);

        return {
          width: Math.round(originalWidth * scale),
          height: Math.round(originalHeight * scale),
        };
      } else {
        // アスペクト比を維持しない場合（自由変形）
        return {
          width: settings.width || originalWidth,
          height: settings.height || originalHeight,
        };
      }
    }

    case 'filesize': {
      // ファイルサイズ指定の場合は、初期推定値を返す
      // 実際のリサイズはresizeByFileSizeで行う
      const estimatedScale = Math.sqrt(
        settings.targetFileSize / (originalWidth * originalHeight * 3)
      );
      return {
        width: Math.round(originalWidth * estimatedScale),
        height: Math.round(originalHeight * estimatedScale),
      };
    }
  }
}
