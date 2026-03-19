export type OutputFormat = 'wav' | 'webm' | 'ogg';

export interface ConvertOptions {
  format: OutputFormat;
  sampleRate: number;
  bitRate: number;
}

export const FORMAT_OPTIONS: { value: OutputFormat; label: string; mimeType: string }[] = [
  { value: 'wav', label: 'WAV (PCM)', mimeType: 'audio/wav' },
  { value: 'webm', label: 'WebM (Opus)', mimeType: 'audio/webm;codecs=opus' },
  { value: 'ogg', label: 'OGG (Opus)', mimeType: 'audio/ogg;codecs=opus' },
];

export const SAMPLE_RATES = [8000, 16000, 22050, 44100, 48000];

export const BIT_RATES = [64, 96, 128, 192, 256, 320];

export function getDefaultOptions(): ConvertOptions {
  return {
    format: 'wav',
    sampleRate: 44100,
    bitRate: 128,
  };
}

export function getMimeType(format: OutputFormat): string {
  const found = FORMAT_OPTIONS.find((f) => f.value === format);
  return found?.mimeType ?? 'audio/wav';
}

export function getFileExtension(format: OutputFormat): string {
  return format;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export async function decodeAudioFile(file: File): Promise<AudioBuffer> {
  const arrayBuffer = await file.arrayBuffer();
  const audioContext = new AudioContext();
  try {
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer;
  } finally {
    await audioContext.close();
  }
}

export function encodeWav(audioBuffer: AudioBuffer, targetSampleRate: number): Blob {
  const resampledBuffer = resampleBuffer(audioBuffer, targetSampleRate);
  const numberOfChannels = resampledBuffer.numberOfChannels;
  const length = resampledBuffer.length;
  const bitsPerSample = 16;
  const byteRate = (targetSampleRate * numberOfChannels * bitsPerSample) / 8;
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
  view.setUint32(24, targetSampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  const channels: Float32Array[] = [];
  for (let ch = 0; ch < numberOfChannels; ch++) {
    channels.push(resampledBuffer.getChannelData(ch));
  }

  let offset = 44;
  for (let i = 0; i < length; i++) {
    for (let ch = 0; ch < numberOfChannels; ch++) {
      const sample = Math.max(-1, Math.min(1, channels[ch][i]));
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

function resampleBuffer(audioBuffer: AudioBuffer, targetSampleRate: number): AudioBuffer {
  if (audioBuffer.sampleRate === targetSampleRate) {
    return audioBuffer;
  }

  const ratio = audioBuffer.sampleRate / targetSampleRate;
  const newLength = Math.round(audioBuffer.length / ratio);
  const offlineCtx = new OfflineAudioContext(
    audioBuffer.numberOfChannels,
    newLength,
    targetSampleRate
  );

  const channels: Float32Array[] = [];
  for (let ch = 0; ch < audioBuffer.numberOfChannels; ch++) {
    const oldData = audioBuffer.getChannelData(ch);
    const newData = new Float32Array(newLength);
    for (let i = 0; i < newLength; i++) {
      const srcIndex = i * ratio;
      const srcIndexFloor = Math.floor(srcIndex);
      const srcIndexCeil = Math.min(srcIndexFloor + 1, oldData.length - 1);
      const frac = srcIndex - srcIndexFloor;
      newData[i] = oldData[srcIndexFloor] * (1 - frac) + oldData[srcIndexCeil] * frac;
    }
    channels.push(newData);
  }

  const newBuffer = offlineCtx.createBuffer(
    audioBuffer.numberOfChannels,
    newLength,
    targetSampleRate
  );
  for (let ch = 0; ch < audioBuffer.numberOfChannels; ch++) {
    newBuffer.copyToChannel(channels[ch], ch);
  }

  return newBuffer;
}

export async function encodeWithMediaRecorder(
  audioBuffer: AudioBuffer,
  mimeType: string,
  bitRate: number
): Promise<Blob> {
  const offlineCtx = new OfflineAudioContext(
    audioBuffer.numberOfChannels,
    audioBuffer.length,
    audioBuffer.sampleRate
  );

  const source = offlineCtx.createBufferSource();
  source.buffer = audioBuffer;

  const dest = offlineCtx.createMediaStreamDestination();
  source.connect(dest);
  source.start(0);

  const actualCtx = new AudioContext();
  const actualSource = actualCtx.createBufferSource();
  actualSource.buffer = audioBuffer;
  const actualDest = actualCtx.createMediaStreamDestination();
  actualSource.connect(actualDest);
  actualSource.start(0);

  return new Promise<Blob>((resolve, reject) => {
    const chunks: Blob[] = [];

    let recorderMimeType = mimeType;
    if (!MediaRecorder.isTypeSupported(recorderMimeType)) {
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        recorderMimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/webm')) {
        recorderMimeType = 'audio/webm';
      } else if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
        recorderMimeType = 'audio/ogg;codecs=opus';
      } else {
        reject(
          new Error(
            'MediaRecorder does not support the requested format. Try WAV format instead.'
          )
        );
        return;
      }
    }

    const recorder = new MediaRecorder(actualDest.stream, {
      mimeType: recorderMimeType,
      audioBitsPerSecond: bitRate * 1000,
    });

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    recorder.onstop = () => {
      actualCtx.close();
      const blob = new Blob(chunks, { type: recorderMimeType });
      resolve(blob);
    };

    recorder.onerror = () => {
      actualCtx.close();
      reject(new Error('Recording failed'));
    };

    recorder.start();

    const durationMs = (audioBuffer.length / audioBuffer.sampleRate) * 1000;
    setTimeout(() => {
      if (recorder.state === 'recording') {
        recorder.stop();
      }
    }, durationMs + 500);
  });
}

export async function convertAudio(
  file: File,
  options: ConvertOptions
): Promise<{ blob: Blob; duration: number }> {
  const audioBuffer = await decodeAudioFile(file);

  let blob: Blob;
  if (options.format === 'wav') {
    blob = encodeWav(audioBuffer, options.sampleRate);
  } else {
    const mimeType = getMimeType(options.format);
    blob = await encodeWithMediaRecorder(audioBuffer, mimeType, options.bitRate);
  }

  return { blob, duration: audioBuffer.duration };
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

export function getOutputFileName(originalName: string, format: OutputFormat): string {
  const baseName = originalName.replace(/\.[^.]+$/, '');
  return `${baseName}.${getFileExtension(format)}`;
}
