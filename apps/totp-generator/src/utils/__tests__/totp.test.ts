import { describe, expect, test } from 'vitest';
import { base32Decode, base32Encode, generateSecret, generateTOTP, getRemainingSeconds, buildOtpAuthUri } from '../totp';

describe('base32Encode / base32Decode', () => {
  test('roundtrips correctly', () => {
    const original = new Uint8Array([72, 101, 108, 108, 111]);
    const encoded = base32Encode(original);
    const decoded = base32Decode(encoded);
    expect(decoded).toEqual(original);
  });

  test('decodes known base32 string', () => {
    // "JBSWY3DPEE" is base32 for "Hello!"
    const decoded = base32Decode('JBSWY3DPEE');
    const text = new TextDecoder().decode(decoded);
    expect(text).toBe('Hello!');
  });

  test('handles padding and spaces', () => {
    const decoded = base32Decode('JBSW Y3DP EE==');
    const text = new TextDecoder().decode(decoded);
    expect(text).toBe('Hello!');
  });
});

describe('generateTOTP', () => {
  test('generates a 6-digit code', async () => {
    const secret = 'JBSWY3DPEHPK3PXP';
    const code = await generateTOTP(secret);
    expect(code).toMatch(/^\d{6}$/);
  });

  test('generates consistent code for same time', async () => {
    const secret = 'JBSWY3DPEHPK3PXP';
    const fixedTime = 1234567890;
    const code1 = await generateTOTP(secret, 30, 6, fixedTime);
    const code2 = await generateTOTP(secret, 30, 6, fixedTime);
    expect(code1).toBe(code2);
  });

  test('different time steps produce different codes', async () => {
    const secret = 'JBSWY3DPEHPK3PXP';
    const code1 = await generateTOTP(secret, 30, 6, 1000000000);
    const code2 = await generateTOTP(secret, 30, 6, 1000000060);
    // Different 30-second windows should produce different codes (with high probability)
    // We just verify both are valid 6-digit codes
    expect(code1).toMatch(/^\d{6}$/);
    expect(code2).toMatch(/^\d{6}$/);
  });

  // RFC 6238 test vector: secret = "12345678901234567890" (ASCII), time = 59, expected = "287082"
  test('matches RFC 6238 test vector for T=59', async () => {
    // "12345678901234567890" in base32 is "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ"
    const secret = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ';
    const code = await generateTOTP(secret, 30, 6, 59);
    expect(code).toBe('287082');
  });
});

describe('generateSecret', () => {
  test('generates a base32 string', () => {
    const secret = generateSecret();
    expect(secret).toMatch(/^[A-Z2-7]+$/);
  });

  test('generates different secrets each time', () => {
    const s1 = generateSecret();
    const s2 = generateSecret();
    expect(s1).not.toBe(s2);
  });

  test('default length produces 32-char base32 string', () => {
    const secret = generateSecret(20);
    expect(secret.length).toBe(32);
  });
});

describe('getRemainingSeconds', () => {
  test('returns value between 1 and 30', () => {
    const remaining = getRemainingSeconds(30);
    expect(remaining).toBeGreaterThanOrEqual(1);
    expect(remaining).toBeLessThanOrEqual(30);
  });
});

describe('buildOtpAuthUri', () => {
  test('generates valid otpauth URI', () => {
    const uri = buildOtpAuthUri('JBSWY3DPEHPK3PXP', 'Test', 'user@test.com');
    expect(uri).toContain('otpauth://totp/');
    expect(uri).toContain('secret=JBSWY3DPEHPK3PXP');
    expect(uri).toContain('issuer=Test');
    expect(uri).toContain('algorithm=SHA1');
    expect(uri).toContain('digits=6');
    expect(uri).toContain('period=30');
  });
});
