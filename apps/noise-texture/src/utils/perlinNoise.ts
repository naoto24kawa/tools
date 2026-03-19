function fade(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(a: number, b: number, t: number): number {
  return a + t * (b - a);
}

function grad(hash: number, x: number, y: number): number {
  const h = hash & 3;
  const u = h < 2 ? x : y;
  const v = h < 2 ? y : x;
  return (h & 1 ? -u : u) + (h & 2 ? -v : v);
}

function createPermutation(seed: number): number[] {
  const p: number[] = [];
  for (let i = 0; i < 256; i++) p[i] = i;
  let s = seed;
  for (let i = 255; i > 0; i--) {
    s = (s * 16807 + 0) % 2147483647;
    const j = s % (i + 1);
    [p[i], p[j]] = [p[j], p[i]];
  }
  const perm = new Array(512);
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
  return perm;
}

export function noise2D(x: number, y: number, perm: number[]): number {
  const xi = Math.floor(x) & 255;
  const yi = Math.floor(y) & 255;
  const xf = x - Math.floor(x);
  const yf = y - Math.floor(y);
  const u = fade(xf);
  const v = fade(yf);

  const aa = perm[perm[xi] + yi];
  const ab = perm[perm[xi] + yi + 1];
  const ba = perm[perm[xi + 1] + yi];
  const bb = perm[perm[xi + 1] + yi + 1];

  return lerp(
    lerp(grad(aa, xf, yf), grad(ba, xf - 1, yf), u),
    lerp(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), u),
    v
  );
}

export function generateNoise(
  width: number,
  height: number,
  scale: number,
  octaves: number,
  persistence: number,
  seed: number
): Float32Array {
  const perm = createPermutation(seed);
  const data = new Float32Array(width * height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let value = 0;
      let amplitude = 1;
      let frequency = 1;
      let maxValue = 0;

      for (let o = 0; o < octaves; o++) {
        const nx = (x / scale) * frequency;
        const ny = (y / scale) * frequency;
        value += noise2D(nx, ny, perm) * amplitude;
        maxValue += amplitude;
        amplitude *= persistence;
        frequency *= 2;
      }

      data[y * width + x] = (value / maxValue + 1) / 2; // Normalize to 0-1
    }
  }

  return data;
}

export type ColorMode = 'grayscale' | 'gradient';

export interface GradientStop {
  position: number;
  color: [number, number, number];
}

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

export function renderToCanvas(
  canvas: HTMLCanvasElement,
  noiseData: Float32Array,
  width: number,
  height: number,
  colorMode: ColorMode,
  gradientColor1: string,
  gradientColor2: string
): void {
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const imageData = ctx.createImageData(width, height);

  const c1 = hexToRgb(gradientColor1);
  const c2 = hexToRgb(gradientColor2);

  for (let i = 0; i < noiseData.length; i++) {
    const v = Math.max(0, Math.min(1, noiseData[i]));
    const idx = i * 4;

    if (colorMode === 'grayscale') {
      const gray = Math.floor(v * 255);
      imageData.data[idx] = gray;
      imageData.data[idx + 1] = gray;
      imageData.data[idx + 2] = gray;
    } else {
      imageData.data[idx] = Math.floor(lerp(c1[0], c2[0], v));
      imageData.data[idx + 1] = Math.floor(lerp(c1[1], c2[1], v));
      imageData.data[idx + 2] = Math.floor(lerp(c1[2], c2[2], v));
    }
    imageData.data[idx + 3] = 255;
  }

  ctx.putImageData(imageData, 0, 0);
}
