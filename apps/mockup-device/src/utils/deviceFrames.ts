export interface DeviceFrame {
  id: string;
  name: string;
  category: string;
  // Total device dimensions (including frame)
  width: number;
  height: number;
  // Screen area within the device
  screen: {
    x: number;
    y: number;
    width: number;
    height: number;
    borderRadius: number;
  };
  // Frame drawing config
  frame: {
    borderRadius: number;
    borderWidth: number;
    borderColor: string;
    backgroundColor: string;
    // Notch/dynamic island
    notch?: {
      width: number;
      height: number;
      borderRadius: number;
    };
    // Home button
    homeButton?: {
      size: number;
    };
    // Camera notch for laptops
    cameraNotch?: {
      width: number;
      height: number;
    };
  };
}

export const DEVICE_FRAMES: DeviceFrame[] = [
  {
    id: 'iphone-14',
    name: 'iPhone 14',
    category: 'Phone',
    width: 430,
    height: 880,
    screen: { x: 20, y: 20, width: 390, height: 844, borderRadius: 40 },
    frame: {
      borderRadius: 50,
      borderWidth: 3,
      borderColor: '#1a1a1a',
      backgroundColor: '#1a1a1a',
      notch: { width: 120, height: 30, borderRadius: 15 },
    },
  },
  {
    id: 'iphone-se',
    name: 'iPhone SE',
    category: 'Phone',
    width: 415,
    height: 777,
    screen: { x: 20, y: 90, width: 375, height: 667, borderRadius: 0 },
    frame: {
      borderRadius: 40,
      borderWidth: 3,
      borderColor: '#2a2a2a',
      backgroundColor: '#2a2a2a',
      homeButton: { size: 50 },
    },
  },
  {
    id: 'android',
    name: 'Android Phone',
    category: 'Phone',
    width: 452,
    height: 955,
    screen: { x: 16, y: 16, width: 420, height: 920, borderRadius: 30 },
    frame: {
      borderRadius: 38,
      borderWidth: 3,
      borderColor: '#1a1a1a',
      backgroundColor: '#1a1a1a',
    },
  },
  {
    id: 'ipad',
    name: 'iPad',
    category: 'Tablet',
    width: 820,
    height: 1100,
    screen: { x: 26, y: 36, width: 768, height: 1024, borderRadius: 10 },
    frame: {
      borderRadius: 30,
      borderWidth: 3,
      borderColor: '#2a2a2a',
      backgroundColor: '#2a2a2a',
    },
  },
  {
    id: 'ipad-pro',
    name: 'iPad Pro',
    category: 'Tablet',
    width: 1076,
    height: 1430,
    screen: { x: 26, y: 30, width: 1024, height: 1366, borderRadius: 16 },
    frame: {
      borderRadius: 24,
      borderWidth: 3,
      borderColor: '#1a1a1a',
      backgroundColor: '#1a1a1a',
    },
  },
  {
    id: 'macbook',
    name: 'MacBook',
    category: 'Laptop',
    width: 1440,
    height: 960,
    screen: { x: 80, y: 40, width: 1280, height: 800, borderRadius: 6 },
    frame: {
      borderRadius: 14,
      borderWidth: 3,
      borderColor: '#c0c0c0',
      backgroundColor: '#e0e0e0',
      cameraNotch: { width: 8, height: 8 },
    },
  },
];

export function getDeviceById(id: string): DeviceFrame | undefined {
  return DEVICE_FRAMES.find((d) => d.id === id);
}

export function getDevicesByCategory(category: string): DeviceFrame[] {
  return DEVICE_FRAMES.filter((d) => d.category === category);
}

export const DEVICE_CATEGORIES = [...new Set(DEVICE_FRAMES.map((d) => d.category))];
