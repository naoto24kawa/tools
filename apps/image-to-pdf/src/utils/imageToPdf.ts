import { PageSizes, PDFDocument } from 'pdf-lib';

export type PageSize = 'A4' | 'Letter' | 'A3' | 'Legal' | 'Original';
export const PAGE_SIZES: PageSize[] = ['A4', 'Letter', 'A3', 'Legal', 'Original'];

export type FitMode = 'contain' | 'cover' | 'stretch';
export const FIT_MODES: FitMode[] = ['contain', 'cover', 'stretch'];

export interface ConversionOptions {
  pageSize: PageSize;
  fitMode: FitMode;
  margin: number;
}

export const DEFAULT_OPTIONS: ConversionOptions = {
  pageSize: 'A4',
  fitMode: 'contain',
  margin: 20,
};

function getPageDimensions(pageSize: PageSize): [number, number] | null {
  switch (pageSize) {
    case 'A4':
      return PageSizes.A4;
    case 'A3':
      return PageSizes.A3;
    case 'Letter':
      return PageSizes.Letter;
    case 'Legal':
      return PageSizes.Legal;
    case 'Original':
      return null;
    default:
      return PageSizes.A4;
  }
}

async function loadImage(file: File): Promise<{ data: ArrayBuffer; type: string }> {
  const arrayBuffer = await file.arrayBuffer();
  return { data: arrayBuffer, type: file.type };
}

export async function imagesToPdf(
  files: File[],
  options: ConversionOptions = DEFAULT_OPTIONS
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();

  for (const file of files) {
    const { data, type } = await loadImage(file);

    const image = type === 'image/png' ? await pdf.embedPng(data) : await pdf.embedJpg(data);

    const dims = getPageDimensions(options.pageSize);
    const pageWidth = dims ? dims[0] : image.width + options.margin * 2;
    const pageHeight = dims ? dims[1] : image.height + options.margin * 2;

    const page = pdf.addPage([pageWidth, pageHeight]);
    const availWidth = pageWidth - options.margin * 2;
    const availHeight = pageHeight - options.margin * 2;

    let drawWidth: number;
    let drawHeight: number;

    if (options.fitMode === 'stretch') {
      drawWidth = availWidth;
      drawHeight = availHeight;
    } else {
      const scaleX = availWidth / image.width;
      const scaleY = availHeight / image.height;
      const scale =
        options.fitMode === 'contain' ? Math.min(scaleX, scaleY) : Math.max(scaleX, scaleY);
      drawWidth = image.width * scale;
      drawHeight = image.height * scale;
    }

    const x = options.margin + (availWidth - drawWidth) / 2;
    const y = options.margin + (availHeight - drawHeight) / 2;

    page.drawImage(image, { x, y, width: drawWidth, height: drawHeight });
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

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
