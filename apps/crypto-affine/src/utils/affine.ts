function modInverse(a: number, m: number): number | null {
  const g = gcd(a, m);
  if (g !== 1) return null;
  let result = 1;
  a = ((a % m) + m) % m;
  for (let i = 1; i < m; i++) {
    if ((a * i) % m === 1) {
      result = i;
      break;
    }
  }
  return result;
}

function gcd(a: number, b: number): number {
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

export function affineEncrypt(text: string, a: number, b: number): string {
  if (gcd(a, 26) !== 1) return text;
  return [...text]
    .map((c) => {
      if (c >= 'A' && c <= 'Z')
        return String.fromCharCode(((a * (c.charCodeAt(0) - 65) + b) % 26) + 65);
      if (c >= 'a' && c <= 'z')
        return String.fromCharCode(((a * (c.charCodeAt(0) - 97) + b) % 26) + 97);
      return c;
    })
    .join('');
}

export function affineDecrypt(text: string, a: number, b: number): string {
  const aInv = modInverse(a, 26);
  if (aInv === null) return text;
  return [...text]
    .map((c) => {
      if (c >= 'A' && c <= 'Z')
        return String.fromCharCode(
          ((((aInv * (c.charCodeAt(0) - 65 - b + 26 * 26)) % 26) + 26) % 26) + 65
        );
      if (c >= 'a' && c <= 'z')
        return String.fromCharCode(
          ((((aInv * (c.charCodeAt(0) - 97 - b + 26 * 26)) % 26) + 26) % 26) + 97
        );
      return c;
    })
    .join('');
}

export function isValidA(a: number): boolean {
  return gcd(a, 26) === 1;
}

export const VALID_A_VALUES = [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25];
