import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { textResult, errorResult } from './helpers';
import { encodeBase64, decodeBase64 } from '../../../../apps/encode-base64-string/src/utils/base64';
import { encodeBase32, decodeBase32 } from '../../../../apps/encode-base32/src/utils/base32';
import {
  textToBinary,
  binaryToText,
  textToHex,
  hexToText,
  textToDecimal,
  decimalToText,
} from '../../../../apps/encode-binary/src/utils/binary';
import {
  encodeHTMLEntities,
  decodeHTMLEntities,
} from '../../../../apps/encode-html-entity/src/utils/htmlEntity';
import { textToMorse, morseToText } from '../../../../apps/encode-morse/src/utils/morse';
import {
  domainToASCII,
  domainFromASCII,
} from '../../../../apps/encode-punycode/src/utils/punycode';
import {
  textToUnicodeEscape,
  unicodeEscapeToText,
} from '../../../../apps/encode-unicode/src/utils/unicode';

function textTool(
  server: McpServer,
  name: string,
  description: string,
  inputName: string,
  inputDesc: string,
  fn: (input: string) => string,
) {
  server.tool(name, description, { [inputName]: z.string().describe(inputDesc) }, async (args) => {
    try {
      return textResult(fn(args[inputName] as string));
    } catch (e) {
      return errorResult(name, e);
    }
  });
}

export function registerEncodeTools(server: McpServer) {
  // Base64
  textTool(server, 'encode_base64', 'Base64 encode', 'text', 'Text to encode', (t) =>
    encodeBase64(t),
  );
  textTool(server, 'decode_base64', 'Base64 decode', 'text', 'Base64 string to decode', (t) =>
    decodeBase64(t),
  );

  // Base32
  textTool(server, 'encode_base32', 'Base32 encode', 'text', 'Text to encode', (t) =>
    encodeBase32(t),
  );
  textTool(server, 'decode_base32', 'Base32 decode', 'text', 'Base32 string to decode', (t) =>
    decodeBase32(t),
  );

  // Binary
  textTool(server, 'encode_binary', 'Text to binary', 'text', 'Text to convert', (t) =>
    textToBinary(t),
  );
  textTool(server, 'decode_binary', 'Binary to text', 'text', 'Binary string', (t) =>
    binaryToText(t),
  );

  // Hex
  textTool(server, 'encode_hex', 'Text to hex', 'text', 'Text to convert', (t) => textToHex(t));
  textTool(server, 'decode_hex', 'Hex to text', 'text', 'Hex string', (t) => hexToText(t));

  // Decimal
  textTool(
    server,
    'encode_decimal',
    'Text to decimal code points',
    'text',
    'Text to convert',
    (t) => textToDecimal(t),
  );
  textTool(
    server,
    'decode_decimal',
    'Decimal code points to text',
    'text',
    'Space-separated decimals',
    (t) => decimalToText(t),
  );

  // HTML Entity
  textTool(
    server,
    'encode_html_entity',
    'Encode HTML special chars',
    'text',
    'Text with HTML chars',
    (t) => encodeHTMLEntities(t),
  );
  textTool(
    server,
    'decode_html_entity',
    'Decode HTML entities',
    'text',
    'Text with HTML entities',
    (t) => decodeHTMLEntities(t),
  );

  // Morse
  textTool(server, 'encode_morse', 'Text to Morse code', 'text', 'Text to convert', (t) =>
    textToMorse(t),
  );
  textTool(server, 'decode_morse', 'Morse code to text', 'text', 'Morse code string', (t) =>
    morseToText(t),
  );

  // Punycode
  textTool(
    server,
    'encode_punycode',
    'Domain to ASCII (Punycode)',
    'domain',
    'Domain name',
    (d) => domainToASCII(d),
  );
  textTool(
    server,
    'decode_punycode',
    'ASCII domain to Unicode',
    'domain',
    'ASCII domain',
    (d) => domainFromASCII(d),
  );

  // Unicode escape
  textTool(
    server,
    'encode_unicode_escape',
    'Text to Unicode escape',
    'text',
    'Text to escape',
    (t) => textToUnicodeEscape(t),
  );
  textTool(
    server,
    'decode_unicode_escape',
    'Unicode escape to text',
    'text',
    'Unicode escape string',
    (t) => unicodeEscapeToText(t),
  );

  // URL
  textTool(server, 'encode_url', 'URL encode', 'text', 'Text to encode', (t) =>
    encodeURIComponent(t),
  );
  textTool(server, 'decode_url', 'URL decode', 'text', 'URL encoded string', (t) =>
    decodeURIComponent(t),
  );
}
