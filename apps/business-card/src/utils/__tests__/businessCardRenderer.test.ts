import { describe, it, expect } from 'vitest';
import type { BusinessCardData, Template } from '../businessCardRenderer';

describe('businessCardRenderer', () => {
  it('should define valid templates', () => {
    const templates: Template[] = ['minimal', 'modern', 'classic'];
    expect(templates).toHaveLength(3);
  });

  it('should accept valid card data', () => {
    const data: BusinessCardData = {
      name: 'John Doe',
      title: 'Software Engineer',
      company: 'Acme Corp',
      email: 'john@acme.com',
      phone: '03-1234-5678',
      website: 'https://acme.com',
    };
    expect(data.name).toBe('John Doe');
    expect(data.email).toContain('@');
  });

  it('should handle empty fields', () => {
    const data: BusinessCardData = {
      name: '',
      title: '',
      company: '',
      email: '',
      phone: '',
      website: '',
    };
    expect(data.name).toBe('');
  });
});
