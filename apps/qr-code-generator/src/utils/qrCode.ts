import QRCode from 'qrcode';

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export interface QrOptions {
  errorCorrectionLevel: ErrorCorrectionLevel;
  margin: number;
  width: number;
  color: {
    dark: string;
    light: string;
  };
}

export const DEFAULT_OPTIONS: QrOptions = {
  errorCorrectionLevel: 'M',
  margin: 4,
  width: 256,
  color: { dark: '#000000', light: '#ffffff' },
};

export async function generateQrDataUrl(
  text: string,
  options: QrOptions = DEFAULT_OPTIONS
): Promise<string> {
  return QRCode.toDataURL(text, {
    errorCorrectionLevel: options.errorCorrectionLevel,
    margin: options.margin,
    width: options.width,
    color: options.color,
  });
}

export async function generateQrSvg(
  text: string,
  options: QrOptions = DEFAULT_OPTIONS
): Promise<string> {
  return QRCode.toString(text, {
    type: 'svg',
    errorCorrectionLevel: options.errorCorrectionLevel,
    margin: options.margin,
    width: options.width,
    color: options.color,
  });
}
