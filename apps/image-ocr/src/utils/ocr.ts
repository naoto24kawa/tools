import Tesseract from 'tesseract.js';

export type OcrLanguage = 'eng' | 'jpn' | 'chi_sim' | 'kor' | 'fra' | 'deu' | 'spa';

export const LANGUAGES: { value: OcrLanguage; label: string }[] = [
  { value: 'eng', label: 'English' },
  { value: 'jpn', label: 'Japanese' },
  { value: 'chi_sim', label: 'Chinese (Simplified)' },
  { value: 'kor', label: 'Korean' },
  { value: 'fra', label: 'French' },
  { value: 'deu', label: 'German' },
  { value: 'spa', label: 'Spanish' },
];

export interface OcrResult {
  text: string;
  confidence: number;
}

export async function recognizeText(
  image: File | string,
  language: OcrLanguage,
  onProgress?: (progress: number) => void
): Promise<OcrResult> {
  const result = await Tesseract.recognize(image, language, {
    logger: (m) => {
      if (m.status === 'recognizing text' && onProgress) {
        onProgress(m.progress);
      }
    },
  });

  return {
    text: result.data.text,
    confidence: result.data.confidence,
  };
}
