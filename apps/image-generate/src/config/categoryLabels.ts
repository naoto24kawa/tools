import type { SizePreset, ColorPreset } from '@types';

/**
 * サイズプリセットのカテゴリー表示名マッピング
 */
export const SIZE_CATEGORY_LABELS: Record<SizePreset['category'], string> = {
  mobile: 'モバイル',
  tablet: 'タブレット',
  desktop: 'デスクトップ',
  sns: 'SNS',
  custom: 'カスタム',
} as const;

/**
 * カラープリセットのカテゴリー表示名マッピング
 */
export const COLOR_CATEGORY_LABELS: Record<ColorPreset['category'], string> = {
  basic: '基本色',
  gray: 'グレースケール',
  primary: 'プライマリカラー',
} as const;

/**
 * サイズカテゴリーの表示名を取得
 */
export function getSizeCategoryLabel(category: SizePreset['category']): string {
  return SIZE_CATEGORY_LABELS[category];
}

/**
 * カラーカテゴリーの表示名を取得
 */
export function getColorCategoryLabel(category: ColorPreset['category']): string {
  return COLOR_CATEGORY_LABELS[category];
}
