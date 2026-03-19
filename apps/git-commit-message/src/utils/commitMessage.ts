export type CommitType =
  | 'feat'
  | 'fix'
  | 'docs'
  | 'style'
  | 'refactor'
  | 'test'
  | 'chore'
  | 'perf'
  | 'ci'
  | 'build';

export const COMMIT_TYPES: { value: CommitType; label: string; description: string }[] = [
  { value: 'feat', label: 'feat', description: 'A new feature' },
  { value: 'fix', label: 'fix', description: 'A bug fix' },
  { value: 'docs', label: 'docs', description: 'Documentation only changes' },
  { value: 'style', label: 'style', description: 'Code style changes (formatting, etc.)' },
  { value: 'refactor', label: 'refactor', description: 'Code refactoring' },
  { value: 'test', label: 'test', description: 'Adding or updating tests' },
  { value: 'chore', label: 'chore', description: 'Maintenance tasks' },
  { value: 'perf', label: 'perf', description: 'Performance improvements' },
  { value: 'ci', label: 'ci', description: 'CI/CD changes' },
  { value: 'build', label: 'build', description: 'Build system changes' },
];

export interface CommitMessageOptions {
  type: CommitType;
  scope?: string;
  description: string;
  body?: string;
  footer?: string;
  breaking?: boolean;
}

export function buildMessage(options: CommitMessageOptions): string {
  const { type, scope, description, body, footer, breaking } = options;

  if (!description.trim()) {
    return '';
  }

  let header = type;
  if (scope && scope.trim()) {
    header += `(${scope.trim()})`;
  }
  if (breaking) {
    header += '!';
  }
  header += `: ${description.trim()}`;

  const parts: string[] = [header];

  if (body && body.trim()) {
    parts.push('');
    parts.push(body.trim());
  }

  if (breaking && footer && footer.trim()) {
    parts.push('');
    parts.push(`BREAKING CHANGE: ${footer.trim()}`);
  } else if (breaking && !footer?.trim()) {
    parts.push('');
    parts.push('BREAKING CHANGE: ' + description.trim());
  } else if (footer && footer.trim()) {
    parts.push('');
    parts.push(footer.trim());
  }

  return parts.join('\n');
}

export function validateDescription(description: string): string | null {
  if (!description.trim()) {
    return 'Description is required';
  }
  if (description.length > 100) {
    return 'Description should be 100 characters or less';
  }
  if (/^[A-Z]/.test(description.trim())) {
    return 'Description should start with lowercase';
  }
  if (description.trim().endsWith('.')) {
    return 'Description should not end with a period';
  }
  return null;
}

export function validateScope(scope: string): string | null {
  if (!scope) return null;
  if (/\s/.test(scope)) {
    return 'Scope should not contain spaces';
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(scope)) {
    return 'Scope should only contain alphanumeric characters, hyphens, and underscores';
  }
  return null;
}
