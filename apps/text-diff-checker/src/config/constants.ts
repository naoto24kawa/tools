import type { ViewMode, Language, IgnoreOptions } from '@types';

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const SUPPORTED_LANGUAGES = [
  { label: 'Plain Text', value: 'plaintext' as Language },
  { label: 'JavaScript', value: 'javascript' as Language },
  { label: 'TypeScript', value: 'typescript' as Language },
  { label: 'Python', value: 'python' as Language },
  { label: 'HTML', value: 'html' as Language },
  { label: 'CSS', value: 'css' as Language },
  { label: 'JSON', value: 'json' as Language },
  { label: 'Markdown', value: 'markdown' as Language },
] as const;

export const VIEW_MODES = [
  { label: 'Unified', value: 'unified' as ViewMode },
  { label: 'Split', value: 'split' as ViewMode },
] as const;

export const DEFAULT_SETTINGS = {
  viewMode: 'unified' as ViewMode,
  language: 'plaintext' as Language,
  ignoreOptions: {
    ignoreWhitespace: false,
    ignoreAllWhitespace: false,
    ignoreEmptyLines: false,
  } as IgnoreOptions,
};
