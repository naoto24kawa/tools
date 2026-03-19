import { describe, test, expect } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { createMcpServer } from '../mcp';

async function callTool(name: string, args: Record<string, unknown>) {
  const server = createMcpServer();
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await server.connect(serverTransport);
  const client = new Client({ name: 'test', version: '1.0.0' });
  await client.connect(clientTransport);
  return client.callTool({ name, arguments: args });
}

describe('text tools', () => {
  test('text_analyze returns all fields', async () => {
    const result = await callTool('text_analyze', { text: 'Hello World' });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;
    const stats = JSON.parse(text);
    expect(stats.charsWithSpaces).toBe(11);
    expect(stats.charsWithoutSpaces).toBe(10);
    expect(stats.words).toBe(2);
    expect(stats.lines).toBe(1);
    expect(stats.paragraphs).toBe(1);
    expect(stats).toHaveProperty('bytes');
    expect(stats).toHaveProperty('readingTimeMinutes');
  });

  test('text_analyze with Japanese', async () => {
    const result = await callTool('text_analyze', { text: 'こんにちは世界', language: 'ja' });
    const stats = JSON.parse((result.content as Array<{ type: string; text: string }>)[0].text);
    expect(stats.charsWithSpaces).toBe(7);
  });

  test('text_deduplicate removes duplicates', async () => {
    const result = await callTool('text_deduplicate', { text: 'a\nb\na\nc\nb' });
    expect(result.content).toEqual([{ type: 'text', text: 'a\nb\nc' }]);
  });

  test('text_deduplicate case insensitive', async () => {
    const result = await callTool('text_deduplicate', {
      text: 'Hello\nhello\nHELLO',
      caseSensitive: false,
    });
    expect(result.content).toEqual([{ type: 'text', text: 'Hello' }]);
  });

  test('text_deduplicate keeps empty lines by default', async () => {
    const result = await callTool('text_deduplicate', { text: 'a\n\nb\n\na' });
    const text = (result.content as Array<{ type: string; text: string }>)[0].text;
    expect(text).toContain('\n\n');
  });
});
