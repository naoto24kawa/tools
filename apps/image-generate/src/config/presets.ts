import type { AspectRatioOption, SizePreset, ColorPreset } from '@types';

// アスペクト比のプリセット
export const ASPECT_RATIOS: AspectRatioOption[] = [
  { label: 'フリー', value: null },
  { label: '1:1', value: 1 },
  { label: '4:3', value: 4 / 3 },
  { label: '3:2', value: 3 / 2 },
  { label: '16:9', value: 16 / 9 },
  { label: '21:9', value: 21 / 9 },
];

// サイズプリセット
export const SIZE_PRESETS: SizePreset[] = [
  // モバイル
  { label: 'iPhone SE (375x667)', width: 375, height: 667, category: 'mobile' },
  { label: 'iPhone 14 Pro (393x852)', width: 393, height: 852, category: 'mobile' },
  { label: 'iPhone 14 Pro Max (430x932)', width: 430, height: 932, category: 'mobile' },

  // タブレット
  { label: 'iPad Mini (768x1024)', width: 768, height: 1024, category: 'tablet' },
  { label: 'iPad Pro 11" (834x1194)', width: 834, height: 1194, category: 'tablet' },
  { label: 'iPad Pro 12.9" (1024x1366)', width: 1024, height: 1366, category: 'tablet' },

  // デスクトップ
  { label: 'HD (1280x720)', width: 1280, height: 720, category: 'desktop' },
  { label: 'Full HD (1920x1080)', width: 1920, height: 1080, category: 'desktop' },
  { label: 'WQHD (2560x1440)', width: 2560, height: 1440, category: 'desktop' },
  { label: '4K (3840x2160)', width: 3840, height: 2160, category: 'desktop' },

  // SNS
  { label: 'Twitter投稿 (1200x675)', width: 1200, height: 675, category: 'sns' },
  { label: 'Twitter ヘッダー (1500x500)', width: 1500, height: 500, category: 'sns' },
  { label: 'Instagram 正方形 (1080x1080)', width: 1080, height: 1080, category: 'sns' },
  { label: 'Instagram ストーリー (1080x1920)', width: 1080, height: 1920, category: 'sns' },
  { label: 'Facebook カバー (820x312)', width: 820, height: 312, category: 'sns' },
  { label: 'YouTube サムネイル (1280x720)', width: 1280, height: 720, category: 'sns' },
];

// カラープリセット
export const COLOR_PRESETS: ColorPreset[] = [
  // 基本色
  { label: '白', value: '#FFFFFF', category: 'basic' },
  { label: '黒', value: '#000000', category: 'basic' },
  { label: '赤', value: '#FF0000', category: 'basic' },
  { label: '緑', value: '#00FF00', category: 'basic' },
  { label: '青', value: '#0000FF', category: 'basic' },
  { label: '黄', value: '#FFFF00', category: 'basic' },

  // グレースケール
  { label: 'グレー10', value: '#1A1A1A', category: 'gray' },
  { label: 'グレー20', value: '#333333', category: 'gray' },
  { label: 'グレー30', value: '#4D4D4D', category: 'gray' },
  { label: 'グレー40', value: '#666666', category: 'gray' },
  { label: 'グレー50', value: '#808080', category: 'gray' },
  { label: 'グレー60', value: '#999999', category: 'gray' },
  { label: 'グレー70', value: '#B3B3B3', category: 'gray' },
  { label: 'グレー80', value: '#CCCCCC', category: 'gray' },
  { label: 'グレー90', value: '#E6E6E6', category: 'gray' },
  { label: 'グレー95', value: '#F2F2F2', category: 'gray' },

  // プライマリカラー
  { label: 'オレンジ', value: '#FF6600', category: 'primary' },
  { label: 'ピンク', value: '#FF69B4', category: 'primary' },
  { label: 'パープル', value: '#9370DB', category: 'primary' },
  { label: 'インディゴ', value: '#4B0082', category: 'primary' },
  { label: 'シアン', value: '#00CED1', category: 'primary' },
  { label: 'ティール', value: '#008080', category: 'primary' },
  { label: 'ライム', value: '#32CD32', category: 'primary' },
  { label: 'アンバー', value: '#FFC107', category: 'primary' },
];

// デフォルト設定
export const DEFAULT_SETTINGS = {
  width: 1920,
  height: 1080,
  aspectRatio: 16 / 9,
  backgroundColor: '#F2F2F2',
  pattern: 'none' as const,
  text: 'Sample Text',
  textColor: '#333333',
  fontSize: 48,
  textAlignment: 'center' as const,
  textVerticalAlignment: 'middle' as const,
  format: 'png' as const,
  quality: 90,
  fileSizeMode: 'none' as const,
  targetFileSize: 100,
  filename: 'generated-image',
};
