export interface AudioTrack {
  id: string;
  file: File;
  name: string;
  duration: number;
  sampleRate: number;
  channels: number;
  buffer: AudioBuffer;
}

export interface MergeOptions {
  gapSeconds: number;
  crossfadeSeconds: number;
  outputSampleRate: number;
}

export function getDefaultMergeOptions(): MergeOptions {
  return {
    gapSeconds: 0,
    crossfadeSeconds: 0,
    outputSampleRate: 44100,
  };
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
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

export function moveTrack(
  tracks: AudioTrack[],
  index: number,
  direction: 'up' | 'down'
): AudioTrack[] {
  const newTracks = [...tracks];
  const targetIndex = direction === 'up' ? index - 1 : index + 1;

  if (targetIndex < 0 || targetIndex >= newTracks.length) {
    return newTracks;
  }

  const temp = newTracks[targetIndex];
  newTracks[targetIndex] = newTracks[index];
  newTracks[index] = temp;

  return newTracks;
}

export function removeTrack(tracks: AudioTrack[], index: number): AudioTrack[] {
  return tracks.filter((_, i) => i !== index);
}

export function calculateTotalDuration(tracks: AudioTrack[], options: MergeOptions): number {
  if (tracks.length === 0) return 0;

  let total = 0;
  for (let i = 0; i < tracks.length; i++) {
    total += tracks[i].duration;
    if (i < tracks.length - 1) {
      if (options.crossfadeSeconds > 0) {
        total -= options.crossfadeSeconds;
      } else {
        total += options.gapSeconds;
      }
    }
  }
  return Math.max(0, total);
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

export function mergeAudioBuffers(
  tracks: AudioTrack[],
  options: MergeOptions
): AudioBuffer {
  if (tracks.length === 0) {
    throw new Error('No tracks to merge');
  }

  const sampleRate = options.outputSampleRate;
  const maxChannels = Math.max(...tracks.map((t) => t.buffer.numberOfChannels));
  const totalDuration = calculateTotalDuration(tracks, options);
  const totalSamples = Math.ceil(totalDuration * sampleRate);

  const offlineCtx = new OfflineAudioContext(maxChannels, totalSamples, sampleRate);
  const outputBuffer = offlineCtx.createBuffer(maxChannels, totalSamples, sampleRate);

  const channels: Float32Array[] = [];
  for (let ch = 0; ch < maxChannels; ch++) {
    channels.push(outputBuffer.getChannelData(ch));
  }

  let writeOffset = 0;

  for (let i = 0; i < tracks.length; i++) {
    const track = tracks[i];
    const trackBuffer = resampleBuffer(track.buffer, sampleRate);
    const trackSamples = trackBuffer.length;

    for (let ch = 0; ch < maxChannels; ch++) {
      const sourceChannel = ch < trackBuffer.numberOfChannels ? ch : 0;
      const sourceData = trackBuffer.getChannelData(sourceChannel);
      const targetData = channels[ch];

      for (let s = 0; s < trackSamples; s++) {
        const targetPos = writeOffset + s;
        if (targetPos >= 0 && targetPos < totalSamples) {
          let sample = sourceData[s];

          // Apply crossfade
          if (options.crossfadeSeconds > 0 && i > 0) {
            const crossfadeSamples = Math.floor(options.crossfadeSeconds * sampleRate);
            if (s < crossfadeSamples) {
              const fadeIn = s / crossfadeSamples;
              sample *= fadeIn;
            }
          }

          if (options.crossfadeSeconds > 0 && i < tracks.length - 1) {
            const crossfadeSamples = Math.floor(options.crossfadeSeconds * sampleRate);
            const fadeStart = trackSamples - crossfadeSamples;
            if (s >= fadeStart) {
              const fadeOut = (trackSamples - s) / crossfadeSamples;
              sample *= fadeOut;
            }
          }

          targetData[targetPos] += sample;
        }
      }
    }

    writeOffset += trackSamples;
    if (i < tracks.length - 1) {
      if (options.crossfadeSeconds > 0) {
        writeOffset -= Math.floor(options.crossfadeSeconds * sampleRate);
      } else {
        writeOffset += Math.floor(options.gapSeconds * sampleRate);
      }
    }
  }

  // Clamp values to [-1, 1]
  for (let ch = 0; ch < maxChannels; ch++) {
    const data = channels[ch];
    for (let s = 0; s < totalSamples; s++) {
      data[s] = Math.max(-1, Math.min(1, data[s]));
    }
  }

  return outputBuffer;
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
  const newBuffer = offlineCtx.createBuffer(
    audioBuffer.numberOfChannels,
    newLength,
    targetSampleRate
  );

  for (let ch = 0; ch < audioBuffer.numberOfChannels; ch++) {
    const oldData = audioBuffer.getChannelData(ch);
    const newData = newBuffer.getChannelData(ch);
    for (let i = 0; i < newLength; i++) {
      const srcIndex = i * ratio;
      const srcFloor = Math.floor(srcIndex);
      const srcCeil = Math.min(srcFloor + 1, oldData.length - 1);
      const frac = srcIndex - srcFloor;
      newData[i] = oldData[srcFloor] * (1 - frac) + oldData[srcCeil] * frac;
    }
  }

  return newBuffer;
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
