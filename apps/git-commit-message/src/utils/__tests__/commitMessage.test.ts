import { describe, expect, it } from 'vitest';
import { buildMessage, validateDescription, validateScope } from '../commitMessage';

describe('buildMessage', () => {
  it('builds a simple commit message', () => {
    const result = buildMessage({
      type: 'feat',
      description: 'add new feature',
    });
    expect(result).toBe('feat: add new feature');
  });

  it('builds a message with scope', () => {
    const result = buildMessage({
      type: 'fix',
      scope: 'parser',
      description: 'handle edge case',
    });
    expect(result).toBe('fix(parser): handle edge case');
  });

  it('builds a message with breaking change', () => {
    const result = buildMessage({
      type: 'feat',
      description: 'change API',
      breaking: true,
    });
    expect(result).toBe('feat!: change API\n\nBREAKING CHANGE: change API');
  });

  it('builds a message with body', () => {
    const result = buildMessage({
      type: 'docs',
      description: 'update readme',
      body: 'Added installation instructions',
    });
    expect(result).toBe('docs: update readme\n\nAdded installation instructions');
  });

  it('builds a message with footer', () => {
    const result = buildMessage({
      type: 'fix',
      description: 'resolve issue',
      footer: 'Closes #123',
    });
    expect(result).toBe('fix: resolve issue\n\nCloses #123');
  });

  it('builds a full message with all fields', () => {
    const result = buildMessage({
      type: 'feat',
      scope: 'api',
      description: 'new endpoint',
      body: 'Added GET /users endpoint',
      footer: 'migration required',
      breaking: true,
    });
    expect(result).toBe(
      'feat(api)!: new endpoint\n\nAdded GET /users endpoint\n\nBREAKING CHANGE: migration required'
    );
  });

  it('returns empty string for empty description', () => {
    const result = buildMessage({
      type: 'feat',
      description: '',
    });
    expect(result).toBe('');
  });

  it('trims whitespace from scope', () => {
    const result = buildMessage({
      type: 'feat',
      scope: '  api  ',
      description: 'add endpoint',
    });
    expect(result).toBe('feat(api): add endpoint');
  });

  it('ignores empty scope', () => {
    const result = buildMessage({
      type: 'feat',
      scope: '   ',
      description: 'add feature',
    });
    expect(result).toBe('feat: add feature');
  });
});

describe('validateDescription', () => {
  it('returns null for valid description', () => {
    expect(validateDescription('add new feature')).toBeNull();
  });

  it('returns error for empty description', () => {
    expect(validateDescription('')).toBe('Description is required');
  });

  it('returns error for uppercase start', () => {
    expect(validateDescription('Add feature')).toBe('Description should start with lowercase');
  });

  it('returns error for trailing period', () => {
    expect(validateDescription('add feature.')).toBe('Description should not end with a period');
  });

  it('returns error for too long description', () => {
    const longDesc = 'a'.repeat(101);
    expect(validateDescription(longDesc)).toBe('Description should be 100 characters or less');
  });
});

describe('validateScope', () => {
  it('returns null for valid scope', () => {
    expect(validateScope('api')).toBeNull();
  });

  it('returns null for empty scope', () => {
    expect(validateScope('')).toBeNull();
  });

  it('returns error for scope with spaces', () => {
    expect(validateScope('my scope')).toBe('Scope should not contain spaces');
  });

  it('returns error for scope with special characters', () => {
    expect(validateScope('api@v2')).toBe(
      'Scope should only contain alphanumeric characters, hyphens, and underscores'
    );
  });

  it('allows hyphens and underscores', () => {
    expect(validateScope('my-scope_v2')).toBeNull();
  });
});
