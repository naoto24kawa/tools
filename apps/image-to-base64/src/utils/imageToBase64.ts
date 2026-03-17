export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function formatDataUri(dataUri: string): {
  base64Only: string;
  dataUri: string;
  mimeType: string;
  sizeKB: number;
} {
  const match = dataUri.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return { base64Only: dataUri, dataUri, mimeType: '', sizeKB: 0 };
  const base64Only = match[2];
  return {
    base64Only,
    dataUri,
    mimeType: match[1],
    sizeKB: Math.round(((base64Only.length * 3) / 4 / 1024) * 100) / 100,
  };
}
