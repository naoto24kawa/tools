export type ViewMode = 'waveform' | 'spectrum' | 'both';

export type ColorScheme = 'green' | 'blue' | 'purple' | 'rainbow' | 'white';

export interface VisualizerConfig {
  viewMode: ViewMode;
  colorScheme: ColorScheme;
  fftSize: number;
}

export const VIEW_MODE_OPTIONS: { value: ViewMode; label: string }[] = [
  { value: 'waveform', label: 'Waveform' },
  { value: 'spectrum', label: 'Spectrum' },
  { value: 'both', label: 'Both' },
];

export const COLOR_SCHEME_OPTIONS: { value: ColorScheme; label: string }[] = [
  { value: 'green', label: 'Green' },
  { value: 'blue', label: 'Blue' },
  { value: 'purple', label: 'Purple' },
  { value: 'rainbow', label: 'Rainbow' },
  { value: 'white', label: 'White' },
];

export function getDefaultConfig(): VisualizerConfig {
  return {
    viewMode: 'both',
    colorScheme: 'green',
    fftSize: 2048,
  };
}

export function getColorForScheme(
  scheme: ColorScheme,
  index: number,
  total: number
): string {
  const ratio = index / total;

  switch (scheme) {
    case 'green':
      return `rgb(0, ${Math.floor(150 + ratio * 105)}, ${Math.floor(50 + ratio * 50)})`;
    case 'blue':
      return `rgb(${Math.floor(ratio * 100)}, ${Math.floor(100 + ratio * 155)}, 255)`;
    case 'purple':
      return `rgb(${Math.floor(150 + ratio * 105)}, ${Math.floor(50 + ratio * 100)}, 255)`;
    case 'rainbow': {
      const hue = Math.floor(ratio * 360);
      return `hsl(${hue}, 100%, 50%)`;
    }
    case 'white':
      return `rgb(${Math.floor(200 + ratio * 55)}, ${Math.floor(200 + ratio * 55)}, ${Math.floor(200 + ratio * 55)})`;
    default:
      return '#00ff00';
  }
}

export function getWaveformColor(scheme: ColorScheme): string {
  switch (scheme) {
    case 'green':
      return '#00ff88';
    case 'blue':
      return '#4488ff';
    case 'purple':
      return '#bb66ff';
    case 'rainbow':
      return '#ff6600';
    case 'white':
      return '#eeeeee';
    default:
      return '#00ff88';
  }
}

export function drawWaveform(
  ctx: CanvasRenderingContext2D,
  dataArray: Uint8Array,
  width: number,
  height: number,
  colorScheme: ColorScheme
): void {
  ctx.fillStyle = '#111827';
  ctx.fillRect(0, 0, width, height);

  ctx.lineWidth = 2;
  ctx.strokeStyle = getWaveformColor(colorScheme);
  ctx.beginPath();

  const sliceWidth = width / dataArray.length;
  let x = 0;

  for (let i = 0; i < dataArray.length; i++) {
    const v = dataArray[i] / 128.0;
    const y = (v * height) / 2;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }

    x += sliceWidth;
  }

  ctx.lineTo(width, height / 2);
  ctx.stroke();
}

export function drawSpectrum(
  ctx: CanvasRenderingContext2D,
  dataArray: Uint8Array,
  width: number,
  height: number,
  colorScheme: ColorScheme
): void {
  ctx.fillStyle = '#111827';
  ctx.fillRect(0, 0, width, height);

  const barCount = dataArray.length;
  const barWidth = width / barCount;

  for (let i = 0; i < barCount; i++) {
    const barHeight = (dataArray[i] / 255) * height;
    const x = i * barWidth;
    const y = height - barHeight;

    ctx.fillStyle = getColorForScheme(colorScheme, i, barCount);
    ctx.fillRect(x, y, barWidth > 1 ? barWidth - 1 : barWidth, barHeight);
  }
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
