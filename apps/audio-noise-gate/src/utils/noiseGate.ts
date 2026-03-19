export interface NoiseGateOptions {
  thresholdDb: number;
  attackMs: number;
  releaseMs: number;
  highPassFreq: number;
  lowPassFreq: number;
}

export function getDefaultOptions(): NoiseGateOptions {
  return {
    thresholdDb: -40,
    attackMs: 5,
    releaseMs: 50,
    highPassFreq: 80,
    lowPassFreq: 16000,
  };
}

export function dbToLinear(db: number): number {
  return Math.pow(10, db / 20);
}

export function linearToDb(linear: number): number {
  if (linear <= 0) return -Infinity;
  return 20 * Math.log10(linear);
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export async function decodeAudioFile(file: File): Promise<AudioBuffer> {
  const arrayBuffer = await file.arrayBuffer();
  const audioContext = new AudioContext();
  try {
    return await audioContext.decodeAudioData(arrayBuffer);
  } finally {
    await audioContext.close();
  }
}

export function applyNoiseGate(
  audioBuffer: AudioBuffer,
  options: NoiseGateOptions
): AudioBuffer {
  const sampleRate = audioBuffer.sampleRate;
  const numberOfChannels = audioBuffer.numberOfChannels;
  const length = audioBuffer.length;

  const offlineCtx = new OfflineAudioContext(numberOfChannels, length, sampleRate);
  const outputBuffer = offlineCtx.createBuffer(numberOfChannels, length, sampleRate);

  const threshold = dbToLinear(options.thresholdDb);
  const attackSamples = Math.max(1, Math.floor((options.attackMs / 1000) * sampleRate));
  const releaseSamples = Math.max(1, Math.floor((options.releaseMs / 1000) * sampleRate));

  for (let ch = 0; ch < numberOfChannels; ch++) {
    const inputData = audioBuffer.getChannelData(ch);
    const outputData = outputBuffer.getChannelData(ch);

    let envelope = 0;

    for (let i = 0; i < length; i++) {
      const absVal = Math.abs(inputData[i]);

      if (absVal > threshold) {
        // Attack: open the gate
        envelope += (1 - envelope) / attackSamples;
      } else {
        // Release: close the gate
        envelope -= envelope / releaseSamples;
      }

      envelope = clamp(envelope, 0, 1);
      outputData[i] = inputData[i] * envelope;
    }
  }

  return outputBuffer;
}

export function applyBiquadFilter(
  audioBuffer: AudioBuffer,
  highPassFreq: number,
  lowPassFreq: number
): AudioBuffer {
  const sampleRate = audioBuffer.sampleRate;
  const numberOfChannels = audioBuffer.numberOfChannels;
  const length = audioBuffer.length;

  const offlineCtx = new OfflineAudioContext(numberOfChannels, length, sampleRate);
  const outputBuffer = offlineCtx.createBuffer(numberOfChannels, length, sampleRate);

  for (let ch = 0; ch < numberOfChannels; ch++) {
    const inputData = audioBuffer.getChannelData(ch);
    const outputData = new Float32Array(length);

    // Apply simple high-pass filter
    let filtered = applyHighPass(inputData, highPassFreq, sampleRate);
    // Apply simple low-pass filter
    filtered = applyLowPass(filtered, lowPassFreq, sampleRate);

    outputData.set(filtered);
    outputBuffer.copyToChannel(outputData, ch);
  }

  return outputBuffer;
}

function applyHighPass(data: Float32Array, freq: number, sampleRate: number): Float32Array {
  if (freq <= 0) return data;

  const output = new Float32Array(data.length);
  const rc = 1.0 / (2.0 * Math.PI * freq);
  const dt = 1.0 / sampleRate;
  const alpha = rc / (rc + dt);

  output[0] = data[0];
  for (let i = 1; i < data.length; i++) {
    output[i] = alpha * (output[i - 1] + data[i] - data[i - 1]);
  }

  return output;
}

function applyLowPass(data: Float32Array, freq: number, sampleRate: number): Float32Array {
  if (freq >= sampleRate / 2) return data;

  const output = new Float32Array(data.length);
  const rc = 1.0 / (2.0 * Math.PI * freq);
  const dt = 1.0 / sampleRate;
  const alpha = dt / (rc + dt);

  output[0] = data[0];
  for (let i = 1; i < data.length; i++) {
    output[i] = output[i - 1] + alpha * (data[i] - output[i - 1]);
  }

  return output;
}

export function processAudio(
  audioBuffer: AudioBuffer,
  options: NoiseGateOptions
): AudioBuffer {
  // First apply bandpass filtering
  let processed = applyBiquadFilter(audioBuffer, options.highPassFreq, options.lowPassFreq);
  // Then apply noise gate
  processed = applyNoiseGate(processed, options);
  return processed;
}

export function encodeWav(audioBuffer: AudioBuffer): Blob {
  const numberOfChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const length = audioBuffer.length;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numberOfChannels * bitsPerSample) / 8;
  const blockAlign = (numberOfChannels * bitsPerSample) / 8;
  const dataSize = length * blockAlign;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numberOfChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  const channelData: Float32Array[] = [];
  for (let ch = 0; ch < numberOfChannels; ch++) {
    channelData.push(audioBuffer.getChannelData(ch));
  }

  let offset = 44;
  for (let i = 0; i < length; i++) {
    for (let ch = 0; ch < numberOfChannels; ch++) {
      const sample = Math.max(-1, Math.min(1, channelData[ch][i]));
      const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(offset, intSample, true);
      offset += 2;
    }
  }

  return new Blob([buffer], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, str: string): void {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
