import type { DeduplicateSettings } from '@types';

/**
 * デフォルトの重複行削除設定
 */
export const DEFAULT_DEDUPLICATE_SETTINGS: DeduplicateSettings = {
  caseSensitive: false,
  trimWhitespace: false,
  keepEmptyLines: true,
};

/**
 * ローカルストレージのキー
 */
export const STORAGE_KEYS = {
  /** テキストの保存キー */
  TEXT: 'text-deduplicate-text',
  /** 設定の保存キー */
  SETTINGS: 'text-deduplicate-settings',
} as const;

