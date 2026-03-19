export interface TsconfigOption {
  key: string;
  label: string;
  description: string;
  type: 'boolean' | 'select' | 'text' | 'array';
  category: string;
  defaultValue: unknown;
  options?: string[];
}

export const tsconfigOptions: TsconfigOption[] = [
  // Target & Module
  {
    key: 'target',
    label: 'Target',
    description: 'Set the JavaScript language version for emitted JavaScript',
    type: 'select',
    category: 'Target & Module',
    defaultValue: 'ES2022',
    options: ['ES5', 'ES6', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019', 'ES2020', 'ES2021', 'ES2022', 'ES2023', 'ES2024', 'ESNext'],
  },
  {
    key: 'module',
    label: 'Module',
    description: 'Specify what module code is generated',
    type: 'select',
    category: 'Target & Module',
    defaultValue: 'ESNext',
    options: ['CommonJS', 'AMD', 'UMD', 'System', 'ES6', 'ES2015', 'ES2020', 'ES2022', 'ESNext', 'Node16', 'NodeNext', 'Preserve', 'None'],
  },
  {
    key: 'moduleResolution',
    label: 'Module Resolution',
    description: 'Specify how TypeScript looks up a file from a given module specifier',
    type: 'select',
    category: 'Target & Module',
    defaultValue: 'Bundler',
    options: ['Classic', 'Node', 'Node10', 'Node16', 'NodeNext', 'Bundler'],
  },
  {
    key: 'lib',
    label: 'Lib',
    description: 'Specify library files to include in compilation',
    type: 'text',
    category: 'Target & Module',
    defaultValue: '',
  },
  {
    key: 'jsx',
    label: 'JSX',
    description: 'Specify what JSX code is generated',
    type: 'select',
    category: 'Target & Module',
    defaultValue: '',
    options: ['', 'preserve', 'react', 'react-jsx', 'react-jsxdev', 'react-native'],
  },

  // Strict Options
  {
    key: 'strict',
    label: 'Strict',
    description: 'Enable all strict type checking options',
    type: 'boolean',
    category: 'Strict Options',
    defaultValue: true,
  },
  {
    key: 'noImplicitAny',
    label: 'No Implicit Any',
    description: 'Enable error reporting for expressions and declarations with an implied any type',
    type: 'boolean',
    category: 'Strict Options',
    defaultValue: false,
  },
  {
    key: 'strictNullChecks',
    label: 'Strict Null Checks',
    description: 'When type checking, take into account null and undefined',
    type: 'boolean',
    category: 'Strict Options',
    defaultValue: false,
  },
  {
    key: 'strictFunctionTypes',
    label: 'Strict Function Types',
    description: 'When assigning functions, check parameters and return values are subtype-compatible',
    type: 'boolean',
    category: 'Strict Options',
    defaultValue: false,
  },
  {
    key: 'noUnusedLocals',
    label: 'No Unused Locals',
    description: 'Enable error reporting when local variables are not read',
    type: 'boolean',
    category: 'Strict Options',
    defaultValue: false,
  },
  {
    key: 'noUnusedParameters',
    label: 'No Unused Parameters',
    description: 'Raise an error when a function parameter is not read',
    type: 'boolean',
    category: 'Strict Options',
    defaultValue: false,
  },
  {
    key: 'noFallthroughCasesInSwitch',
    label: 'No Fallthrough Cases',
    description: 'Enable error reporting for fallthrough cases in switch statements',
    type: 'boolean',
    category: 'Strict Options',
    defaultValue: false,
  },

  // Emit Options
  {
    key: 'outDir',
    label: 'Out Dir',
    description: 'Specify an output folder for all emitted files',
    type: 'text',
    category: 'Emit Options',
    defaultValue: '',
  },
  {
    key: 'rootDir',
    label: 'Root Dir',
    description: 'Specify the root folder within your source files',
    type: 'text',
    category: 'Emit Options',
    defaultValue: '',
  },
  {
    key: 'declaration',
    label: 'Declaration',
    description: 'Generate .d.ts files from TypeScript and JavaScript files in your project',
    type: 'boolean',
    category: 'Emit Options',
    defaultValue: false,
  },
  {
    key: 'declarationMap',
    label: 'Declaration Map',
    description: 'Create sourcemaps for .d.ts files',
    type: 'boolean',
    category: 'Emit Options',
    defaultValue: false,
  },
  {
    key: 'sourceMap',
    label: 'Source Map',
    description: 'Create source map files for emitted JavaScript files',
    type: 'boolean',
    category: 'Emit Options',
    defaultValue: false,
  },
  {
    key: 'noEmit',
    label: 'No Emit',
    description: 'Disable emitting files from a compilation',
    type: 'boolean',
    category: 'Emit Options',
    defaultValue: false,
  },
  {
    key: 'removeComments',
    label: 'Remove Comments',
    description: 'Disable emitting comments',
    type: 'boolean',
    category: 'Emit Options',
    defaultValue: false,
  },

  // Interop
  {
    key: 'esModuleInterop',
    label: 'ES Module Interop',
    description: 'Emit additional JavaScript to ease support for importing CommonJS modules',
    type: 'boolean',
    category: 'Interop',
    defaultValue: true,
  },
  {
    key: 'allowSyntheticDefaultImports',
    label: 'Allow Synthetic Default Imports',
    description: 'Allow default imports from modules with no default export',
    type: 'boolean',
    category: 'Interop',
    defaultValue: false,
  },
  {
    key: 'forceConsistentCasingInFileNames',
    label: 'Force Consistent Casing',
    description: 'Ensure that casing is correct in imports',
    type: 'boolean',
    category: 'Interop',
    defaultValue: true,
  },
  {
    key: 'allowJs',
    label: 'Allow JS',
    description: 'Allow JavaScript files to be a part of your program',
    type: 'boolean',
    category: 'Interop',
    defaultValue: false,
  },
  {
    key: 'resolveJsonModule',
    label: 'Resolve JSON Module',
    description: 'Enable importing .json files',
    type: 'boolean',
    category: 'Interop',
    defaultValue: false,
  },
  {
    key: 'isolatedModules',
    label: 'Isolated Modules',
    description: 'Ensure each file can be safely transpiled without relying on other imports',
    type: 'boolean',
    category: 'Interop',
    defaultValue: false,
  },
  {
    key: 'skipLibCheck',
    label: 'Skip Lib Check',
    description: 'Skip type checking of declaration files',
    type: 'boolean',
    category: 'Interop',
    defaultValue: false,
  },
];

export interface TsconfigState {
  compilerOptions: Record<string, unknown>;
  include: string[];
  exclude: string[];
}

export function buildConfig(state: TsconfigState): Record<string, unknown> {
  const config: Record<string, unknown> = {};

  const compilerOptions: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(state.compilerOptions)) {
    if (value === '' || value === false || value === undefined || value === null) {
      continue;
    }

    const optDef = tsconfigOptions.find((o) => o.key === key);
    if (optDef && value === optDef.defaultValue) {
      // Only include if it's a meaningful value
      if (typeof value === 'boolean' && value === false) continue;
    }

    // For lib, split comma-separated values into an array
    if (key === 'lib' && typeof value === 'string') {
      const libs = value
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s);
      if (libs.length > 0) {
        compilerOptions[key] = libs;
      }
      continue;
    }

    compilerOptions[key] = value;
  }

  if (Object.keys(compilerOptions).length > 0) {
    config.compilerOptions = compilerOptions;
  }

  const include = state.include.filter((s) => s.trim());
  if (include.length > 0) {
    config.include = include;
  }

  const exclude = state.exclude.filter((s) => s.trim());
  if (exclude.length > 0) {
    config.exclude = exclude;
  }

  return config;
}

export function getCategories(): string[] {
  const categories = new Set<string>();
  for (const opt of tsconfigOptions) {
    categories.add(opt.category);
  }
  return Array.from(categories);
}

export function getOptionsByCategory(category: string): TsconfigOption[] {
  return tsconfigOptions.filter((o) => o.category === category);
}
