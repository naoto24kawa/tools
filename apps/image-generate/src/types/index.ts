/**
 * アスペクト比のオプション
 */
export interface AspectRatioOption {
  /** 表示ラベル（例: "16:9", "Free"） */
  label: string;
  /** アスペクト比の値。nullはフリー（アスペクト比固定なし） */
  value: number | null;
}

/**
 * サイズプリセット
 */
export interface SizePreset {
  /** 表示ラベル（例: "iPhone 14 Pro (393x852)"） */
  label: string;
  /** 幅（ピクセル） */
  width: number;
  /** 高さ（ピクセル） */
  height: number;
  /** カテゴリ */
  category: 'mobile' | 'tablet' | 'desktop' | 'sns' | 'custom';
}

/**
 * カラープリセット
 */
export interface ColorPreset {
  /** 表示ラベル（例: "白", "黒"） */
  label: string;
  /** 16進数カラーコード（例: "#FFFFFF"） */
  value: string;
  /** カテゴリ */
  category: 'basic' | 'gray' | 'primary';
}

/**
 * パターンの種類
 */
export type PatternType =
  /** パターンなし */
  | 'none'
  /** チェッカーボードパターン */
  | 'checkerboard'
  /** グリッドパターン */
  | 'grid';

/**
 * テキストの水平方向の配置
 */
export type TextAlignment =
  /** 左揃え */
  | 'left'
  /** 中央揃え */
  | 'center'
  /** 右揃え */
  | 'right';

/**
 * テキストの垂直方向の配置
 */
export type TextVerticalAlignment =
  /** 上揃え */
  | 'top'
  /** 中央揃え */
  | 'middle'
  /** 下揃え */
  | 'bottom';

/**
 * 画像生成器の設定
 *
 * すべての設定値を保持し、Canvas描画とエクスポートに使用される。
 */
export interface ImageGeneratorSettings {
  // ========================================
  // サイズ設定
  // ========================================

  /**
   * 画像の幅（ピクセル）
   *
   * @minimum 1
   * @maximum 10000
   */
  width: number;

  /**
   * 画像の高さ（ピクセル）
   *
   * @minimum 1
   * @maximum 10000
   */
  height: number;

  /**
   * アスペクト比（width / height の比率）
   *
   * - `null`: フリー（アスペクト比固定なし）
   * - `数値`: 固定アスペクト比（例: 16/9 = 1.777...）
   *
   * この値が設定されている場合、width または height の変更時に
   * もう一方の値が自動的に計算される。
   */
  aspectRatio: number | null;

  // ========================================
  // 背景設定
  // ========================================

  /**
   * 背景色（16進数カラーコード）
   *
   * @example "#FFFFFF"
   * @example "#FF6600"
   */
  backgroundColor: string;

  /**
   * 背景パターンの種類
   */
  pattern: PatternType;

  // ========================================
  // テキスト設定
  // ========================================

  /**
   * 画像上に表示するテキスト
   *
   * 改行（\n）でテキストを複数行に分割できる。
   */
  text: string;

  /**
   * テキストの色（16進数カラーコード）
   *
   * @example "#333333"
   */
  textColor: string;

  /**
   * フォントサイズ（ピクセル）
   *
   * @minimum 1
   * @maximum 500
   */
  fontSize: number;

  /**
   * テキストの水平方向の配置
   */
  textAlignment: TextAlignment;

  /**
   * テキストの垂直方向の配置
   */
  textVerticalAlignment: TextVerticalAlignment;

  // ========================================
  // エクスポート設定
  // ========================================

  /**
   * エクスポート形式
   *
   * - `png`: 可逆圧縮、透過対応
   * - `jpeg`: 非可逆圧縮、ファイルサイズ小
   */
  format: 'png' | 'jpeg';

  /**
   * JPEG品質（1-100）
   *
   * この値は format が 'jpeg' の場合のみ使用される。
   *
   * @minimum 1
   * @maximum 100
   * @default 90
   */
  quality: number;

  /**
   * エクスポート時のファイル名（拡張子なし）
   *
   * @example "generated-image"
   */
  filename: string;
}
