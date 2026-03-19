export interface SpeechOptions {
  text: string;
  voice: SpeechSynthesisVoice | null;
  rate: number;
  pitch: number;
}

/**
 * Get available voices from the browser.
 */
export function getVoices(): SpeechSynthesisVoice[] {
  return window.speechSynthesis.getVoices();
}

/**
 * Create a SpeechSynthesisUtterance with the given options.
 */
export function createUtterance(options: SpeechOptions): SpeechSynthesisUtterance {
  const utterance = new SpeechSynthesisUtterance(options.text);

  if (options.voice) {
    utterance.voice = options.voice;
  }

  utterance.rate = Math.max(0.5, Math.min(2, options.rate));
  utterance.pitch = Math.max(0.5, Math.min(2, options.pitch));

  return utterance;
}

/**
 * Speak the given text with options.
 */
export function speak(options: SpeechOptions): SpeechSynthesisUtterance {
  window.speechSynthesis.cancel();
  const utterance = createUtterance(options);
  window.speechSynthesis.speak(utterance);
  return utterance;
}

/**
 * Pause speech synthesis.
 */
export function pause(): void {
  window.speechSynthesis.pause();
}

/**
 * Resume speech synthesis.
 */
export function resume(): void {
  window.speechSynthesis.resume();
}

/**
 * Stop speech synthesis.
 */
export function stop(): void {
  window.speechSynthesis.cancel();
}

/**
 * Check if speech synthesis is currently speaking.
 */
export function isSpeaking(): boolean {
  return window.speechSynthesis.speaking;
}

/**
 * Check if speech synthesis is paused.
 */
export function isPaused(): boolean {
  return window.speechSynthesis.paused;
}
