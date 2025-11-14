/**
 * 重複行削除設定の型定義
 */
export interface DeduplicateSettings {
  /** 大文字小文字を区別する */
  caseSensitive: boolean;
  /** 先頭・末尾の空白を無視する */
  trimWhitespace: boolean;
  /** 空行を保持する */
  keepEmptyLines: boolean;
}

