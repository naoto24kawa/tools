export interface DisplayInfo {
  screenWidth: number;
  screenHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  devicePixelRatio: number;
  colorDepth: number;
  orientation: string;
  touchSupport: boolean;
  maxTouchPoints: number;
  userAgent: string;
  platform: string;
  language: string;
  languages: string[];
  cookieEnabled: boolean;
  onLine: boolean;
  hardwareConcurrency: number;
}

export function getDisplayInfo(): DisplayInfo {
  return {
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    devicePixelRatio: window.devicePixelRatio,
    colorDepth: window.screen.colorDepth,
    orientation: window.screen.orientation?.type ?? 'unknown',
    touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    maxTouchPoints: navigator.maxTouchPoints,
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    languages: [...navigator.languages],
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine,
    hardwareConcurrency: navigator.hardwareConcurrency,
  };
}

export function getBreakpoint(width: number): string {
  if (width < 640) return 'xs (< 640px)';
  if (width < 768) return 'sm (640-767px)';
  if (width < 1024) return 'md (768-1023px)';
  if (width < 1280) return 'lg (1024-1279px)';
  if (width < 1536) return 'xl (1280-1535px)';
  return '2xl (>= 1536px)';
}
