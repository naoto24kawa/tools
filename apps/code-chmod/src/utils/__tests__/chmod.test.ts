import { describe, expect, test } from 'bun:test';
import {
  octalToPermissions,
  permissionsToOctal,
  permissionsToSymbolic,
  symbolicToPermissions,
} from '../chmod';

describe('chmod', () => {
  test('permissionsToOctal 755', () => {
    expect(
      permissionsToOctal({
        owner: { read: true, write: true, execute: true },
        group: { read: true, write: false, execute: true },
        others: { read: true, write: false, execute: true },
      })
    ).toBe('755');
  });

  test('permissionsToOctal 644', () => {
    expect(
      permissionsToOctal({
        owner: { read: true, write: true, execute: false },
        group: { read: true, write: false, execute: false },
        others: { read: true, write: false, execute: false },
      })
    ).toBe('644');
  });

  test('permissionsToOctal 000', () => {
    expect(
      permissionsToOctal({
        owner: { read: false, write: false, execute: false },
        group: { read: false, write: false, execute: false },
        others: { read: false, write: false, execute: false },
      })
    ).toBe('000');
  });

  test('octalToPermissions 755', () => {
    const perms = octalToPermissions('755');
    expect(perms?.owner).toEqual({ read: true, write: true, execute: true });
    expect(perms?.group).toEqual({ read: true, write: false, execute: true });
  });

  test('octalToPermissions invalid', () => {
    expect(octalToPermissions('999')).toBeNull();
    expect(octalToPermissions('ab')).toBeNull();
  });

  test('permissionsToSymbolic 755', () => {
    const perms = octalToPermissions('755');
    expect(perms).not.toBeNull();
    if (perms) expect(permissionsToSymbolic(perms)).toBe('-rwxr-xr-x');
  });

  test('permissionsToSymbolic 644', () => {
    const perms = octalToPermissions('644');
    if (perms) expect(permissionsToSymbolic(perms)).toBe('-rw-r--r--');
  });

  test('symbolicToPermissions', () => {
    const perms = symbolicToPermissions('-rwxr-xr-x');
    expect(perms?.owner).toEqual({ read: true, write: true, execute: true });
    expect(perms?.others).toEqual({ read: true, write: false, execute: true });
  });

  test('symbolicToPermissions invalid', () => {
    expect(symbolicToPermissions('invalid')).toBeNull();
  });

  test('round-trip octal -> perms -> octal', () => {
    const perms = octalToPermissions('750');
    expect(perms).not.toBeNull();
    if (perms) expect(permissionsToOctal(perms)).toBe('750');
  });
});
