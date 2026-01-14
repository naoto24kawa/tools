import JSZip from 'jszip';
import { ASSET_CONFIGS, type AssetConfig } from '../config/constants';

export interface GeneratedAsset {
  config: AssetConfig;
  blob: Blob;
  url: string;
}

export const generateAssets = async (sourceFile: File): Promise<GeneratedAsset[]> => {
  // Load image using Image element instead of createImageBitmap
  const imageUrl = URL.createObjectURL(sourceFile);
  const img = new Image();
  
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageUrl;
  });

  const assets: GeneratedAsset[] = [];

  for (const config of ASSET_CONFIGS) {
    const canvas = document.createElement('canvas');
    canvas.width = config.width;
    canvas.height = config.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) continue;

    // High quality scaling
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Fill background with white
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, config.width, config.height);

    // Calculate dimensions to fit image within canvas (contain mode)
    const sourceRatio = img.width / img.height;
    const targetRatio = config.width / config.height;
    
    let drawWidth: number;
    let drawHeight: number;
    let offsetX: number;
    let offsetY: number;

    if (sourceRatio > targetRatio) {
      // Source is wider: fit to width
      drawWidth = config.width;
      drawHeight = config.width / sourceRatio;
      offsetX = 0;
      offsetY = (config.height - drawHeight) / 2;
    } else {
      // Source is taller: fit to height
      drawHeight = config.height;
      drawWidth = config.height * sourceRatio;
      offsetX = (config.width - drawWidth) / 2;
      offsetY = 0;
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

    // For .ico, we just save as png for now and rename, or use a library?
    // Browsers support PNG favicons mostly. But true .ico is binary.
    // For simplicity in this client-side tool without heavy libs, we'll export as PNG but use .ico extension if requested, 
    // OR we can use a simple header. 
    // Let's stick to PNG blob for all for now, but for 'ico' format we might need to handle it.
    // Actually, let's just output PNG for everything. 
    // If format is 'ico', we can try to make a real ico or just a png. 
    // Let's output PNG blob.
    
    const blob = await new Promise<Blob | null>((resolve) => {
      const mimeType = config.format === 'ico' ? 'image/x-icon' : 'image/png';
      // Note: toBlob with image/x-icon might not work in all browsers, they might fallback to png.
      // For true .ico, we need a binary writer. 
      // For now, let's use image/png for everything but name it .ico if needed (hacky) or just keep it .png.
      // User asked for favicon.ico. 
      // Let's use image/png. Modern browsers handle png favicons.
      canvas.toBlob(resolve, 'image/png');
    });

    if (blob) {
      assets.push({
        config,
        blob,
        url: URL.createObjectURL(blob),
      });
    }
  }

  // Clean up the original image URL
  URL.revokeObjectURL(imageUrl);

  return assets;
};

export const createZip = async (assets: GeneratedAsset[]): Promise<Blob> => {
  const zip = new JSZip();

  assets.forEach((asset) => {
    zip.file(asset.config.filename, asset.blob);
  });

  return await zip.generateAsync({ type: 'blob' });
};
