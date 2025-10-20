/**
 * フォーマット処理専用ユーティリティ
 */

/**
 * ファイルサイズを人間が読みやすい形式にフォーマット
 *
 * @param bytes バイト数
 * @returns フォーマットされた文字列
 *
 * @example
 * ```typescript
 * formatFileSize(1024)      // "1.00 KB"
 * formatFileSize(1048576)   // "1.00 MB"
 * formatFileSize(512)       // "512 B"
 * ```
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

/**
 * アスペクト比を簡約形で計算
 *
 * @param width 幅
 * @param height 高さ
 * @returns アスペクト比（例: "16:9"）
 *
 * @example
 * ```typescript
 * calculateAspectRatio(1920, 1080) // "16:9"
 * calculateAspectRatio(1024, 768)  // "4:3"
 * calculateAspectRatio(100, 100)   // "1:1"
 * ```
 *
 * ## アルゴリズム
 * 最大公約数（GCD: Greatest Common Divisor）を使用して、
 * アスペクト比を最も簡潔な整数比に変換します。
 *
 * 例: 1920x1080の場合
 * 1. GCD(1920, 1080) = 120
 * 2. 1920 ÷ 120 = 16, 1080 ÷ 120 = 9
 * 3. 結果: "16:9"
 */
export function calculateAspectRatio(width: number, height: number): string {
  /**
   * ユークリッドの互除法でGCDを計算
   *
   * @param a - 最初の数値
   * @param b - 2番目の数値
   * @returns 最大公約数
   *
   * @see https://ja.wikipedia.org/wiki/ユークリッドの互除法
   */
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

  const divisor = gcd(width, height);
  return `${width / divisor}:${height / divisor}`;
}
