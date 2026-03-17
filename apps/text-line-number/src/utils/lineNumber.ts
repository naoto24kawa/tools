export interface LineNumberOptions {
  startNumber: number;
  separator: string;
  zeroPadding: boolean;
  skipEmpty: boolean;
}

export const DEFAULT_OPTIONS: LineNumberOptions = {
  startNumber: 1,
  separator: ': ',
  zeroPadding: false,
  skipEmpty: false,
};

export function addLineNumbers(input: string, options: LineNumberOptions): string {
  const { startNumber, separator, zeroPadding, skipEmpty } = options;
  const lines = input.split('\n');
  const maxNumber = startNumber + lines.length - 1;
  const padLength = zeroPadding ? String(maxNumber).length : 0;

  let currentNumber = startNumber;
  return lines
    .map((line) => {
      if (skipEmpty && line.trim() === '') {
        return line;
      }
      const num = zeroPadding
        ? String(currentNumber).padStart(padLength, '0')
        : String(currentNumber);
      currentNumber++;
      return `${num}${separator}${line}`;
    })
    .join('\n');
}
