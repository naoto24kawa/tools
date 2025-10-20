import type { Crop } from '@types';
import { convertPixelToPercentCrop } from './coordinateConverter';

/**
 * Cropフィールドの更新を処理する関数群
 */

/**
 * アスペクト比を考慮してCropを更新
 * @param crop 現在のCrop
 * @param field 更新するフィールド
 * @param value 新しい値
 * @param aspectRatio アスペクト比（オプション）
 * @returns 更新されたCrop
 */
export function updateCropField(
  crop: Crop,
  field: keyof Crop,
  value: number,
  aspectRatio?: number
): Crop {
  const newCrop = { ...crop };

  // アスペクト比が選択されている場合、幅または高さの変更時にもう一方も調整
  if (aspectRatio && (field === 'width' || field === 'height')) {
    if (field === 'width') {
      newCrop.width = value;
      newCrop.height = value / aspectRatio;
    } else {
      newCrop.height = value;
      newCrop.width = value * aspectRatio;
    }
  } else {
    // その他のフィールド更新（x, y, width, heightのみ）
    if (field === 'x' || field === 'y' || field === 'width' || field === 'height') {
      newCrop[field] = value;
    }
  }

  return newCrop;
}

/**
 * Cropの単位を変換
 * @param crop 現在のCrop
 * @param targetUnit 変換先の単位
 * @param imageSize 画像サイズ
 * @returns 変換されたCrop
 */
export function convertCropUnit(
  crop: Crop,
  targetUnit: 'px' | '%',
  imageSize: { width: number; height: number }
): Crop {
  if (crop.unit === targetUnit) return crop;

  if (targetUnit === 'px') {
    // % -> px
    return {
      x: (crop.x / 100) * imageSize.width,
      y: (crop.y / 100) * imageSize.height,
      width: (crop.width / 100) * imageSize.width,
      height: (crop.height / 100) * imageSize.height,
      unit: 'px',
    };
  } else {
    // px -> %
    return convertPixelToPercentCrop(crop, imageSize.width, imageSize.height);
  }
}
