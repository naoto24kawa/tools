import type { DeduplicateSettings } from '@types';

/**
 * テキストから重複行を削除する
 */
export function deduplicateLines(text: string, settings: DeduplicateSettings): string {
  if (!text) return '';

  const lines = text.split('\n');
  const seen = new Set<string>();
  const result: string[] = [];

  for (const line of lines) {
    let processedLine = line;

    // 空白をトリムする場合
    if (settings.trimWhitespace) {
      processedLine = processedLine.trim();
    }

    // 空行の処理
    if (processedLine === '') {
      if (settings.keepEmptyLines) {
        result.push(line); // 元の行を保持（改行の保持）
      }
      continue;
    }

    // 大文字小文字を区別しない場合
    const key = settings.caseSensitive ? processedLine : processedLine.toLowerCase();

    // 重複チェック
    if (!seen.has(key)) {
      seen.add(key);
      result.push(line); // 元の行を保持
    }
  }

  return result.join('\n');
}

/**
 * 削除された行数を計算
 */
export function getRemovedLineCount(originalText: string, deduplicatedText: string): number {
  const originalLines = originalText.split('\n').length;
  const deduplicatedLines = deduplicatedText.split('\n').length;
  return originalLines - deduplicatedLines;
}

