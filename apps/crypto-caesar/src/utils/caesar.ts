export function caesarEncrypt(text: string, shift: number): string {
  const s = ((shift % 26) + 26) % 26;
  return [...text]
    .map((char) => {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) return String.fromCharCode(((code - 65 + s) % 26) + 65);
      if (code >= 97 && code <= 122) return String.fromCharCode(((code - 97 + s) % 26) + 97);
      return char;
    })
    .join('');
}

export function caesarDecrypt(text: string, shift: number): string {
  return caesarEncrypt(text, -shift);
}

export function bruteForce(text: string): { shift: number; result: string }[] {
  return Array.from({ length: 26 }, (_, i) => ({
    shift: i,
    result: caesarDecrypt(text, i),
  }));
}
