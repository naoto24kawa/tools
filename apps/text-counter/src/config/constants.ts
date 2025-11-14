import type { CountSettings } from '@types';

/**
 * デフォルトのカウント設定
 */
export const DEFAULT_COUNT_SETTINGS: CountSettings = {
  includeSpaces: true,
  includeLineBreaks: true,
  includeSymbols: true,
  language: 'auto',
};

/**
 * 読了速度（文字/分）
 */
export const READING_SPEED = {
  /** 日本語の読了速度（文字/分） */
  ja: 500,
  /** 英語の読了速度（単語/分） */
  en: 225,
} as const;

/**
 * ローカルストレージのキー
 */
export const STORAGE_KEYS = {
  /** テキストの保存キー */
  TEXT: 'text-counter-text',
  /** 設定の保存キー */
  SETTINGS: 'text-counter-settings',
} as const;

/**
 * 言語選択オプション
 */
export const LANGUAGE_OPTIONS = [
  { value: 'auto', label: '自動検出' },
  { value: 'ja', label: '日本語' },
  { value: 'en', label: '英語' },
] as const;
