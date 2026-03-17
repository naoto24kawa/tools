export function uuencode(input: string): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(input);
  const lines: string[] = ['begin 644 data'];

  for (let offset = 0; offset < bytes.length; offset += 45) {
    const chunk = bytes.slice(offset, Math.min(offset + 45, bytes.length));
    const len = chunk.length;
    let line = String.fromCharCode(len + 32);

    for (let j = 0; j < chunk.length; j += 3) {
      const b1 = chunk[j] ?? 0;
      const b2 = chunk[j + 1] ?? 0;
      const b3 = chunk[j + 2] ?? 0;
      line += String.fromCharCode(((b1 >> 2) & 0x3f) + 32);
      line += String.fromCharCode((((b1 << 4) | (b2 >> 4)) & 0x3f) + 32);
      line += String.fromCharCode((((b2 << 2) | (b3 >> 6)) & 0x3f) + 32);
      line += String.fromCharCode((b3 & 0x3f) + 32);
    }
    lines.push(line);
  }

  lines.push('`');
  lines.push('end');
  return lines.join('\n');
}

export function uudecode(input: string): string {
  const lines = input.split('\n');
  const allBytes: number[] = [];

  let started = false;
  for (const line of lines) {
    if (line.startsWith('begin ')) {
      started = true;
      continue;
    }
    if (!started || line === '`' || line === 'end' || line.length === 0) continue;

    const expectedLen = line.charCodeAt(0) - 32;
    if (expectedLen <= 0) continue;

    const decoded: number[] = [];
    const chars = line.slice(1);
    for (let i = 0; i < chars.length; i += 4) {
      const c1 = (chars.charCodeAt(i) - 32) & 0x3f;
      const c2 = (chars.charCodeAt(i + 1) - 32) & 0x3f;
      const c3 = (chars.charCodeAt(i + 2) - 32) & 0x3f;
      const c4 = (chars.charCodeAt(i + 3) - 32) & 0x3f;
      decoded.push((c1 << 2) | (c2 >> 4));
      decoded.push(((c2 << 4) | (c3 >> 2)) & 0xff);
      decoded.push(((c3 << 6) | c4) & 0xff);
    }
    allBytes.push(...decoded.slice(0, expectedLen));
  }

  return new TextDecoder().decode(new Uint8Array(allBytes));
}
