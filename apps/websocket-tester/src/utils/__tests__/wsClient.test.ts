import { describe, it, expect } from 'vitest';
import {
  isValidWsUrl,
  formatTimestamp,
  createSystemMessage,
  createSentMessage,
  createReceivedMessage,
  generateMessageId,
} from '../wsClient';

describe('isValidWsUrl', () => {
  it('accepts ws:// URLs', () => {
    expect(isValidWsUrl('ws://example.com')).toBe(true);
    expect(isValidWsUrl('ws://localhost:8080')).toBe(true);
  });

  it('accepts wss:// URLs', () => {
    expect(isValidWsUrl('wss://example.com')).toBe(true);
    expect(isValidWsUrl('wss://echo.websocket.org')).toBe(true);
  });

  it('rejects non-websocket URLs', () => {
    expect(isValidWsUrl('http://example.com')).toBe(false);
    expect(isValidWsUrl('https://example.com')).toBe(false);
    expect(isValidWsUrl('not a url')).toBe(false);
    expect(isValidWsUrl('')).toBe(false);
  });
});

describe('formatTimestamp', () => {
  it('formats a date with time and milliseconds', () => {
    const date = new Date('2024-01-01T12:34:56.789Z');
    const formatted = formatTimestamp(date);
    expect(formatted).toContain(':');
    expect(formatted.length).toBeGreaterThan(5);
  });
});

describe('createSystemMessage', () => {
  it('creates a system message', () => {
    const msg = createSystemMessage('Connected');
    expect(msg.direction).toBe('system');
    expect(msg.content).toBe('Connected');
    expect(msg.id).toBeTruthy();
    expect(msg.timestamp).toBeInstanceOf(Date);
  });
});

describe('createSentMessage', () => {
  it('creates a sent message', () => {
    const msg = createSentMessage('hello');
    expect(msg.direction).toBe('sent');
    expect(msg.content).toBe('hello');
  });
});

describe('createReceivedMessage', () => {
  it('creates a received message', () => {
    const msg = createReceivedMessage('world');
    expect(msg.direction).toBe('received');
    expect(msg.content).toBe('world');
  });
});

describe('generateMessageId', () => {
  it('generates unique IDs', () => {
    const id1 = generateMessageId();
    const id2 = generateMessageId();
    expect(id1).not.toBe(id2);
  });
});
