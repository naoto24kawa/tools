import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export interface WatermarkOptions {
  text: string;
  fontSize: number;
  opacity: number;
  rotation: number;
  color: { r: number; g: number; b: number };
}

export const DEFAULT_OPTIONS: WatermarkOptions = {
  text: 'CONFIDENTIAL',
  fontSize: 48,
  opacity: 0.3,
  rotation: -45,
  color: { r: 0.5, g: 0.5, b: 0.5 },
};

export async function addWatermark(file: File, options: WatermarkOptions): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  const font = await pdf.embedFont(StandardFonts.HelveticaBold);
  const pages = pdf.getPages();

  for (const page of pages) {
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(options.text, options.fontSize);

    page.drawText(options.text, {
      x: (width - textWidth) / 2,
      y: height / 2,
      size: options.fontSize,
      font,
      color: rgb(options.color.r, options.color.g, options.color.b),
      opacity: options.opacity,
      rotate: degrees(options.rotation),
    });
  }

  return pdf.save();
}

export function downloadPdf(data: Uint8Array, filename: string): void {
  const blob = new Blob([data], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
