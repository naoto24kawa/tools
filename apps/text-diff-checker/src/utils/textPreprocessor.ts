import type { IgnoreOptions } from '@types';

/**
 * テキストを前処理する
 * 無視オプションに応じて空白や空行を処理
 */
export function preprocessText(text: string, options: IgnoreOptions): string {
  let processed = text;

  // 空行を無視
  if (options.ignoreEmptyLines) {
    processed = processed
      .split('\n')
      .filter((line) => line.trim().length > 0)
      .join('\n');
  }

  // 全空白を無視
  if (options.ignoreAllWhitespace) {
    processed = processed
      .split('\n')
      .map((line) => line.replace(/\s+/g, ''))
      .join('\n');
  }
  // 先頭・末尾の空白を無視
  else if (options.ignoreWhitespace) {
    processed = processed
      .split('\n')
      .map((line) => line.trim())
      .join('\n');
  }

  return processed;
}
