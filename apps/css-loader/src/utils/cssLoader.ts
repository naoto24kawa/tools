export interface LoaderConfig {
  size: number;
  color: string;
  speed: number;
  borderWidth: number;
}

export const DEFAULT_CONFIG: LoaderConfig = {
  size: 48,
  color: '#3b82f6',
  speed: 1,
  borderWidth: 4,
};

export const LOADER_TEMPLATES = [
  { name: 'Spinner', id: 'spinner' },
  { name: 'Dots', id: 'dots' },
  { name: 'Pulse', id: 'pulse' },
  { name: 'Ring', id: 'ring' },
] as const;

export type LoaderType = (typeof LOADER_TEMPLATES)[number]['id'];

export function generateLoaderCSS(type: LoaderType, config: LoaderConfig): string {
  const { size, color, speed, borderWidth } = config;
  switch (type) {
    case 'spinner':
      return `.loader {
  width: ${size}px;
  height: ${size}px;
  border: ${borderWidth}px solid #f3f3f3;
  border-top: ${borderWidth}px solid ${color};
  border-radius: 50%;
  animation: spin ${speed}s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;
    case 'dots':
      return `.loader {
  display: flex;
  gap: ${size / 4}px;
}
.loader div {
  width: ${size / 3}px;
  height: ${size / 3}px;
  background: ${color};
  border-radius: 50%;
  animation: bounce ${speed}s ease-in-out infinite;
}
.loader div:nth-child(2) { animation-delay: ${speed / 4}s; }
.loader div:nth-child(3) { animation-delay: ${speed / 2}s; }
@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}`;
    case 'pulse':
      return `.loader {
  width: ${size}px;
  height: ${size}px;
  background: ${color};
  border-radius: 50%;
  animation: pulse ${speed}s ease-in-out infinite;
}
@keyframes pulse {
  0% { transform: scale(0); opacity: 1; }
  100% { transform: scale(1); opacity: 0; }
}`;
    case 'ring':
      return `.loader {
  width: ${size}px;
  height: ${size}px;
  border: ${borderWidth}px solid ${color};
  border-radius: 50%;
  animation: ring ${speed}s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: ${color} transparent transparent transparent;
}
@keyframes ring {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;
    default: {
      const _exhaustiveCheck: never = type;
      throw new Error(`Unknown loader: ${_exhaustiveCheck}`);
    }
  }
}
