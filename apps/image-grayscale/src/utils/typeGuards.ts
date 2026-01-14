/**
 * 型ガードユーティリティ
 *
 * 型アサーションを安全な型ガードに置き換えるためのユーティリティ関数
 */

/**
 * 画像フォーマットの型ガード
 */
export function isImageFormat(value: string): value is 'jpeg' | 'png' | 'webp' {
  return ['jpeg', 'png', 'webp'].includes(value);
}

/**
 * 単位の型ガード
 */
export function isCropUnit(value: string): value is 'px' | '%' {
  return value === 'px' || value === '%';
}

/**
 * 型安全なselect変更ハンドラーを生成するファクトリ関数
 *
 * @param allowedValues - 許可される値のリスト
 * @param callback - 値変更時のコールバック
 * @returns 型安全な変更ハンドラー
 *
 * @example
 * ```typescript
 * const IMAGE_FORMATS = ['jpeg', 'png', 'webp'] as const;
 *
 * const handleFormatChange = createTypeSafeSelectHandler(
 *   IMAGE_FORMATS,
 *   (format) => setFormat(format) // format は 'jpeg' | 'png' | 'webp'
 * );
 *
 * <Select value={format} onValueChange={handleFormatChange}>
 *   ...
 * </Select>
 * ```
 */
export function createTypeSafeSelectHandler<T extends string>(
  allowedValues: readonly T[],
  callback: (value: T) => void
): (value: string) => void {
  return (value: string) => {
    // ランタイムバリデーション
    if (!allowedValues.includes(value as T)) {
      console.error(
        `Invalid select value: "${value}". Expected one of: ${allowedValues.join(', ')}`
      );
      return;
    }

    // 型アサーションは検証済みのため安全
    callback(value as T);
  };
}
