export interface SemVer {
  major: number;
  minor: number;
  patch: number;
  prerelease?: string;
  build?: string;
}

const SEMVER_REGEX =
  /^v?(\d+)\.(\d+)\.(\d+)(?:-([\w.]+))?(?:\+([\w.]+))?$/;

export function parse(version: string): SemVer | null {
  const match = version.trim().match(SEMVER_REGEX);
  if (!match) return null;

  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
    prerelease: match[4] || undefined,
    build: match[5] || undefined,
  };
}

export function format(version: SemVer): string {
  let result = `${version.major}.${version.minor}.${version.patch}`;
  if (version.prerelease) {
    result += `-${version.prerelease}`;
  }
  if (version.build) {
    result += `+${version.build}`;
  }
  return result;
}

export function isValid(version: string): boolean {
  return parse(version) !== null;
}

/**
 * Compare two versions.
 * Returns:
 *  -1 if a < b
 *   0 if a == b
 *   1 if a > b
 */
export function compare(a: SemVer, b: SemVer): -1 | 0 | 1 {
  if (a.major !== b.major) return a.major > b.major ? 1 : -1;
  if (a.minor !== b.minor) return a.minor > b.minor ? 1 : -1;
  if (a.patch !== b.patch) return a.patch > b.patch ? 1 : -1;

  // Pre-release has lower precedence than release
  if (a.prerelease && !b.prerelease) return -1;
  if (!a.prerelease && b.prerelease) return 1;

  if (a.prerelease && b.prerelease) {
    const partsA = a.prerelease.split('.');
    const partsB = b.prerelease.split('.');
    const len = Math.max(partsA.length, partsB.length);

    for (let i = 0; i < len; i++) {
      if (i >= partsA.length) return -1;
      if (i >= partsB.length) return 1;

      const numA = parseInt(partsA[i], 10);
      const numB = parseInt(partsB[i], 10);
      const isNumA = !isNaN(numA) && String(numA) === partsA[i];
      const isNumB = !isNaN(numB) && String(numB) === partsB[i];

      if (isNumA && isNumB) {
        if (numA !== numB) return numA > numB ? 1 : -1;
      } else if (isNumA) {
        return -1;
      } else if (isNumB) {
        return 1;
      } else {
        const cmp = partsA[i].localeCompare(partsB[i]);
        if (cmp !== 0) return cmp > 0 ? 1 : -1;
      }
    }
  }

  return 0;
}

export function compareStrings(a: string, b: string): -1 | 0 | 1 | null {
  const parsedA = parse(a);
  const parsedB = parse(b);
  if (!parsedA || !parsedB) return null;
  return compare(parsedA, parsedB);
}

export type BumpType = 'major' | 'minor' | 'patch' | 'prerelease';

export function bump(version: SemVer, type: BumpType, prereleaseId?: string): SemVer {
  switch (type) {
    case 'major':
      return { major: version.major + 1, minor: 0, patch: 0 };
    case 'minor':
      return { major: version.major, minor: version.minor + 1, patch: 0 };
    case 'patch':
      if (version.prerelease) {
        return { major: version.major, minor: version.minor, patch: version.patch };
      }
      return { major: version.major, minor: version.minor, patch: version.patch + 1 };
    case 'prerelease': {
      const id = prereleaseId || 'alpha';
      if (version.prerelease) {
        const parts = version.prerelease.split('.');
        const lastPart = parts[parts.length - 1];
        const num = parseInt(lastPart, 10);
        if (!isNaN(num) && String(num) === lastPart) {
          parts[parts.length - 1] = String(num + 1);
          return { ...version, prerelease: parts.join('.') };
        }
        return { ...version, prerelease: `${version.prerelease}.0` };
      }
      return {
        major: version.major,
        minor: version.minor,
        patch: version.patch + 1,
        prerelease: `${id}.0`,
      };
    }
  }
}

export function satisfiesRange(version: string, range: string): boolean | null {
  const parsed = parse(version);
  if (!parsed) return null;

  const trimmedRange = range.trim();

  // Exact match
  if (isValid(trimmedRange)) {
    const rangeParsed = parse(trimmedRange);
    if (!rangeParsed) return null;
    return compare(parsed, rangeParsed) === 0;
  }

  // Caret range: ^1.2.3
  const caretMatch = trimmedRange.match(/^\^(.+)$/);
  if (caretMatch) {
    const rangeParsed = parse(caretMatch[1]);
    if (!rangeParsed) return null;

    if (compare(parsed, rangeParsed) < 0) return false;

    if (rangeParsed.major > 0) {
      return parsed.major === rangeParsed.major;
    } else if (rangeParsed.minor > 0) {
      return parsed.major === 0 && parsed.minor === rangeParsed.minor;
    } else {
      return parsed.major === 0 && parsed.minor === 0 && parsed.patch === rangeParsed.patch;
    }
  }

  // Tilde range: ~1.2.3
  const tildeMatch = trimmedRange.match(/^~(.+)$/);
  if (tildeMatch) {
    const rangeParsed = parse(tildeMatch[1]);
    if (!rangeParsed) return null;

    if (compare(parsed, rangeParsed) < 0) return false;
    return parsed.major === rangeParsed.major && parsed.minor === rangeParsed.minor;
  }

  // Comparison operators: >=, <=, >, <, =
  const compMatch = trimmedRange.match(/^(>=|<=|>|<|=)(.+)$/);
  if (compMatch) {
    const [, op, ver] = compMatch;
    const rangeParsed = parse(ver.trim());
    if (!rangeParsed) return null;
    const cmp = compare(parsed, rangeParsed);

    switch (op) {
      case '>=': return cmp >= 0;
      case '<=': return cmp <= 0;
      case '>': return cmp > 0;
      case '<': return cmp < 0;
      case '=': return cmp === 0;
    }
  }

  return null;
}
