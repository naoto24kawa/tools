/**
 * 数値を3桁区切りでフォーマット
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('ja-JP');
}

/**
 * バイト数を人間が読みやすい形式にフォーマット
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * 読了時間を人間が読みやすい形式にフォーマット
 */
export function formatReadingTime(minutes: number): string {
  if (minutes === 0) return '0分';
  if (minutes < 1) return '1分未満';

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) {
    return `約${mins}分`;
  }

  if (mins === 0) {
    return `約${hours}時間`;
  }

  return `約${hours}時間${mins}分`;
}

/**
 * 統計情報をクリップボード用のテキストにフォーマット
 */
export function formatStatsForClipboard(stats: {
  charsWithSpaces: number;
  charsWithoutSpaces: number;
  words: number;
  lines: number;
  paragraphs: number;
  bytes: number;
  readingTimeMinutes: number;
}): string {
  return `
=== テキスト統計情報 ===

文字数（スペース含む）: ${formatNumber(stats.charsWithSpaces)}
文字数（スペース除外）: ${formatNumber(stats.charsWithoutSpaces)}
単語数: ${formatNumber(stats.words)}
行数: ${formatNumber(stats.lines)}
段落数: ${formatNumber(stats.paragraphs)}
バイト数: ${formatBytes(stats.bytes)}
読了時間: ${formatReadingTime(stats.readingTimeMinutes)}
`.trim();
}
