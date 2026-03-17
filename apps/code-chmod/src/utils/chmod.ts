export interface Permissions {
  owner: { read: boolean; write: boolean; execute: boolean };
  group: { read: boolean; write: boolean; execute: boolean };
  others: { read: boolean; write: boolean; execute: boolean };
}

export function permissionsToOctal(perms: Permissions): string {
  const toDigit = (p: { read: boolean; write: boolean; execute: boolean }) =>
    (p.read ? 4 : 0) + (p.write ? 2 : 0) + (p.execute ? 1 : 0);
  return `${toDigit(perms.owner)}${toDigit(perms.group)}${toDigit(perms.others)}`;
}

export function octalToPermissions(octal: string): Permissions | null {
  if (!/^[0-7]{3}$/.test(octal)) return null;
  const fromDigit = (d: number) => ({
    read: (d & 4) !== 0,
    write: (d & 2) !== 0,
    execute: (d & 1) !== 0,
  });
  return {
    owner: fromDigit(Number(octal[0])),
    group: fromDigit(Number(octal[1])),
    others: fromDigit(Number(octal[2])),
  };
}

export function permissionsToSymbolic(perms: Permissions): string {
  const toStr = (p: { read: boolean; write: boolean; execute: boolean }) =>
    `${p.read ? 'r' : '-'}${p.write ? 'w' : '-'}${p.execute ? 'x' : '-'}`;
  return `-${toStr(perms.owner)}${toStr(perms.group)}${toStr(perms.others)}`;
}

export function symbolicToPermissions(symbolic: string): Permissions | null {
  const cleaned = symbolic.startsWith('-') ? symbolic.slice(1) : symbolic;
  if (!/^[rwx-]{9}$/.test(cleaned)) return null;
  const fromStr = (s: string) => ({
    read: s[0] === 'r',
    write: s[1] === 'w',
    execute: s[2] === 'x',
  });
  return {
    owner: fromStr(cleaned.slice(0, 3)),
    group: fromStr(cleaned.slice(3, 6)),
    others: fromStr(cleaned.slice(6, 9)),
  };
}

export const DEFAULT_PERMISSIONS: Permissions = {
  owner: { read: true, write: true, execute: false },
  group: { read: true, write: false, execute: false },
  others: { read: true, write: false, execute: false },
};

export const COMMON_MODES = [
  { octal: '755', label: 'rwxr-xr-x', desc: 'Directory / Script' },
  { octal: '644', label: 'rw-r--r--', desc: 'Regular file' },
  { octal: '777', label: 'rwxrwxrwx', desc: 'Full access' },
  { octal: '600', label: 'rw-------', desc: 'Owner only' },
  { octal: '700', label: 'rwx------', desc: 'Owner exec only' },
] as const;
