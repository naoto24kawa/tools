export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toFixed(2).padStart(5, '0')}`;
}

export function parseTime(timeStr: string): number {
  const parts = timeStr.split(':');
  if (parts.length === 2) {
    return parseInt(parts[0], 10) * 60 + parseFloat(parts[1]);
  }
  return parseFloat(timeStr) || 0;
}

export function clampTime(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function validateTrimRange(
  start: number,
  end: number,
  duration: number
): { valid: boolean; error?: string } {
  if (start < 0) return { valid: false, error: 'Start time cannot be negative' };
  if (end > duration) return { valid: false, error: 'End time exceeds duration' };
  if (start >= end) return { valid: false, error: 'Start time must be before end time' };
  if (end - start < 0.01) return { valid: false, error: 'Trimmed segment too short' };
  return { valid: true };
}

export function calculateTrimmedDuration(start: number, end: number): number {
  return Math.max(0, end - start);
}

export function drawWaveform(
  canvas: HTMLCanvasElement,
  audioBuffer: AudioBuffer,
  startTime: number,
  endTime: number
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  const channelData = audioBuffer.getChannelData(0);
  const duration = audioBuffer.duration;
  const sampleRate = audioBuffer.sampleRate;
  const totalSamples = channelData.length;
  const samplesPerPixel = Math.ceil(totalSamples / width);

  ctx.clearRect(0, 0, width, height);

  // Draw selected region background
  const startX = (startTime / duration) * width;
  const endX = (endTime / duration) * width;

  // Dimmed area before selection
  ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
  ctx.fillRect(0, 0, startX, height);

  // Dimmed area after selection
  ctx.fillRect(endX, 0, width - endX, height);

  // Selected region highlight
  ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
  ctx.fillRect(startX, 0, endX - startX, height);

  // Draw waveform
  const midY = height / 2;
  ctx.beginPath();
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 1;

  for (let x = 0; x < width; x++) {
    const startSample = x * samplesPerPixel;
    const endSample = Math.min(startSample + samplesPerPixel, totalSamples);

    let min = 1;
    let max = -1;
    for (let i = startSample; i < endSample; i++) {
      const val = channelData[i];
      if (val < min) min = val;
      if (val > max) max = val;
    }

    const yMin = midY + min * midY;
    const yMax = midY + max * midY;
    ctx.moveTo(x, yMin);
    ctx.lineTo(x, yMax);
  }
  ctx.stroke();

  // Draw selection boundary lines
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 4]);

  ctx.beginPath();
  ctx.moveTo(startX, 0);
  ctx.lineTo(startX, height);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(endX, 0);
  ctx.lineTo(endX, height);
  ctx.stroke();

  ctx.setLineDash([]);

  // Draw center line
  ctx.strokeStyle = 'rgba(156, 163, 175, 0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, midY);
  ctx.lineTo(width, midY);
  ctx.stroke();
}

export function trimAudioBuffer(
  audioContext: AudioContext,
  sourceBuffer: AudioBuffer,
  startTime: number,
  endTime: number
): AudioBuffer {
  const sampleRate = sourceBuffer.sampleRate;
  const startSample = Math.floor(startTime * sampleRate);
  const endSample = Math.ceil(endTime * sampleRate);
  const frameCount = endSample - startSample;
  const channels = sourceBuffer.numberOfChannels;

  const trimmedBuffer = audioContext.createBuffer(channels, frameCount, sampleRate);

  for (let ch = 0; ch < channels; ch++) {
    const sourceData = sourceBuffer.getChannelData(ch);
    const trimmedData = trimmedBuffer.getChannelData(ch);
    for (let i = 0; i < frameCount; i++) {
      trimmedData[i] = sourceData[startSample + i];
    }
  }

  return trimmedBuffer;
}

export function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;

  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  const dataLength = buffer.length * blockAlign;
  const headerLength = 44;
  const totalLength = headerLength + dataLength;

  const arrayBuffer = new ArrayBuffer(totalLength);
  const view = new DataView(arrayBuffer);

  // WAV header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, totalLength - 8, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataLength, true);

  // Interleave channel data
  let offset = headerLength;
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

export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1] : '';
}

export function generateOutputFilename(originalName: string): string {
  const nameParts = originalName.split('.');
  const ext = nameParts.length > 1 ? nameParts.pop() : '';
  const baseName = nameParts.join('.');
  return `${baseName}_trimmed.wav`;
}
