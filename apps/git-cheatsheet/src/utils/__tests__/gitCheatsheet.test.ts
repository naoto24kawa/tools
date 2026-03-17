import { describe, expect, test } from 'vitest';
import { GIT_CHEATSHEET, searchCommands } from '../gitCheatsheet';

describe('gitCheatsheet', () => {
  test('has categories', () => {
    expect(GIT_CHEATSHEET.length).toBeGreaterThan(0);
  });

  test('each category has commands', () => {
    for (const cat of GIT_CHEATSHEET) {
      expect(cat.commands.length).toBeGreaterThan(0);
    }
  });

  test('search filters commands', () => {
    const results = searchCommands('branch');
    const allCommands = results.flatMap((c) => c.commands);
    expect(allCommands.length).toBeGreaterThan(0);
  });

  test('empty search returns all', () => {
    expect(searchCommands('')).toEqual(GIT_CHEATSHEET);
  });
});
