import { describe, expect, it, vi, beforeEach } from 'vitest';
import { createUtterance } from '../speechSynthesis';

// Mock SpeechSynthesisUtterance
class MockUtterance {
  text: string;
  voice: SpeechSynthesisVoice | null = null;
  rate = 1;
  pitch = 1;
  constructor(text: string) {
    this.text = text;
  }
}

beforeEach(() => {
  vi.stubGlobal('SpeechSynthesisUtterance', MockUtterance);
});

describe('createUtterance', () => {
  it('creates utterance with text', () => {
    const utterance = createUtterance({
      text: 'Hello world',
      voice: null,
      rate: 1,
      pitch: 1,
    });
    expect(utterance.text).toBe('Hello world');
  });

  it('clamps rate to valid range', () => {
    const utterance = createUtterance({
      text: 'Test',
      voice: null,
      rate: 3,
      pitch: 1,
    });
    expect(utterance.rate).toBe(2);

    const utterance2 = createUtterance({
      text: 'Test',
      voice: null,
      rate: 0.1,
      pitch: 1,
    });
    expect(utterance2.rate).toBe(0.5);
  });

  it('clamps pitch to valid range', () => {
    const utterance = createUtterance({
      text: 'Test',
      voice: null,
      rate: 1,
      pitch: 3,
    });
    expect(utterance.pitch).toBe(2);

    const utterance2 = createUtterance({
      text: 'Test',
      voice: null,
      rate: 1,
      pitch: 0.1,
    });
    expect(utterance2.pitch).toBe(0.5);
  });

  it('sets voice when provided', () => {
    const mockVoice = { name: 'Test Voice' } as SpeechSynthesisVoice;
    const utterance = createUtterance({
      text: 'Test',
      voice: mockVoice,
      rate: 1,
      pitch: 1,
    });
    expect(utterance.voice).toBe(mockVoice);
  });
});
