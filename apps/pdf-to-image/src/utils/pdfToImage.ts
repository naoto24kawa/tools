import * as pdfjsLib from 'pdfjs-dist';

// Set worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export type ImageFormat = 'png' | 'jpeg';
export const IMAGE_FORMATS: ImageFormat[] = ['png', 'jpeg'];

export interface ConversionOptions {
  scale: number;
  format: ImageFormat;
  quality: number; // 0-1, for jpeg
}

export const DEFAULT_OPTIONS: ConversionOptions = {
  scale: 2,
  format: 'png',
  quality: 0.9,
};

export async function pdfToImages(
  file: File,
  options: ConversionOptions = DEFAULT_OPTIONS,
  onProgress?: (current: number, total: number) => void
): Promise<string[]> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const images: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: options.scale });

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) continue;

    await page.render({ canvasContext: ctx, viewport }).promise;

    const mimeType = options.format === 'jpeg' ? 'image/jpeg' : 'image/png';
    images.push(canvas.toDataURL(mimeType, options.quality));

    if (onProgress) onProgress(i, pdf.numPages);
  }

  return images;
}

export function downloadImage(dataUrl: string, filename: string): void {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  a.click();
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
