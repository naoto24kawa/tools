import { PDFDocument } from 'pdf-lib';

export async function compressPdf(file: File): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const sourcePdf = await PDFDocument.load(arrayBuffer);

  // Create a new PDF and copy pages (strips unused objects)
  const compressedPdf = await PDFDocument.create();
  const pages = await compressedPdf.copyPages(sourcePdf, sourcePdf.getPageIndices());
  for (const page of pages) {
    compressedPdf.addPage(page);
  }

  // Copy metadata
  compressedPdf.setTitle(sourcePdf.getTitle() ?? '');
  compressedPdf.setAuthor(sourcePdf.getAuthor() ?? '');

  return compressedPdf.save({
    useObjectStreams: true,
    addDefaultPage: false,
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function calculateSavings(
  original: number,
  compressed: number
): { saved: number; percent: number } {
  const saved = original - compressed;
  const percent = original > 0 ? Math.round((saved / original) * 100) : 0;
  return { saved, percent };
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
