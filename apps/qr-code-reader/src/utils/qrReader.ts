import jsQR from 'jsqr';

export interface QrReadResult {
  data: string;
  location: {
    topLeft: { x: number; y: number };
    topRight: { x: number; y: number };
    bottomLeft: { x: number; y: number };
    bottomRight: { x: number; y: number };
  };
}

export function readQrFromImageData(imageData: ImageData): QrReadResult | null {
  const code = jsQR(imageData.data, imageData.width, imageData.height);
  if (!code) return null;
  return {
    data: code.data,
    location: {
      topLeft: code.location.topLeftCorner,
      topRight: code.location.topRightCorner,
      bottomLeft: code.location.bottomLeftCorner,
      bottomRight: code.location.bottomRightCorner,
    },
  };
}

export function imageFileToImageData(file: File): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = () => {
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas not supported'));
          return;
        }
        ctx.drawImage(img, 0, 0);
        resolve(ctx.getImageData(0, 0, canvas.width, canvas.height));
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
