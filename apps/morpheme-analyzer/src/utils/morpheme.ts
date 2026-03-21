import kuromoji from 'kuromoji';

export interface MorphemeToken {
  surface: string;
  pos: string;
  pos_detail: string;
  reading: string;
  baseForm: string;
}

let tokenizer: kuromoji.Tokenizer<kuromoji.IpadicFeatures> | null = null;

export async function initTokenizer(
  onProgress?: (message: string) => void,
  dictPath: string = './dict/',
): Promise<void> {
  return new Promise((resolve, reject) => {
    onProgress?.('辞書データを読み込み中...');
    kuromoji.builder({ dicPath: dictPath }).build((err, t) => {
      if (err) {
        reject(err);
        return;
      }
      tokenizer = t;
      resolve();
    });
  });
}

export function isTokenizerReady(): boolean {
  return tokenizer !== null;
}

export function analyze(text: string): MorphemeToken[] {
  if (!tokenizer) throw new Error('Tokenizer not initialized');
  if (!text) return [];
  const tokens = tokenizer.tokenize(text);
  return tokens.map((t) => ({
    surface: t.surface_form,
    pos: t.pos,
    pos_detail: t.pos_detail_1,
    reading: t.reading || '',
    baseForm: t.basic_form,
  }));
}

export const POS_COLORS: Record<string, string> = {
  '名詞': '#3b82f6',
  '動詞': '#ef4444',
  '形容詞': '#10b981',
  '副詞': '#8b5cf6',
  '助詞': '#6b7280',
  '助動詞': '#f59e0b',
  '接続詞': '#ec4899',
  '感動詞': '#14b8a6',
  '連体詞': '#a855f7',
  '記号': '#d1d5db',
  'フィラー': '#78716c',
};

export const POS_LIST = Object.keys(POS_COLORS);

export function getPosColor(pos: string): string {
  return POS_COLORS[pos] || '#9ca3af';
}

export function getStats(tokens: MorphemeToken[]): Record<string, number> {
  const stats: Record<string, number> = {};
  for (const token of tokens) {
    stats[token.pos] = (stats[token.pos] || 0) + 1;
  }
  return stats;
}
