import { describe, expect, it } from 'vitest';
import { LICENSES, FEATURE_LABELS, recommendLicenses, getLicenseById } from '../licenseData';

describe('LICENSES', () => {
  it('has 10 licenses', () => {
    expect(LICENSES).toHaveLength(10);
  });

  it('each license has required fields', () => {
    LICENSES.forEach((license) => {
      expect(license.id).toBeTruthy();
      expect(license.name).toBeTruthy();
      expect(license.shortDescription).toBeTruthy();
      expect(license.text).toBeTruthy();
      expect(license.features).toBeDefined();
    });
  });

  it('includes MIT license', () => {
    const mit = LICENSES.find((l) => l.id === 'MIT');
    expect(mit).toBeDefined();
    expect(mit!.features.commercial).toBe(true);
    expect(mit!.features.modify).toBe(true);
  });

  it('includes GPL-3.0 license', () => {
    const gpl = LICENSES.find((l) => l.id === 'GPL-3.0');
    expect(gpl).toBeDefined();
    expect(gpl!.features.sameLicense).toBe(true);
    expect(gpl!.features.disclose).toBe(true);
  });
});

describe('FEATURE_LABELS', () => {
  it('has labels for all feature keys', () => {
    expect(Object.keys(FEATURE_LABELS)).toHaveLength(8);
    expect(FEATURE_LABELS.commercial).toBeTruthy();
    expect(FEATURE_LABELS.patent).toBeTruthy();
  });
});

describe('recommendLicenses', () => {
  it('returns all licenses when no preferences', () => {
    const result = recommendLicenses({
      needsCommercial: null,
      needsPatent: null,
      needsCopyleft: null,
    });
    expect(result).toHaveLength(10);
  });

  it('filters for patent grant', () => {
    const result = recommendLicenses({
      needsCommercial: null,
      needsPatent: true,
      needsCopyleft: null,
    });
    result.forEach((l) => expect(l.features.patent).toBe(true));
  });

  it('filters out copyleft when not wanted', () => {
    const result = recommendLicenses({
      needsCommercial: null,
      needsPatent: null,
      needsCopyleft: false,
    });
    result.forEach((l) => expect(l.features.sameLicense).toBe(false));
  });

  it('filters for copyleft when wanted', () => {
    const result = recommendLicenses({
      needsCommercial: null,
      needsPatent: null,
      needsCopyleft: true,
    });
    result.forEach((l) => expect(l.features.sameLicense).toBe(true));
  });
});

describe('getLicenseById', () => {
  it('finds MIT license', () => {
    const license = getLicenseById('MIT');
    expect(license).toBeDefined();
    expect(license!.name).toBe('MIT License');
  });

  it('returns undefined for unknown id', () => {
    expect(getLicenseById('unknown')).toBeUndefined();
  });
});
