/**
 * テキスト統計情報の型定義
 */
export interface TextStats {
  /** 文字数（スペース含む） */
  charsWithSpaces: number;
  /** 文字数（スペース除外） */
  charsWithoutSpaces: number;
  /** 単語数 */
  words: number;
  /** 行数 */
  lines: number;
  /** 段落数 */
  paragraphs: number;
  /** バイト数（UTF-8） */
  bytes: number;
  /** 読了時間（分） */
  readingTimeMinutes: number;
}

/**
 * カウント設定の型定義
 */
export interface CountSettings {
  /** スペースを含む */
  includeSpaces: boolean;
  /** 改行を含む */
  includeLineBreaks: boolean;
  /** 記号を含む */
  includeSymbols: boolean;
  /** 言語設定 */
  language: 'ja' | 'en' | 'auto';
}

/**
 * 言語検出結果の型定義
 */
export type Language = 'ja' | 'en' | 'unknown';
