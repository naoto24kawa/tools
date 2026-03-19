export interface DevicePreset {
  id: string;
  name: string;
  width: number;
  height: number;
  category: 'mobile' | 'tablet' | 'desktop';
}

export const DEVICE_PRESETS: DevicePreset[] = [
  { id: 'iphone-se', name: 'iPhone SE', width: 375, height: 667, category: 'mobile' },
  { id: 'iphone-14', name: 'iPhone 14', width: 390, height: 844, category: 'mobile' },
  { id: 'iphone-14-pro-max', name: 'iPhone 14 Pro Max', width: 430, height: 932, category: 'mobile' },
  { id: 'pixel-7', name: 'Pixel 7', width: 412, height: 915, category: 'mobile' },
  { id: 'galaxy-s21', name: 'Galaxy S21', width: 360, height: 800, category: 'mobile' },
  { id: 'ipad-mini', name: 'iPad Mini', width: 744, height: 1133, category: 'tablet' },
  { id: 'ipad', name: 'iPad', width: 768, height: 1024, category: 'tablet' },
  { id: 'ipad-pro', name: 'iPad Pro 12.9"', width: 1024, height: 1366, category: 'tablet' },
  { id: 'surface-pro', name: 'Surface Pro', width: 912, height: 1368, category: 'tablet' },
  { id: 'laptop', name: 'Laptop', width: 1280, height: 800, category: 'desktop' },
  { id: 'desktop', name: 'Desktop', width: 1440, height: 900, category: 'desktop' },
  { id: 'desktop-lg', name: 'Desktop Large', width: 1920, height: 1080, category: 'desktop' },
  { id: '4k', name: '4K', width: 2560, height: 1440, category: 'desktop' },
];

export function getDeviceById(id: string): DevicePreset | undefined {
  return DEVICE_PRESETS.find((d) => d.id === id);
}

export function rotateDevice(device: DevicePreset): DevicePreset {
  return {
    ...device,
    width: device.height,
    height: device.width,
  };
}

export function validateUrl(url: string): string | null {
  if (!url.trim()) return null;
  let normalized = url.trim();
  if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
    normalized = `https://${normalized}`;
  }
  try {
    new URL(normalized);
    return normalized;
  } catch {
    return null;
  }
}
