export interface ColorPoint {
  x: number; // 0-1 normalized
  y: number; // 0-1 normalized
  color: [number, number, number]; // RGB
}

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((v) =>
        Math.max(0, Math.min(255, Math.round(v)))
          .toString(16)
          .padStart(2, '0')
      )
      .join('')
  );
}

export function parseHexColor(hex: string): [number, number, number] {
  return hexToRgb(hex);
}

export function toHex(color: [number, number, number]): string {
  return rgbToHex(color[0], color[1], color[2]);
}

export function renderMesh(
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
  points: ColorPoint[]
): void {
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  if (points.length === 0) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    return;
  }

  const imageData = ctx.createImageData(width, height);

  for (let py = 0; py < height; py++) {
    for (let px = 0; px < width; px++) {
      const nx = px / width;
      const ny = py / height;

      // Inverse distance weighted interpolation
      let totalWeight = 0;
      let r = 0,
        g = 0,
        b = 0;

      for (const point of points) {
        const dx = nx - point.x;
        const dy = ny - point.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const weight = 1 / (dist * dist + 0.001);
        totalWeight += weight;
        r += point.color[0] * weight;
        g += point.color[1] * weight;
        b += point.color[2] * weight;
      }

      const idx = (py * width + px) * 4;
      imageData.data[idx] = Math.round(r / totalWeight);
      imageData.data[idx + 1] = Math.round(g / totalWeight);
      imageData.data[idx + 2] = Math.round(b / totalWeight);
      imageData.data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

export function generateCSS(points: ColorPoint[]): string {
  if (points.length === 0) return 'background: #ffffff;';

  const gradients = points
    .map((p) => {
      const hex = toHex(p.color);
      const cx = Math.round(p.x * 100);
      const cy = Math.round(p.y * 100);
      return `radial-gradient(circle at ${cx}% ${cy}%, ${hex} 0%, transparent 70%)`;
    })
    .join(',\n  ');

  const bgColor = toHex(points[0].color);
  return `background:\n  ${gradients};\nbackground-color: ${bgColor};`;
}

export function downloadPng(canvas: HTMLCanvasElement): void {
  const link = document.createElement('a');
  link.download = 'gradient-mesh.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}
