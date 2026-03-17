export type BarcodeFormat =
  | 'CODE128'
  | 'EAN13'
  | 'EAN8'
  | 'UPC'
  | 'CODE39'
  | 'ITF14'
  | 'MSI'
  | 'pharmacode';

export const FORMATS: BarcodeFormat[] = [
  'CODE128',
  'EAN13',
  'EAN8',
  'UPC',
  'CODE39',
  'ITF14',
  'MSI',
  'pharmacode',
];

export interface BarcodeOptions {
  format: BarcodeFormat;
  width: number;
  height: number;
  displayValue: boolean;
  lineColor: string;
  background: string;
}

export const DEFAULT_OPTIONS: BarcodeOptions = {
  format: 'CODE128',
  width: 2,
  height: 100,
  displayValue: true,
  lineColor: '#000000',
  background: '#ffffff',
};

export function validateInput(value: string, format: BarcodeFormat): boolean {
  switch (format) {
    case 'EAN13':
      return /^\d{13}$/.test(value);
    case 'EAN8':
      return /^\d{8}$/.test(value);
    case 'UPC':
      return /^\d{12}$/.test(value);
    case 'ITF14':
      return /^\d{14}$/.test(value);
    case 'pharmacode':
      return /^\d+$/.test(value) && Number(value) >= 3 && Number(value) <= 131070;
    case 'CODE128':
      return value.length > 0;
    case 'CODE39':
      return /^[A-Z0-9\-. $/+%*]+$/i.test(value);
    case 'MSI':
      return /^\d+$/.test(value);
    default:
      return value.length > 0;
  }
}
