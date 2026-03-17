export interface CoinResult {
  flips: ('heads' | 'tails')[];
  headsCount: number;
  tailsCount: number;
  headsPercent: number;
  tailsPercent: number;
}

function secureFlip(): 'heads' | 'tails' {
  const array = new Uint8Array(1);
  crypto.getRandomValues(array);
  return array[0] % 2 === 0 ? 'heads' : 'tails';
}

export function flipCoins(count: number): CoinResult {
  const flips = Array.from({ length: count }, () => secureFlip());
  const headsCount = flips.filter((f) => f === 'heads').length;
  const tailsCount = count - headsCount;
  return {
    flips,
    headsCount,
    tailsCount,
    headsPercent: count > 0 ? (headsCount / count) * 100 : 0,
    tailsPercent: count > 0 ? (tailsCount / count) * 100 : 0,
  };
}
