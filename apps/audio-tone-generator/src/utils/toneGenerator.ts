export type WaveformType = 'sine' | 'square' | 'sawtooth' | 'triangle';

export interface ToneConfig {
  frequency: number;
  waveform: WaveformType;
  duration: number;
  volume: number;
}

export const WAVEFORM_TYPES: { value: WaveformType; label: string }[] = [
  { value: 'sine', label: 'Sine' },
  { value: 'square', label: 'Square' },
  { value: 'sawtooth', label: 'Sawtooth' },
  { value: 'triangle', label: 'Triangle' },
];

export const MIN_FREQUENCY = 20;
export const MAX_FREQUENCY = 20000;
export const DEFAULT_FREQUENCY = 440;
export const DEFAULT_DURATION = 1;
export const DEFAULT_VOLUME = 0.5;

export function clampFrequency(frequency: number): number {
  return Math.max(MIN_FREQUENCY, Math.min(MAX_FREQUENCY, frequency));
}

export function clampVolume(volume: number): number {
  return Math.max(0, Math.min(1, volume));
}

export function clampDuration(duration: number): number {
  return Math.max(0.1, Math.min(30, duration));
}

export function isValidFrequency(value: number): boolean {
  return !isNaN(value) && value >= MIN_FREQUENCY && value <= MAX_FREQUENCY;
}

export function isValidWaveform(value: string): value is WaveformType {
  return ['sine', 'square', 'sawtooth', 'triangle'].includes(value);
}

export function frequencyToNote(frequency: number): string {
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const a4 = 440;
  const semitones = 12 * Math.log2(frequency / a4);
  const noteIndex = Math.round(semitones) + 69;
  const octave = Math.floor(noteIndex / 12) - 1;
  const note = noteNames[((noteIndex % 12) + 12) % 12];
  const cents = Math.round((semitones - Math.round(semitones)) * 100);
  const centsStr = cents >= 0 ? `+${cents}` : `${cents}`;
  return `${note}${octave} (${centsStr} cents)`;
}

export function createToneNodes(
  audioContext: AudioContext,
  config: ToneConfig
): { oscillator: OscillatorNode; gainNode: GainNode } {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = config.waveform;
  oscillator.frequency.setValueAtTime(config.frequency, audioContext.currentTime);
  gainNode.gain.setValueAtTime(config.volume, audioContext.currentTime);

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  return { oscillator, gainNode };
}
