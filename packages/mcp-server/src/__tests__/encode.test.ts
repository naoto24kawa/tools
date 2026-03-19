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

describe('encode tools', () => {
  test('encode_base64', async () => {
    const result = await callTool('encode_base64', { text: 'Hello' });
    expect(result.content).toEqual([{ type: 'text', text: 'SGVsbG8=' }]);
  });

  test('decode_base64', async () => {
    const result = await callTool('decode_base64', { text: 'SGVsbG8=' });
    expect(result.content).toEqual([{ type: 'text', text: 'Hello' }]);
  });

  test('encode_base32 / decode_base32 round trip', async () => {
    const encoded = await callTool('encode_base32', { text: 'Hello' });
    const encodedText = (encoded.content as Array<{ type: string; text: string }>)[0].text;
    const decoded = await callTool('decode_base32', { text: encodedText });
    expect(decoded.content).toEqual([{ type: 'text', text: 'Hello' }]);
  });

  test('encode_binary', async () => {
    const result = await callTool('encode_binary', { text: 'AB' });
    expect(result.content).toEqual([{ type: 'text', text: '01000001 01000010' }]);
  });

  test('decode_binary', async () => {
    const result = await callTool('decode_binary', { text: '01000001 01000010' });
    expect(result.content).toEqual([{ type: 'text', text: 'AB' }]);
  });

  test('encode_hex', async () => {
    const result = await callTool('encode_hex', { text: 'AB' });
    expect(result.content).toEqual([{ type: 'text', text: '41 42' }]);
  });

  test('decode_hex', async () => {
    const result = await callTool('decode_hex', { text: '41 42' });
    expect(result.content).toEqual([{ type: 'text', text: 'AB' }]);
  });

  test('encode_decimal', async () => {
    const result = await callTool('encode_decimal', { text: 'AB' });
    expect(result.content).toEqual([{ type: 'text', text: '65 66' }]);
  });

  test('decode_decimal', async () => {
    const result = await callTool('decode_decimal', { text: '65 66' });
    expect(result.content).toEqual([{ type: 'text', text: 'AB' }]);
  });

  test('encode_html_entity', async () => {
    const result = await callTool('encode_html_entity', { text: '<div>' });
    expect(result.content).toEqual([{ type: 'text', text: '&lt;div&gt;' }]);
  });

  test('decode_html_entity', async () => {
    const result = await callTool('decode_html_entity', { text: '&lt;div&gt;' });
    expect(result.content).toEqual([{ type: 'text', text: '<div>' }]);
  });

  test('encode_morse', async () => {
    const result = await callTool('encode_morse', { text: 'SOS' });
    expect(result.content).toEqual([{ type: 'text', text: '... --- ...' }]);
  });

  test('decode_morse', async () => {
    const result = await callTool('decode_morse', { text: '... --- ...' });
    expect(result.content).toEqual([{ type: 'text', text: 'SOS' }]);
  });

  test('encode_punycode', async () => {
    const result = await callTool('encode_punycode', { domain: 'example.com' });
    expect(result.content).toEqual([{ type: 'text', text: 'example.com' }]);
  });

  test('encode_unicode_escape', async () => {
    const result = await callTool('encode_unicode_escape', { text: 'A' });
    expect(result.content).toEqual([{ type: 'text', text: '\\u0041' }]);
  });

  test('decode_unicode_escape', async () => {
    const result = await callTool('decode_unicode_escape', { text: '\\u0041' });
    expect(result.content).toEqual([{ type: 'text', text: 'A' }]);
  });

  test('encode_url', async () => {
    const result = await callTool('encode_url', { text: 'hello world' });
    expect(result.content).toEqual([{ type: 'text', text: 'hello%20world' }]);
  });

  test('decode_url', async () => {
    const result = await callTool('decode_url', { text: 'hello%20world' });
    expect(result.content).toEqual([{ type: 'text', text: 'hello world' }]);
  });

  test('decode_base64 error returns isError', async () => {
    const result = await callTool('decode_base64', { text: '!!!invalid!!!' });
    expect(result.isError).toBe(true);
  });

  test('decode_url error on malformed percent encoding', async () => {
    const result = await callTool('decode_url', { text: '%GG' });
    expect(result.isError).toBe(true);
  });
});
