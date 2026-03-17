const BASE = 36;
const TMIN = 1;
const TMAX = 26;
const SKEW = 38;
const DAMP = 700;
const INITIAL_BIAS = 72;
const INITIAL_N = 128;

function adapt(delta: number, numPoints: number, firstTime: boolean): number {
  let d = firstTime ? Math.floor(delta / DAMP) : delta >> 1;
  d += Math.floor(d / numPoints);
  let k = 0;
  while (d > ((BASE - TMIN) * TMAX) >> 1) {
    d = Math.floor(d / (BASE - TMIN));
    k += BASE;
  }
  return k + Math.floor(((BASE - TMIN + 1) * d) / (d + SKEW));
}

function encodeDigit(d: number): number {
  return d + 22 + 75 * (d < 26 ? 1 : 0);
}

export function punycodeEncode(input: string): string {
  const output: number[] = [];
  const codePoints = [...input].map((c) => c.codePointAt(0) ?? 0);
  const basicCPs = codePoints.filter((cp) => cp < 128);

  for (const cp of basicCPs) output.push(cp);
  const basicLength = basicCPs.length;
  if (basicLength > 0) output.push(45); // '-'

  let n = INITIAL_N;
  let delta = 0;
  let bias = INITIAL_BIAS;
  let h = basicLength;

  while (h < codePoints.length) {
    let m = Number.MAX_SAFE_INTEGER;
    for (const cp of codePoints) {
      if (cp >= n && cp < m) m = cp;
    }

    delta += (m - n) * (h + 1);
    n = m;

    for (const cp of codePoints) {
      if (cp < n) delta++;
      if (cp === n) {
        let q = delta;
        let k = BASE;
        while (true) {
          const t = k <= bias ? TMIN : k >= bias + TMAX ? TMAX : k - bias;
          if (q < t) break;
          output.push(encodeDigit(t + ((q - t) % (BASE - t))));
          q = Math.floor((q - t) / (BASE - t));
          k += BASE;
        }
        output.push(encodeDigit(q));
        bias = adapt(delta, h + 1, h === basicLength);
        delta = 0;
        h++;
      }
    }
    delta++;
    n++;
  }

  return String.fromCodePoint(...output);
}

export function domainToASCII(domain: string): string {
  return domain
    .split('.')
    .map((label) => {
      if ([...label].every((c) => c.charCodeAt(0) < 128)) return label;
      return `xn--${punycodeEncode(label)}`;
    })
    .join('.');
}

export function domainFromASCII(domain: string): string {
  return domain
    .split('.')
    .map((label) => {
      if (label.startsWith('xn--')) {
        try {
          const url = new URL(`http://${label}.test`);
          return url.hostname.replace('.test', '');
        } catch {
          return label;
        }
      }
      return label;
    })
    .join('.');
}
