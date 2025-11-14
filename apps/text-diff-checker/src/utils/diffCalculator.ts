import { diffLines } from 'diff';
import type { Change, DiffResult, DiffStatistics, IgnoreOptions } from '@types';
import { preprocessText } from './textPreprocessor';

/**
 * 2つのテキストの差分を計算
 */
export function calculateDiff(
  originalText: string,
  modifiedText: string,
  options: IgnoreOptions
): DiffResult {
  try {
    // テキストの前処理
    const processedOriginal = preprocessText(originalText, options);
    const processedModified = preprocessText(modifiedText, options);

    // 差分計算
    const diffResult = diffLines(processedOriginal, processedModified);

    // 変更を Change 型に変換
    const changes: Change[] = [];
    let lineNumber = 1;
    let originalLineNumber = 1;
    let modifiedLineNumber = 1;

    diffResult.forEach((part) => {
      const lines = part.value.split('\n');
      // 最後の空行を除外
      if (lines[lines.length - 1] === '') {
        lines.pop();
      }

      lines.forEach((line) => {
        if (part.added) {
          changes.push({
            type: 'added',
            content: line,
            lineNumber: lineNumber++,
            modifiedLineNumber: modifiedLineNumber++,
          });
        } else if (part.removed) {
          changes.push({
            type: 'removed',
            content: line,
            lineNumber: lineNumber++,
            originalLineNumber: originalLineNumber++,
          });
        } else {
          changes.push({
            type: 'unchanged',
            content: line,
            lineNumber: lineNumber++,
            originalLineNumber: originalLineNumber++,
            modifiedLineNumber: modifiedLineNumber++,
          });
        }
      });
    });

    // 統計計算
    const statistics = calculateStatistics(changes, originalText, modifiedText);

    // Split view用に分離
    const originalLines = changes.filter((c) => c.type !== 'added');
    const modifiedLines = changes.filter((c) => c.type !== 'removed');

    return {
      changes,
      originalLines,
      modifiedLines,
      statistics,
    };
  } catch (error) {
    console.error('Diff calculation error:', error);
    throw new Error('差分の計算に失敗しました');
  }
}

/**
 * 統計情報を計算
 */
function calculateStatistics(
  changes: Change[],
  originalText: string,
  modifiedText: string
): DiffStatistics {
  const linesAdded = changes.filter((c) => c.type === 'added').length;
  const linesRemoved = changes.filter((c) => c.type === 'removed').length;
  const linesUnchanged = changes.filter((c) => c.type === 'unchanged').length;

  return {
    linesAdded,
    linesRemoved,
    linesUnchanged,
    originalCharCount: originalText.length,
    modifiedCharCount: modifiedText.length,
  };
}
