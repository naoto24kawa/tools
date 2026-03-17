export async function getWebcamStream(): Promise<MediaStream> {
  return navigator.mediaDevices.getUserMedia({ video: true, audio: false });
}

export function getVideoInfo(video: HTMLVideoElement): Record<string, string> {
  return {
    Resolution: `${video.videoWidth} x ${video.videoHeight}`,
    'Ready State': String(video.readyState),
  };
}
