import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { md5 } from '../../../../apps/hash-md5/src/utils/md5';
import { crc32 } from '../../../../apps/hash-crc32/src/utils/crc32';
import { generateSHA1 } from '../../../../apps/hash-sha1/src/utils/sha1';
import { generateSHA } from '../../../../apps/hash-sha256/src/utils/sha';
import type { HashAlgorithm } from '../../../../apps/hash-sha256/src/utils/sha';
import { generateHMAC } from '../../../../apps/hash-hmac/src/utils/hmac';
import type { HmacAlgorithm } from '../../../../apps/hash-hmac/src/utils/hmac';

export function registerHashTools(server: McpServer) {
  // MD5
  server.tool(
    'hash_md5',
    'Compute MD5 hash',
    { text: z.string().describe('Text to hash') },
    async (args) => {
      try {
        return { content: [{ type: 'text' as const, text: md5(args.text) }] };
      } catch (e) {
        return {
          isError: true,
          content: [
            { type: 'text' as const, text: `Error: ${e instanceof Error ? e.message : String(e)}` },
          ],
        };
      }
    },
  );

  // CRC32
  server.tool(
    'hash_crc32',
    'Compute CRC32 checksum',
    { text: z.string().describe('Text to hash') },
    async (args) => {
      try {
        return { content: [{ type: 'text' as const, text: crc32(args.text) }] };
      } catch (e) {
        return {
          isError: true,
          content: [
            { type: 'text' as const, text: `Error: ${e instanceof Error ? e.message : String(e)}` },
          ],
        };
      }
    },
  );

  // SHA-1
  server.tool(
    'hash_sha1',
    'Compute SHA-1 hash',
    { text: z.string().describe('Text to hash') },
    async (args) => {
      try {
        const hash = await generateSHA1(args.text);
        return { content: [{ type: 'text' as const, text: hash }] };
      } catch (e) {
        return {
          isError: true,
          content: [
            { type: 'text' as const, text: `Error: ${e instanceof Error ? e.message : String(e)}` },
          ],
        };
      }
    },
  );

  // SHA-256/384/512
  server.tool(
    'hash_sha',
    'Compute SHA-256/384/512 hash',
    {
      text: z.string().describe('Text to hash'),
      algorithm: z
        .enum(['SHA-256', 'SHA-384', 'SHA-512'])
        .describe('Hash algorithm'),
    },
    async (args) => {
      try {
        const hash = await generateSHA(args.text, args.algorithm as HashAlgorithm);
        return { content: [{ type: 'text' as const, text: hash }] };
      } catch (e) {
        return {
          isError: true,
          content: [
            { type: 'text' as const, text: `Error: ${e instanceof Error ? e.message : String(e)}` },
          ],
        };
      }
    },
  );

  // HMAC
  server.tool(
    'hash_hmac',
    'Compute HMAC authentication code',
    {
      message: z.string().describe('Message to authenticate'),
      secret: z.string().describe('Secret key'),
      algorithm: z
        .enum(['SHA-256', 'SHA-384', 'SHA-512', 'SHA-1'])
        .describe('HMAC algorithm'),
    },
    async (args) => {
      try {
        const hmac = await generateHMAC(
          args.message,
          args.secret,
          args.algorithm as HmacAlgorithm,
        );
        return { content: [{ type: 'text' as const, text: hmac }] };
      } catch (e) {
        return {
          isError: true,
          content: [
            { type: 'text' as const, text: `Error: ${e instanceof Error ? e.message : String(e)}` },
          ],
        };
      }
    },
  );
}
