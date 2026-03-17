import { PDFDocument } from 'pdf-lib';

export interface PdfMetadata {
  title: string;
  author: string;
  subject: string;
  creator: string;
  producer: string;
  creationDate: string;
  modificationDate: string;
  pageCount: number;
  pageSize: string;
  fileSize: string;
}

export async function getPdfMetadata(file: File): Promise<PdfMetadata> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  const pages = pdf.getPages();
  const firstPage = pages[0];
  const { width, height } = firstPage?.getSize() ?? { width: 0, height: 0 };

  return {
    title: pdf.getTitle() ?? '',
    author: pdf.getAuthor() ?? '',
    subject: pdf.getSubject() ?? '',
    creator: pdf.getCreator() ?? '',
    producer: pdf.getProducer() ?? '',
    creationDate: pdf.getCreationDate()?.toISOString() ?? '',
    modificationDate: pdf.getModificationDate()?.toISOString() ?? '',
    pageCount: pdf.getPageCount(),
    pageSize: `${Math.round(width)} x ${Math.round(height)} pt`,
    fileSize: formatFileSize(file.size),
  };
}

export async function updatePdfMetadata(
  file: File,
  metadata: Partial<PdfMetadata>
): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);

  if (metadata.title !== undefined) pdf.setTitle(metadata.title);
  if (metadata.author !== undefined) pdf.setAuthor(metadata.author);
  if (metadata.subject !== undefined) pdf.setSubject(metadata.subject);
  if (metadata.creator !== undefined) pdf.setCreator(metadata.creator);

  return pdf.save();
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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
