import { PDFDocument } from 'pdf-lib';

export interface PageRange {
  start: number;
  end: number;
}

export async function splitPdf(file: File, ranges: PageRange[]): Promise<Uint8Array[]> {
  const arrayBuffer = await file.arrayBuffer();
  const sourcePdf = await PDFDocument.load(arrayBuffer);
  const results: Uint8Array[] = [];

  for (const range of ranges) {
    const newPdf = await PDFDocument.create();
    const indices = [];
    for (let i = range.start - 1; i < Math.min(range.end, sourcePdf.getPageCount()); i++) {
      indices.push(i);
    }
    const pages = await newPdf.copyPages(sourcePdf, indices);
    for (const page of pages) {
      newPdf.addPage(page);
    }
    results.push(await newPdf.save());
  }

  return results;
}

export async function splitByPages(file: File): Promise<Uint8Array[]> {
  const arrayBuffer = await file.arrayBuffer();
  const sourcePdf = await PDFDocument.load(arrayBuffer);
  const results: Uint8Array[] = [];

  for (let i = 0; i < sourcePdf.getPageCount(); i++) {
    const newPdf = await PDFDocument.create();
    const [page] = await newPdf.copyPages(sourcePdf, [i]);
    newPdf.addPage(page);
    results.push(await newPdf.save());
  }

  return results;
}

export async function getPageCount(file: File): Promise<number> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  return pdf.getPageCount();
}

export function parsePageRanges(input: string, maxPages: number): PageRange[] {
  const ranges: PageRange[] = [];
  const parts = input
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  for (const part of parts) {
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-');
      const start = Math.max(1, Number.parseInt(startStr, 10));
      const end = Math.min(maxPages, Number.parseInt(endStr, 10));
      if (!Number.isNaN(start) && !Number.isNaN(end) && start <= end) {
        ranges.push({ start, end });
      }
    } else {
      const page = Number.parseInt(part, 10);
      if (!Number.isNaN(page) && page >= 1 && page <= maxPages) {
        ranges.push({ start: page, end: page });
      }
    }
  }

  return ranges;
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
