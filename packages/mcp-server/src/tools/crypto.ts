import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  caesarEncrypt,
  caesarDecrypt,
  bruteForce,
} from '../../../../apps/crypto-caesar/src/utils/caesar';
import { rot13, rot18, rot47 } from '../../../../apps/crypto-rot13/src/utils/rot';
import {
  vigenereEncrypt,
  vigenereDecrypt,
} from '../../../../apps/crypto-vigenere/src/utils/vigenere';
import { atbash } from '../../../../apps/crypto-atbash/src/utils/atbash';
import {
  affineEncrypt,
  affineDecrypt,
  isValidA,
} from '../../../../apps/crypto-affine/src/utils/affine';
import {
  railFenceEncrypt,
  railFenceDecrypt,
} from '../../../../apps/crypto-rail-fence/src/utils/railFence';
import { enigmaEncrypt, DEFAULT_CONFIG } from '../../../../apps/enigma-cipher/src/utils/enigma';
import type { EnigmaConfig, RotorName } from '../../../../apps/enigma-cipher/src/utils/enigma';

function textResult(text: string) {
  return { content: [{ type: 'text' as const, text }] };
}

function errorResult(e: unknown) {
  return {
    isError: true,
    content: [
      { type: 'text' as const, text: `Error: ${e instanceof Error ? e.message : String(e)}` },
    ],
  };
}

export function registerCryptoTools(server: McpServer) {
  // Caesar encrypt
  server.tool(
    'cipher_caesar_encrypt',
    'Caesar cipher encrypt',
    {
      text: z.string().describe('Text to encrypt'),
      shift: z.number().describe('Shift amount (0-25)'),
    },
    async (args) => {
      try {
        return textResult(caesarEncrypt(args.text, args.shift));
      } catch (e) {
        return errorResult(e);
      }
    },
  );

  // Caesar decrypt
  server.tool(
    'cipher_caesar_decrypt',
    'Caesar cipher decrypt',
    {
      text: z.string().describe('Text to decrypt'),
      shift: z.number().describe('Shift amount used for encryption'),
    },
    async (args) => {
      try {
        return textResult(caesarDecrypt(args.text, args.shift));
      } catch (e) {
        return errorResult(e);
      }
    },
  );

  // Caesar brute force
  server.tool(
    'cipher_caesar_bruteforce',
    'Caesar cipher brute force (try all 26 shifts)',
    {
      text: z.string().describe('Encrypted text to brute force'),
    },
    async (args) => {
      try {
        return textResult(JSON.stringify(bruteForce(args.text)));
      } catch (e) {
        return errorResult(e);
      }
    },
  );

  // ROT
  server.tool(
    'cipher_rot',
    'ROT13/ROT18/ROT47 rotation cipher',
    {
      text: z.string().describe('Text to transform'),
      variant: z.enum(['rot13', 'rot18', 'rot47']).describe('ROT variant'),
    },
    async (args) => {
      try {
        const fns = { rot13, rot18, rot47 };
        return textResult(fns[args.variant](args.text));
      } catch (e) {
        return errorResult(e);
      }
    },
  );

  // Vigenere encrypt
  server.tool(
    'cipher_vigenere_encrypt',
    'Vigenere cipher encrypt',
    {
      text: z.string().describe('Text to encrypt'),
      key: z.string().describe('Encryption key (alphabetic)'),
    },
    async (args) => {
      try {
        return textResult(vigenereEncrypt(args.text, args.key));
      } catch (e) {
        return errorResult(e);
      }
    },
  );

  // Vigenere decrypt
  server.tool(
    'cipher_vigenere_decrypt',
    'Vigenere cipher decrypt',
    {
      text: z.string().describe('Text to decrypt'),
      key: z.string().describe('Decryption key (alphabetic)'),
    },
    async (args) => {
      try {
        return textResult(vigenereDecrypt(args.text, args.key));
      } catch (e) {
        return errorResult(e);
      }
    },
  );

  // Atbash
  server.tool(
    'cipher_atbash',
    'Atbash cipher (symmetric: A<->Z, B<->Y, ...)',
    {
      text: z.string().describe('Text to transform'),
    },
    async (args) => {
      try {
        return textResult(atbash(args.text));
      } catch (e) {
        return errorResult(e);
      }
    },
  );

  // Affine encrypt
  server.tool(
    'cipher_affine_encrypt',
    'Affine cipher encrypt (E(x) = (a*x + b) mod 26)',
    {
      text: z.string().describe('Text to encrypt'),
      a: z.number().describe('Multiplier (must be coprime with 26)'),
      b: z.number().describe('Shift value'),
    },
    async (args) => {
      try {
        if (!isValidA(args.a)) {
          return {
            isError: true,
            content: [
              {
                type: 'text' as const,
                text: 'Error: "a" must be coprime with 26. Valid values: 1,3,5,7,9,11,15,17,19,21,23,25',
              },
            ],
          };
        }
        return textResult(affineEncrypt(args.text, args.a, args.b));
      } catch (e) {
        return errorResult(e);
      }
    },
  );

  // Affine decrypt
  server.tool(
    'cipher_affine_decrypt',
    'Affine cipher decrypt',
    {
      text: z.string().describe('Text to decrypt'),
      a: z.number().describe('Multiplier used for encryption'),
      b: z.number().describe('Shift value used for encryption'),
    },
    async (args) => {
      try {
        if (!isValidA(args.a)) {
          return {
            isError: true,
            content: [
              {
                type: 'text' as const,
                text: 'Error: "a" must be coprime with 26. Valid values: 1,3,5,7,9,11,15,17,19,21,23,25',
              },
            ],
          };
        }
        return textResult(affineDecrypt(args.text, args.a, args.b));
      } catch (e) {
        return errorResult(e);
      }
    },
  );

  // Rail Fence encrypt
  server.tool(
    'cipher_rail_fence_encrypt',
    'Rail fence cipher encrypt',
    {
      text: z.string().describe('Text to encrypt'),
      rails: z.number().min(2).describe('Number of rails (minimum 2)'),
    },
    async (args) => {
      try {
        return textResult(railFenceEncrypt(args.text, args.rails));
      } catch (e) {
        return errorResult(e);
      }
    },
  );

  // Rail Fence decrypt
  server.tool(
    'cipher_rail_fence_decrypt',
    'Rail fence cipher decrypt',
    {
      text: z.string().describe('Text to decrypt'),
      rails: z.number().min(2).describe('Number of rails used for encryption'),
    },
    async (args) => {
      try {
        return textResult(railFenceDecrypt(args.text, args.rails));
      } catch (e) {
        return errorResult(e);
      }
    },
  );

  // Enigma
  server.tool(
    'cipher_enigma',
    'Enigma machine cipher (symmetric encryption)',
    {
      text: z.string().describe('Text to encrypt/decrypt (uppercase letters)'),
      rotors: z
        .tuple([z.enum(['I', 'II', 'III']), z.enum(['I', 'II', 'III']), z.enum(['I', 'II', 'III'])])
        .optional()
        .describe('Rotor selection [left, middle, right] (default: I, II, III)'),
      positions: z
        .tuple([z.number(), z.number(), z.number()])
        .optional()
        .describe('Initial rotor positions [left, middle, right] (default: 0, 0, 0)'),
    },
    async (args) => {
      try {
        const config: EnigmaConfig = {
          rotors: (args.rotors as [RotorName, RotorName, RotorName]) ?? DEFAULT_CONFIG.rotors,
          positions: (args.positions as [number, number, number]) ?? DEFAULT_CONFIG.positions,
        };
        return textResult(enigmaEncrypt(args.text, config));
      } catch (e) {
        return errorResult(e);
      }
    },
  );
}
