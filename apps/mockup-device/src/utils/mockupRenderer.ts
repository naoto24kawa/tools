import { type DeviceFrame } from './deviceFrames';

export type ImageFit = 'cover' | 'contain';

export interface RenderOptions {
  device: DeviceFrame;
  image: HTMLImageElement;
  fit: ImageFit;
  backgroundColor: string;
  scale: number;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function drawDeviceFrame(ctx: CanvasRenderingContext2D, device: DeviceFrame) {
  const { frame } = device;

  // Device body
  drawRoundedRect(ctx, 0, 0, device.width, device.height, frame.borderRadius);
  ctx.fillStyle = frame.backgroundColor;
  ctx.fill();
  ctx.strokeStyle = frame.borderColor;
  ctx.lineWidth = frame.borderWidth;
  ctx.stroke();

  // Notch (for modern phones)
  if (frame.notch) {
    const notchX = (device.width - frame.notch.width) / 2;
    const notchY = device.screen.y - 2;
    drawRoundedRect(
      ctx,
      notchX,
      notchY - frame.notch.height + 10,
      frame.notch.width,
      frame.notch.height,
      frame.notch.borderRadius
    );
    ctx.fillStyle = frame.backgroundColor;
    ctx.fill();
  }

  // Home button (for older phones)
  if (frame.homeButton) {
    const btnX = device.width / 2;
    const btnY = device.screen.y + device.screen.height + (device.height - device.screen.y - device.screen.height) / 2;
    ctx.beginPath();
    ctx.arc(btnX, btnY, frame.homeButton.size / 2, 0, Math.PI * 2);
    ctx.strokeStyle = '#555555';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Camera (for laptops)
  if (frame.cameraNotch) {
    const camX = device.width / 2;
    const camY = device.screen.y / 2;
    ctx.beginPath();
    ctx.arc(camX, camY, frame.cameraNotch.width / 2, 0, Math.PI * 2);
    ctx.fillStyle = '#333333';
    ctx.fill();
  }
}

function drawImage(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  screen: DeviceFrame['screen'],
  fit: ImageFit
) {
  ctx.save();

  // Clip to screen area
  drawRoundedRect(ctx, screen.x, screen.y, screen.width, screen.height, screen.borderRadius);
  ctx.clip();

  const imgRatio = image.width / image.height;
  const screenRatio = screen.width / screen.height;

  let drawWidth: number;
  let drawHeight: number;
  let drawX: number;
  let drawY: number;

  if (fit === 'cover') {
    if (imgRatio > screenRatio) {
      drawHeight = screen.height;
      drawWidth = drawHeight * imgRatio;
    } else {
      drawWidth = screen.width;
      drawHeight = drawWidth / imgRatio;
    }
    drawX = screen.x + (screen.width - drawWidth) / 2;
    drawY = screen.y + (screen.height - drawHeight) / 2;
  } else {
    // contain
    if (imgRatio > screenRatio) {
      drawWidth = screen.width;
      drawHeight = drawWidth / imgRatio;
    } else {
      drawHeight = screen.height;
      drawWidth = drawHeight * imgRatio;
    }
    drawX = screen.x + (screen.width - drawWidth) / 2;
    drawY = screen.y + (screen.height - drawHeight) / 2;
  }

  ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
  ctx.restore();
}

export function renderMockup(
  canvas: HTMLCanvasElement,
  options: RenderOptions
): void {
  const { device, image, fit, backgroundColor, scale } = options;

  canvas.width = device.width * scale;
  canvas.height = device.height * scale;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.scale(scale, scale);

  // Background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, device.width, device.height);

  // Screen background (white)
  drawRoundedRect(
    ctx,
    device.screen.x,
    device.screen.y,
    device.screen.width,
    device.screen.height,
    device.screen.borderRadius
  );
  ctx.fillStyle = '#ffffff';
  ctx.fill();

  // Draw image on screen
  drawImage(ctx, image, device.screen, fit);

  // Draw device frame on top
  drawDeviceFrame(ctx, device);
}

export function downloadCanvas(canvas: HTMLCanvasElement, filename: string): void {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
