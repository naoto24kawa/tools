import { describe, expect, test } from 'vitest';
import { DEFAULT_CONFIG, generateOGPTags } from '../ogp';

describe('generateOGPTags', () => {
  test('generates og:title', () => {
    const tags = generateOGPTags({ ...DEFAULT_CONFIG, title: 'Test' });
    expect(tags).toContain('og:title');
    expect(tags).toContain('Test');
  });

  test('generates og:description', () => {
    const tags = generateOGPTags({ ...DEFAULT_CONFIG, description: 'Hello' });
    expect(tags).toContain('og:description');
    expect(tags).toContain('name="description"');
  });

  test('generates og:url', () => {
    const tags = generateOGPTags({ ...DEFAULT_CONFIG, url: 'https://example.com' });
    expect(tags).toContain('og:url');
  });

  test('generates og:image and twitter:image', () => {
    const tags = generateOGPTags({ ...DEFAULT_CONFIG, image: 'https://example.com/img.jpg' });
    expect(tags).toContain('og:image');
    expect(tags).toContain('twitter:image');
  });

  test('generates twitter:card', () => {
    const tags = generateOGPTags(DEFAULT_CONFIG);
    expect(tags).toContain('twitter:card');
    expect(tags).toContain('summary_large_image');
  });

  test('escapes HTML in content', () => {
    const tags = generateOGPTags({ ...DEFAULT_CONFIG, title: 'A & B <C>' });
    expect(tags).toContain('A &amp; B &lt;C&gt;');
  });

  test('empty config generates minimal tags', () => {
    const tags = generateOGPTags(DEFAULT_CONFIG);
    expect(tags).toContain('twitter:card');
    expect(tags).toContain('og:type');
  });
});
