export interface TimeSignature {
  beats: number;
  noteValue: number;
  label: string;
}

export const TIME_SIGNATURES: TimeSignature[] = [
  { beats: 2, noteValue: 4, label: '2/4' },
  { beats: 3, noteValue: 4, label: '3/4' },
  { beats: 4, noteValue: 4, label: '4/4' },
  { beats: 6, noteValue: 8, label: '6/8' },
];

export const MIN_BPM = 40;
export const MAX_BPM = 240;
export const DEFAULT_BPM = 120;

export function clampBpm(bpm: number): number {
  return Math.max(MIN_BPM, Math.min(MAX_BPM, bpm));
}

export function isValidBpm(bpm: number): boolean {
  return !isNaN(bpm) && bpm >= MIN_BPM && bpm <= MAX_BPM;
}

export function bpmToIntervalMs(bpm: number): number {
  return (60 / bpm) * 1000;
}

export function findTimeSignature(label: string): TimeSignature {
  return TIME_SIGNATURES.find((ts) => ts.label === label) ?? TIME_SIGNATURES[2];
}

export function playClick(
  audioContext: AudioContext,
  isAccent: boolean,
  time?: number
): void {
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();

  osc.connect(gain);
  gain.connect(audioContext.destination);

  osc.frequency.value = isAccent ? 1000 : 800;
  gain.gain.value = isAccent ? 0.8 : 0.4;

  const startTime = time ?? audioContext.currentTime;
  osc.start(startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.1);
  osc.stop(startTime + 0.1);
}

export function getNextBeatIndex(current: number, totalBeats: number): number {
  return (current + 1) % totalBeats;
}

export function isAccentBeat(beatIndex: number): boolean {
  return beatIndex === 0;
}
