export interface DiffLine {
  type: 'same' | 'added' | 'removed';
  content: string;
  lineA: number | null;
  lineB: number | null;
}

export function computeDiff(textA: string, textB: string): DiffLine[] {
  const linesA = textA.split('\n');
  const linesB = textB.split('\n');
  const result: DiffLine[] = [];

  const m = linesA.length;
  const n = linesB.length;

  // Simple LCS-based diff
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (linesA[i - 1] === linesB[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack
  let i = m;
  let j = n;
  const reversed: DiffLine[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && linesA[i - 1] === linesB[j - 1]) {
      reversed.push({ type: 'same', content: linesA[i - 1], lineA: i, lineB: j });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      reversed.push({ type: 'added', content: linesB[j - 1], lineA: null, lineB: j });
      j--;
    } else {
      reversed.push({ type: 'removed', content: linesA[i - 1], lineA: i, lineB: null });
      i--;
    }
  }

  for (let k = reversed.length - 1; k >= 0; k--) {
    result.push(reversed[k]);
  }

  return result;
}

export function getDiffStats(diff: DiffLine[]): { added: number; removed: number; same: number } {
  return {
    added: diff.filter((d) => d.type === 'added').length,
    removed: diff.filter((d) => d.type === 'removed').length,
    same: diff.filter((d) => d.type === 'same').length,
  };
}
