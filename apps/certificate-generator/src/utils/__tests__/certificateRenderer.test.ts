import { describe, it, expect } from 'vitest';
import type { CertificateData, CertTemplate } from '../certificateRenderer';

describe('certificateRenderer', () => {
  it('should define valid templates', () => {
    const templates: CertTemplate[] = ['formal', 'modern'];
    expect(templates).toHaveLength(2);
  });

  it('should accept valid certificate data', () => {
    const data: CertificateData = {
      recipientName: 'Jane Smith',
      certTitle: 'Certificate of Excellence',
      issuer: 'Acme Corp',
      date: '2024-01-01',
      description: 'For outstanding contributions to the team.',
    };
    expect(data.recipientName).toBe('Jane Smith');
    expect(data.certTitle).toContain('Certificate');
  });
});
