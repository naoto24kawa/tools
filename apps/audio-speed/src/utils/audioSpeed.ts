export const MIN_SPEED = 0.25;
export const MAX_SPEED = 4;
export const DEFAULT_SPEED = 1;
export const SPEED_PRESETS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4];

export function clampSpeed(speed: number): number {
  return Math.max(MIN_SPEED, Math.min(MAX_SPEED, speed));
}

export function isValidSpeed(speed: number): boolean {
  return !isNaN(speed) && speed >= MIN_SPEED && speed <= MAX_SPEED;
}

export function formatSpeed(speed: number): string {
  return `${speed.toFixed(2)}x`;
}

export function calculateNewDuration(originalDuration: number, speed: number): number {
  if (speed <= 0) return originalDuration;
  return originalDuration / speed;
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toFixed(1).padStart(4, '0')}`;
}

export function generateOutputFilename(originalName: string, speed: number): string {
  const nameParts = originalName.split('.');
  const ext = nameParts.length > 1 ? nameParts.pop() : '';
  const baseName = nameParts.join('.');
  const speedLabel = speed.toFixed(2).replace('.', '_');
  return `${baseName}_${speedLabel}x.wav`;
}

/**
 * Resample an AudioBuffer to a new speed without pitch correction.
 * This changes both speed and pitch.
 */
export function changeSpeedSimple(
  audioContext: AudioContext,
  sourceBuffer: AudioBuffer,
  speed: number
): AudioBuffer {
  const newLength = Math.ceil(sourceBuffer.length / speed);
  const channels = sourceBuffer.numberOfChannels;
  const sampleRate = sourceBuffer.sampleRate;

  const newBuffer = audioContext.createBuffer(channels, newLength, sampleRate);

  for (let ch = 0; ch < channels; ch++) {
    const sourceData = sourceBuffer.getChannelData(ch);
    const newData = newBuffer.getChannelData(ch);
    for (let i = 0; i < newLength; i++) {
      const srcIndex = i * speed;
      const idx = Math.floor(srcIndex);
      const frac = srcIndex - idx;
      if (idx + 1 < sourceData.length) {
        newData[i] = sourceData[idx] * (1 - frac) + sourceData[idx + 1] * frac;
      } else if (idx < sourceData.length) {
        newData[i] = sourceData[idx];
      }
    }
  }

  return newBuffer;
}

/**
 * Convert AudioBuffer to WAV Blob
 */
export function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const bitDepth = 16;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  const dataLength = buffer.length * blockAlign;
  const totalLength = 44 + dataLength;

  const arrayBuffer = new ArrayBuffer(totalLength);
  const view = new DataView(arrayBuffer);

  writeString(view, 0, 'RIFF');
  view.setUint32(4, totalLength - 8, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataLength, true);

  let offset = 44;
  for (let i = 0; i < buffer.length; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      const sample = buffer.getChannelData(ch)[i];
      const clamped = Math.max(-1, Math.min(1, sample));
      const int16 = clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff;
      view.setInt16(offset, int16, true);
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, str: string): void {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}
