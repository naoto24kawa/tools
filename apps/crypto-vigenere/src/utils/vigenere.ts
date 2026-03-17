export function vigenereEncrypt(text: string, key: string): string {
  if (!key) return text;
  const k = key.toUpperCase();
  let ki = 0;
  return [...text]
    .map((c) => {
      if (c >= 'A' && c <= 'Z') {
        const shift = k.charCodeAt(ki % k.length) - 65;
        ki++;
        return String.fromCharCode(((c.charCodeAt(0) - 65 + shift) % 26) + 65);
      }
      if (c >= 'a' && c <= 'z') {
        const shift = k.charCodeAt(ki % k.length) - 65;
        ki++;
        return String.fromCharCode(((c.charCodeAt(0) - 97 + shift) % 26) + 97);
      }
      return c;
    })
    .join('');
}

export function vigenereDecrypt(text: string, key: string): string {
  if (!key) return text;
  const k = key.toUpperCase();
  let ki = 0;
  return [...text]
    .map((c) => {
      if (c >= 'A' && c <= 'Z') {
        const shift = k.charCodeAt(ki % k.length) - 65;
        ki++;
        return String.fromCharCode(((c.charCodeAt(0) - 65 - shift + 26) % 26) + 65);
      }
      if (c >= 'a' && c <= 'z') {
        const shift = k.charCodeAt(ki % k.length) - 65;
        ki++;
        return String.fromCharCode(((c.charCodeAt(0) - 97 - shift + 26) % 26) + 97);
      }
      return c;
    })
    .join('');
}
