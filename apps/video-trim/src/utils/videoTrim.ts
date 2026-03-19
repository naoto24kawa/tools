export interface TrimOptions {
  startTime: number;
  endTime: number;
  mimeType?: string;
  videoBitsPerSecond?: number;
}

export function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.round((seconds % 1) * 100);
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
  }
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
}

export function parseTime(timeStr: string): number {
  const parts = timeStr.split(':');
  if (parts.length === 3) {
    const [h, m, s] = parts;
    return Number(h) * 3600 + Number(m) * 60 + Number(s);
  }
  if (parts.length === 2) {
    const [m, s] = parts;
    return Number(m) * 60 + Number(s);
  }
  return Number(timeStr) || 0;
}

export function validateTrimRange(
  startTime: number,
  endTime: number,
  duration: number
): { valid: boolean; error?: string } {
  if (startTime < 0) {
    return { valid: false, error: 'Start time cannot be negative' };
  }
  if (endTime <= startTime) {
    return { valid: false, error: 'End time must be greater than start time' };
  }
  if (endTime > duration) {
    return { valid: false, error: 'End time exceeds video duration' };
  }
  if (endTime - startTime < 0.1) {
    return { valid: false, error: 'Trimmed duration must be at least 0.1 seconds' };
  }
  return { valid: true };
}

export function getOutputFileName(originalName: string, suffix: string = 'trimmed'): string {
  const dotIndex = originalName.lastIndexOf('.');
  if (dotIndex === -1) {
    return `${originalName}_${suffix}`;
  }
  const name = originalName.substring(0, dotIndex);
  return `${name}_${suffix}.webm`;
}

export function getSupportedMimeType(): string {
  const types = [
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm',
    'video/mp4',
  ];
  for (const type of types) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }
  return 'video/webm';
}

export async function trimVideo(
  videoElement: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  options: TrimOptions,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const { startTime, endTime } = options;
  const mimeType = options.mimeType || getSupportedMimeType();
  const duration = endTime - startTime;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Cannot get canvas 2d context');
  }

  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;

  const stream = canvas.captureStream(30);

  // Add audio track if the video has audio
  try {
    const audioCtx = new AudioContext();
    const source = audioCtx.createMediaElementSource(videoElement);
    const dest = audioCtx.createMediaStreamDestination();
    source.connect(dest);
    source.connect(audioCtx.destination);
    dest.stream.getAudioTracks().forEach((track) => {
      stream.addTrack(track);
    });
  } catch {
    // No audio or audio capture not supported
  }

  const recorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: options.videoBitsPerSecond || 2_500_000,
  });

  const chunks: Blob[] = [];

  return new Promise<Blob>((resolve, reject) => {
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType });
      resolve(blob);
    };

    recorder.onerror = () => {
      reject(new Error('MediaRecorder error'));
    };

    videoElement.currentTime = startTime;

    videoElement.onseeked = () => {
      recorder.start();
      videoElement.play();

      const drawFrame = () => {
        if (videoElement.currentTime >= endTime || videoElement.paused || videoElement.ended) {
          videoElement.pause();
          recorder.stop();
          return;
        }

        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

        if (onProgress) {
          const elapsed = videoElement.currentTime - startTime;
          onProgress(Math.min(elapsed / duration, 1));
        }

        requestAnimationFrame(drawFrame);
      };

      requestAnimationFrame(drawFrame);
    };
  });
}
