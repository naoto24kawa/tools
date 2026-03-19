export type IssueSeverity = 'error' | 'warning' | 'info';

export interface ValidationIssue {
  severity: IssueSeverity;
  field: string;
  message: string;
}

const SEMVER_REGEX = /^\d+\.\d+\.\d+(-[\w.]+)?(\+[\w.]+)?$/;
const SEMVER_RANGE_REGEX =
  /^(\^|~|>=?|<=?|=)?\d+(\.\d+)?(\.\d+)?(-[\w.]+)?(\s*\|\|\s*(\^|~|>=?|<=?|=)?\d+(\.\d+)?(\.\d+)?(-[\w.]+)?)*$|^\*$/;

const COMMON_SPDX = [
  'MIT',
  'ISC',
  'Apache-2.0',
  'BSD-2-Clause',
  'BSD-3-Clause',
  'GPL-2.0-only',
  'GPL-2.0-or-later',
  'GPL-3.0-only',
  'GPL-3.0-or-later',
  'LGPL-2.1-only',
  'LGPL-3.0-only',
  'MPL-2.0',
  'AGPL-3.0-only',
  'Unlicense',
  'CC0-1.0',
  '0BSD',
  'WTFPL',
];

function isValidSemver(version: string): boolean {
  return SEMVER_REGEX.test(version);
}

function isValidSemverRange(range: string): boolean {
  return SEMVER_RANGE_REGEX.test(range.trim());
}

function isValidSpdx(license: string): boolean {
  return COMMON_SPDX.includes(license) || /^[A-Za-z0-9][A-Za-z0-9.+-]*$/.test(license);
}

export function validate(input: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!input.trim()) {
    issues.push({ severity: 'error', field: 'root', message: 'Input is empty' });
    return issues;
  }

  let pkg: Record<string, unknown>;
  try {
    pkg = JSON.parse(input);
  } catch (e) {
    issues.push({
      severity: 'error',
      field: 'root',
      message: `Invalid JSON: ${(e as Error).message}`,
    });
    return issues;
  }

  if (typeof pkg !== 'object' || pkg === null || Array.isArray(pkg)) {
    issues.push({ severity: 'error', field: 'root', message: 'Root must be a JSON object' });
    return issues;
  }

  // Required fields
  if (!pkg.name) {
    issues.push({ severity: 'error', field: 'name', message: '"name" field is required' });
  } else if (typeof pkg.name !== 'string') {
    issues.push({ severity: 'error', field: 'name', message: '"name" must be a string' });
  } else {
    if (/[A-Z]/.test(pkg.name)) {
      issues.push({
        severity: 'warning',
        field: 'name',
        message: 'Package name should be lowercase',
      });
    }
    if (/\s/.test(pkg.name)) {
      issues.push({
        severity: 'error',
        field: 'name',
        message: 'Package name must not contain spaces',
      });
    }
  }

  if (!pkg.version) {
    issues.push({ severity: 'error', field: 'version', message: '"version" field is required' });
  } else if (typeof pkg.version !== 'string') {
    issues.push({ severity: 'error', field: 'version', message: '"version" must be a string' });
  } else if (!isValidSemver(pkg.version)) {
    issues.push({
      severity: 'error',
      field: 'version',
      message: `"${pkg.version}" is not valid semver (expected x.y.z)`,
    });
  }

  // Description
  if (!pkg.description) {
    issues.push({
      severity: 'info',
      field: 'description',
      message: 'Consider adding a "description" field',
    });
  } else if (typeof pkg.description !== 'string') {
    issues.push({
      severity: 'warning',
      field: 'description',
      message: '"description" should be a string',
    });
  }

  // License
  if (!pkg.license) {
    issues.push({
      severity: 'warning',
      field: 'license',
      message: 'Consider adding a "license" field',
    });
  } else if (typeof pkg.license === 'string') {
    if (!isValidSpdx(pkg.license)) {
      issues.push({
        severity: 'warning',
        field: 'license',
        message: `"${pkg.license}" may not be a valid SPDX identifier`,
      });
    }
  }

  // Scripts
  if (pkg.scripts !== undefined) {
    if (typeof pkg.scripts !== 'object' || pkg.scripts === null || Array.isArray(pkg.scripts)) {
      issues.push({
        severity: 'error',
        field: 'scripts',
        message: '"scripts" must be an object',
      });
    } else {
      const scripts = pkg.scripts as Record<string, unknown>;
      for (const [key, val] of Object.entries(scripts)) {
        if (typeof val !== 'string') {
          issues.push({
            severity: 'error',
            field: `scripts.${key}`,
            message: `Script "${key}" must be a string`,
          });
        }
      }
    }
  }

  // Dependencies
  const depFields = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];
  for (const field of depFields) {
    if (pkg[field] !== undefined) {
      if (typeof pkg[field] !== 'object' || pkg[field] === null || Array.isArray(pkg[field])) {
        issues.push({
          severity: 'error',
          field,
          message: `"${field}" must be an object`,
        });
      } else {
        const deps = pkg[field] as Record<string, unknown>;
        for (const [name, version] of Object.entries(deps)) {
          if (typeof version !== 'string') {
            issues.push({
              severity: 'error',
              field: `${field}.${name}`,
              message: `Version for "${name}" must be a string`,
            });
          } else if (!isValidSemverRange(version) && !version.startsWith('http') && !version.startsWith('git') && !version.startsWith('file:') && !version.startsWith('workspace:') && !version.startsWith('npm:') && !version.startsWith('link:')) {
            issues.push({
              severity: 'warning',
              field: `${field}.${name}`,
              message: `"${version}" may not be a valid version range for "${name}"`,
            });
          }
        }
      }
    }
  }

  // Best practices
  if (!pkg.main && !pkg.exports && !pkg.module) {
    issues.push({
      severity: 'info',
      field: 'main',
      message: 'Consider adding "main", "module", or "exports" field for entry point',
    });
  }

  if (!pkg.keywords) {
    issues.push({
      severity: 'info',
      field: 'keywords',
      message: 'Consider adding "keywords" for discoverability',
    });
  } else if (!Array.isArray(pkg.keywords)) {
    issues.push({
      severity: 'warning',
      field: 'keywords',
      message: '"keywords" should be an array of strings',
    });
  }

  if (!pkg.repository) {
    issues.push({
      severity: 'info',
      field: 'repository',
      message: 'Consider adding a "repository" field',
    });
  }

  if (pkg.engines !== undefined) {
    if (typeof pkg.engines !== 'object' || pkg.engines === null) {
      issues.push({
        severity: 'warning',
        field: 'engines',
        message: '"engines" should be an object',
      });
    }
  }

  return issues;
}
