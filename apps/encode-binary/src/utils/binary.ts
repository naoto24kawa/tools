export function textToBinary(text: string): string {
  return [...text].map((char) => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
}

export function binaryToText(binary: string): string {
  return binary
    .trim()
    .split(/\s+/)
    .map((bin) => {
      const num = Number.parseInt(bin, 2);
      if (Number.isNaN(num)) return '';
      return String.fromCharCode(num);
    })
    .join('');
}

export function textToHex(text: string): string {
  return [...text].map((char) => char.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
}

export function hexToText(hex: string): string {
  return hex
    .trim()
    .split(/\s+/)
    .map((h) => {
      const num = Number.parseInt(h, 16);
      if (Number.isNaN(num)) return '';
      return String.fromCharCode(num);
    })
    .join('');
}

export function textToDecimal(text: string): string {
  return [...text].map((char) => char.charCodeAt(0).toString(10)).join(' ');
}

export function decimalToText(decimal: string): string {
  return decimal
    .trim()
    .split(/\s+/)
    .map((d) => {
      const num = Number.parseInt(d, 10);
      if (Number.isNaN(num)) return '';
      return String.fromCharCode(num);
    })
    .join('');
}
