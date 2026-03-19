export interface GitignoreTemplate {
  name: string;
  category: string;
  patterns: string[];
}

export const TEMPLATES: GitignoreTemplate[] = [
  {
    name: 'Node.js',
    category: 'Language',
    patterns: [
      'node_modules/',
      'npm-debug.log*',
      'yarn-debug.log*',
      'yarn-error.log*',
      '.pnpm-debug.log*',
      'dist/',
      'build/',
      '.env',
      '.env.local',
      '.env.*.local',
      'coverage/',
      '.nyc_output/',
    ],
  },
  {
    name: 'Python',
    category: 'Language',
    patterns: [
      '__pycache__/',
      '*.py[cod]',
      '*$py.class',
      '*.so',
      '.Python',
      'env/',
      'venv/',
      '.venv/',
      'dist/',
      'build/',
      '*.egg-info/',
      '.eggs/',
      '.pytest_cache/',
      '.mypy_cache/',
      '.ruff_cache/',
      'htmlcov/',
      '.coverage',
      '.coverage.*',
    ],
  },
  {
    name: 'Java',
    category: 'Language',
    patterns: [
      '*.class',
      '*.jar',
      '*.war',
      '*.ear',
      'target/',
      '.gradle/',
      'build/',
      '*.log',
      '.settings/',
      '.classpath',
      '.project',
      'bin/',
    ],
  },
  {
    name: 'Go',
    category: 'Language',
    patterns: ['*.exe', '*.exe~', '*.dll', '*.so', '*.dylib', '*.test', '*.out', 'vendor/'],
  },
  {
    name: 'Rust',
    category: 'Language',
    patterns: [
      'target/',
      'Cargo.lock',
      '**/*.rs.bk',
      '*.pdb',
    ],
  },
  {
    name: 'Ruby',
    category: 'Language',
    patterns: [
      '*.gem',
      '*.rbc',
      '.bundle/',
      'vendor/bundle/',
      'log/*.log',
      'tmp/',
      'coverage/',
      '.byebug_history',
      '.ruby-version',
      '.ruby-gemset',
    ],
  },
  {
    name: 'C/C++',
    category: 'Language',
    patterns: [
      '*.o',
      '*.obj',
      '*.so',
      '*.dylib',
      '*.dll',
      '*.a',
      '*.lib',
      '*.exe',
      '*.out',
      '*.app',
      '*.dSYM/',
      'build/',
      'cmake-build-*/',
    ],
  },
  {
    name: '.NET',
    category: 'Language',
    patterns: [
      'bin/',
      'obj/',
      '*.user',
      '*.suo',
      '*.cache',
      'packages/',
      '.vs/',
      '*.nupkg',
      'project.lock.json',
    ],
  },
  {
    name: 'Swift',
    category: 'Language',
    patterns: [
      '.build/',
      'Packages/',
      '*.xcodeproj/',
      '*.xcworkspace/',
      'xcuserdata/',
      'DerivedData/',
      '.swiftpm/',
    ],
  },
  {
    name: 'Kotlin',
    category: 'Language',
    patterns: [
      '*.class',
      '*.jar',
      '*.war',
      'build/',
      '.gradle/',
      '.kotlin/',
      'out/',
    ],
  },
  {
    name: 'React',
    category: 'Framework',
    patterns: [
      'node_modules/',
      'build/',
      'dist/',
      '.env.local',
      '.env.development.local',
      '.env.test.local',
      '.env.production.local',
      'coverage/',
      'npm-debug.log*',
    ],
  },
  {
    name: 'Vue',
    category: 'Framework',
    patterns: [
      'node_modules/',
      'dist/',
      '.env.local',
      '.env.*.local',
      'coverage/',
      '*.local',
      'npm-debug.log*',
    ],
  },
  {
    name: 'Angular',
    category: 'Framework',
    patterns: [
      'node_modules/',
      'dist/',
      'tmp/',
      'out-tsc/',
      '.angular/',
      '.sass-cache/',
      'connect.lock',
      'coverage/',
      'npm-debug.log',
    ],
  },
  {
    name: 'Django',
    category: 'Framework',
    patterns: [
      '*.pyc',
      '__pycache__/',
      'db.sqlite3',
      'db.sqlite3-journal',
      'media/',
      'staticfiles/',
      '.env',
      '*.log',
      'venv/',
    ],
  },
  {
    name: 'Rails',
    category: 'Framework',
    patterns: [
      'log/*.log',
      'tmp/',
      'storage/',
      'public/assets/',
      'public/packs/',
      'node_modules/',
      'yarn-error.log',
      '.byebug_history',
      'config/master.key',
      'config/credentials/*.key',
    ],
  },
  {
    name: 'Unity',
    category: 'Framework',
    patterns: [
      '[Ll]ibrary/',
      '[Tt]emp/',
      '[Oo]bj/',
      '[Bb]uild/',
      '[Bb]uilds/',
      '[Ll]ogs/',
      'UserSettings/',
      'MemoryCaptures/',
      'Assets/Plugins/Editor/JetBrains*',
      '*.csproj',
      '*.sln',
    ],
  },
  {
    name: 'Android',
    category: 'Platform',
    patterns: [
      '*.apk',
      '*.aab',
      '*.ap_',
      '*.dex',
      'build/',
      '.gradle/',
      'local.properties',
      '*.iml',
      '.idea/',
      'captures/',
      '.externalNativeBuild/',
    ],
  },
  {
    name: 'iOS',
    category: 'Platform',
    patterns: [
      'DerivedData/',
      'build/',
      '*.pbxuser',
      '*.mode1v3',
      '*.mode2v3',
      '*.perspectivev3',
      'xcuserdata/',
      '*.xccheckout',
      'Pods/',
      '*.ipa',
    ],
  },
  {
    name: 'macOS',
    category: 'OS',
    patterns: ['.DS_Store', '.AppleDouble', '.LSOverride', '._*', '.Spotlight-V100', '.Trashes'],
  },
  {
    name: 'Windows',
    category: 'OS',
    patterns: ['Thumbs.db', 'Thumbs.db:encryptable', 'ehthumbs.db', '*.stackdump', '[Dd]esktop.ini', '$RECYCLE.BIN/'],
  },
  {
    name: 'Linux',
    category: 'OS',
    patterns: ['*~', '.fuse_hidden*', '.directory', '.Trash-*', '.nfs*'],
  },
  {
    name: 'JetBrains',
    category: 'Editor',
    patterns: [
      '.idea/',
      '*.iws',
      '*.iml',
      '*.ipr',
      'out/',
      '.idea_modules/',
      'atlassian-ide-plugin.xml',
      'cmake-build-*/',
    ],
  },
  {
    name: 'VSCode',
    category: 'Editor',
    patterns: ['.vscode/*', '!.vscode/settings.json', '!.vscode/tasks.json', '!.vscode/launch.json', '!.vscode/extensions.json', '*.code-workspace', '.history/'],
  },
  {
    name: 'Vim',
    category: 'Editor',
    patterns: ['[._]*.s[a-v][a-z]', '[._]*.sw[a-p]', '[._]s[a-rt-v][a-z]', '[._]ss[a-gi-z]', '[._]sw[a-p]', 'Session.vim', 'Sessionx.vim', '.netrwhist', '*~', 'tags'],
  },
  {
    name: 'Emacs',
    category: 'Editor',
    patterns: ['*~', '\\#*\\#', '/.emacs.desktop', '/.emacs.desktop.lock', '*.elc', 'auto-save-list', 'tramp', '.\\#*', '.org-id-locations', '*_archive', '*_flymake.*'],
  },
];

export function generate(selectedNames: string[]): string {
  const selectedTemplates = TEMPLATES.filter((t) => selectedNames.includes(t.name));

  if (selectedTemplates.length === 0) {
    return '';
  }

  const sections: string[] = [];

  for (const template of selectedTemplates) {
    sections.push(`# ${template.name}`);
    for (const pattern of template.patterns) {
      sections.push(pattern);
    }
    sections.push('');
  }

  return sections.join('\n').trim() + '\n';
}

export function getCategories(): string[] {
  const categories = new Set(TEMPLATES.map((t) => t.category));
  return Array.from(categories);
}

export function getTemplatesByCategory(category: string): GitignoreTemplate[] {
  return TEMPLATES.filter((t) => t.category === category);
}
