import { degrees, PDFDocument } from 'pdf-lib';

export type RotationAngle = 0 | 90 | 180 | 270;
export const ROTATION_ANGLES: RotationAngle[] = [0, 90, 180, 270];

export async function rotatePdf(
  file: File,
  angle: RotationAngle,
  pageIndices?: number[]
): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  const pages = pdf.getPages();

  const targetPages = pageIndices ?? pages.map((_, i) => i);

  for (const index of targetPages) {
    if (index >= 0 && index < pages.length) {
      const page = pages[index];
      const currentRotation = page.getRotation().angle;
      page.setRotation(degrees(currentRotation + angle));
    }
  }

  return pdf.save();
}

export async function getPageCount(file: File): Promise<number> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  return pdf.getPageCount();
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
