import { WORDLIST } from './bip39Wordlist';

export type WordCount = 12 | 15 | 18 | 21 | 24;
export const WORD_COUNTS: WordCount[] = [12, 15, 18, 21, 24];

export async function generateMnemonic(wordCount: WordCount): Promise<string> {
  const entropyBits = (wordCount / 3) * 32;
  const entropyBytes = entropyBits / 8;

  const entropy = new Uint8Array(entropyBytes);
  crypto.getRandomValues(entropy);

  const hash = await crypto.subtle.digest('SHA-256', entropy);
  const hashArray = new Uint8Array(hash);

  const checksumBits = entropyBits / 32;

  let binary = '';
  for (const byte of entropy) {
    binary += byte.toString(2).padStart(8, '0');
  }
  const checksumBinary = hashArray[0].toString(2).padStart(8, '0');
  binary += checksumBinary.slice(0, checksumBits);

  const totalBits = entropyBits + checksumBits;
  const words: string[] = [];
  for (let i = 0; i < totalBits; i += 11) {
    const index = Number.parseInt(binary.slice(i, i + 11), 2);
    words.push(WORDLIST[index]);
  }

  return words.join(' ');
}

export function validateMnemonic(mnemonic: string): boolean {
  const words = mnemonic.trim().split(/\s+/);
  if (![12, 15, 18, 21, 24].includes(words.length)) return false;
  return words.every((w) => WORDLIST.includes(w));
}

export { WORDLIST };
