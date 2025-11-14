// 差分の種類
export type ChangeType = 'added' | 'removed' | 'unchanged';

// 個別の変更
export interface Change {
  type: ChangeType;
  content: string;
  lineNumber: number;
  originalLineNumber?: number;
  modifiedLineNumber?: number;
}

// 統計情報
export interface DiffStatistics {
  linesAdded: number;
  linesRemoved: number;
  linesUnchanged: number;
  originalCharCount: number;
  modifiedCharCount: number;
}

// 差分計算結果
export interface DiffResult {
  changes: Change[];
  originalLines: Change[];
  modifiedLines: Change[];
  statistics: DiffStatistics;
}

// 表示モード
export type ViewMode = 'unified' | 'split';

// サポートする言語
export type Language =
  | 'plaintext'
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'html'
  | 'css'
  | 'json'
  | 'markdown';

// 無視オプション
export interface IgnoreOptions {
  ignoreWhitespace: boolean;
  ignoreAllWhitespace: boolean;
  ignoreEmptyLines: boolean;
}

// アプリケーション状態
export interface DiffState {
  originalText: string;
  modifiedText: string;
  viewMode: ViewMode;
  language: Language;
  ignoreOptions: IgnoreOptions;
}
