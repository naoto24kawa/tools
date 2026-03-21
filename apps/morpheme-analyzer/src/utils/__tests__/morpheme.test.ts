import { describe, expect, test, beforeAll } from 'vitest';
import path from 'node:path';
import { initTokenizer, analyze } from '../morpheme';

beforeAll(async () => {
  // In test env, use the kuromoji dict from node_modules (pnpm store)
  const dictPath = path.resolve(process.cwd(), 'node_modules/kuromoji/dict/');
  await initTokenizer(undefined, dictPath + '/');
}, 30000);

describe('morpheme (kuromoji)', () => {
  test('basic tokenization', () => {
    const tokens = analyze('東京は日本の首都です');
    expect(tokens.length).toBeGreaterThan(0);
    expect(tokens[0].surface).toBe('東京');
    expect(tokens[0].pos).toBe('名詞');
  });

  test('reading', () => {
    const tokens = analyze('漢字');
    expect(tokens[0].reading).toBe('カンジ');
  });

  test('empty string', () => {
    const tokens = analyze('');
    expect(tokens).toHaveLength(0);
  });

  test('returns baseForm', () => {
    const tokens = analyze('食べた');
    const verb = tokens.find((t) => t.pos === '動詞');
    expect(verb).toBeDefined();
    expect(verb!.baseForm).toBe('食べる');
  });

  test('pos_detail is populated', () => {
    const tokens = analyze('美しい花');
    const adj = tokens.find((t) => t.pos === '形容詞');
    expect(adj).toBeDefined();
    expect(adj!.pos_detail).toBeTruthy();
  });
});
