export function railFenceEncrypt(text: string, rails: number): string {
  if (rails <= 1 || text.length === 0) return text;
  const fence: string[][] = Array.from({ length: rails }, () => []);
  let rail = 0;
  let direction = 1;
  for (const char of text) {
    fence[rail].push(char);
    if (rail === 0) direction = 1;
    if (rail === rails - 1) direction = -1;
    rail += direction;
  }
  return fence.flat().join('');
}

export function railFenceDecrypt(text: string, rails: number): string {
  if (rails <= 1 || text.length === 0) return text;
  const n = text.length;
  const fence: (string | null)[][] = Array.from({ length: rails }, () => Array(n).fill(null));

  let rail = 0;
  let direction = 1;
  for (let i = 0; i < n; i++) {
    fence[rail][i] = '';
    if (rail === 0) direction = 1;
    if (rail === rails - 1) direction = -1;
    rail += direction;
  }

  let idx = 0;
  for (let r = 0; r < rails; r++) {
    for (let c = 0; c < n; c++) {
      if (fence[r][c] !== null) {
        fence[r][c] = text[idx++];
      }
    }
  }

  let result = '';
  rail = 0;
  direction = 1;
  for (let i = 0; i < n; i++) {
    result += fence[rail][i];
    if (rail === 0) direction = 1;
    if (rail === rails - 1) direction = -1;
    rail += direction;
  }
  return result;
}
