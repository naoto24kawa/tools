import { describe, it, expect } from 'vitest';
import {
  calculateInvoice,
  formatJPY,
  generateInvoiceHTML,
  type InvoiceData,
} from '../invoiceGenerator';

const sampleData: InvoiceData = {
  companyName: 'テスト株式会社',
  clientName: 'クライアント株式会社',
  invoiceNumber: 'INV-2024-001',
  issueDate: '2024-01-15',
  dueDate: '2024-02-15',
  items: [
    { description: 'Webサイト制作', quantity: 1, unitPrice: 500000 },
    { description: 'サーバー費用', quantity: 12, unitPrice: 5000 },
  ],
  taxRate: 0.1,
  notes: 'お振込み先: テスト銀行',
};

describe('invoiceGenerator', () => {
  describe('calculateInvoice', () => {
    it('should calculate subtotal correctly', () => {
      const result = calculateInvoice(sampleData);
      expect(result.subtotal).toBe(560000); // 500000 + 60000
    });

    it('should calculate tax correctly', () => {
      const result = calculateInvoice(sampleData);
      expect(result.taxAmount).toBe(56000); // 560000 * 0.1
    });

    it('should calculate total correctly', () => {
      const result = calculateInvoice(sampleData);
      expect(result.total).toBe(616000); // 560000 + 56000
    });

    it('should calculate item totals correctly', () => {
      const result = calculateInvoice(sampleData);
      expect(result.itemTotals).toEqual([500000, 60000]);
    });

    it('should handle empty items', () => {
      const result = calculateInvoice({ ...sampleData, items: [] });
      expect(result.subtotal).toBe(0);
      expect(result.taxAmount).toBe(0);
      expect(result.total).toBe(0);
      expect(result.itemTotals).toEqual([]);
    });

    it('should floor tax amount', () => {
      const data: InvoiceData = {
        ...sampleData,
        items: [{ description: 'test', quantity: 1, unitPrice: 999 }],
        taxRate: 0.1,
      };
      const result = calculateInvoice(data);
      expect(result.taxAmount).toBe(99); // 999 * 0.1 = 99.9 -> floor = 99
    });

    it('should handle 8% tax rate', () => {
      const data: InvoiceData = {
        ...sampleData,
        items: [{ description: 'food', quantity: 1, unitPrice: 1000 }],
        taxRate: 0.08,
      };
      const result = calculateInvoice(data);
      expect(result.taxAmount).toBe(80);
      expect(result.total).toBe(1080);
    });
  });

  describe('formatJPY', () => {
    it('should format number as JPY', () => {
      const result = formatJPY(1000);
      expect(result).toContain('1,000');
    });

    it('should format zero', () => {
      const result = formatJPY(0);
      expect(result).toContain('0');
    });
  });

  describe('generateInvoiceHTML', () => {
    it('should generate valid HTML', () => {
      const html = generateInvoiceHTML(sampleData);
      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('請求書');
    });

    it('should include company name', () => {
      const html = generateInvoiceHTML(sampleData);
      expect(html).toContain('テスト株式会社');
    });

    it('should include client name', () => {
      const html = generateInvoiceHTML(sampleData);
      expect(html).toContain('クライアント株式会社');
    });

    it('should include invoice number', () => {
      const html = generateInvoiceHTML(sampleData);
      expect(html).toContain('INV-2024-001');
    });

    it('should include item descriptions', () => {
      const html = generateInvoiceHTML(sampleData);
      expect(html).toContain('Webサイト制作');
      expect(html).toContain('サーバー費用');
    });

    it('should include notes when provided', () => {
      const html = generateInvoiceHTML(sampleData);
      expect(html).toContain('お振込み先');
    });

    it('should not include notes section when empty', () => {
      const data = { ...sampleData, notes: '' };
      const html = generateInvoiceHTML(data);
      expect(html).not.toContain('備考');
    });

    it('should escape HTML in user input', () => {
      const data = {
        ...sampleData,
        companyName: '<script>alert("xss")</script>',
      };
      const html = generateInvoiceHTML(data);
      expect(html).not.toContain('<script>');
      expect(html).toContain('&lt;script&gt;');
    });
  });
});
