export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface InvoiceData {
  companyName: string;
  clientName: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  taxRate: number; // e.g. 0.1 for 10%
  notes: string;
}

export interface InvoiceCalculation {
  subtotal: number;
  taxAmount: number;
  total: number;
  itemTotals: number[];
}

/**
 * Calculate invoice totals.
 */
export function calculateInvoice(data: InvoiceData): InvoiceCalculation {
  const itemTotals = data.items.map((item) => item.quantity * item.unitPrice);
  const subtotal = itemTotals.reduce((sum, t) => sum + t, 0);
  const taxAmount = Math.floor(subtotal * data.taxRate);
  const total = subtotal + taxAmount;

  return { subtotal, taxAmount, total, itemTotals };
}

/**
 * Format a number as JPY.
 */
export function formatJPY(n: number): string {
  return n.toLocaleString('ja-JP', { style: 'currency', currency: 'JPY' });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Generate invoice HTML for printing.
 */
export function generateInvoiceHTML(data: InvoiceData): string {
  const calc = calculateInvoice(data);

  const itemRows = data.items
    .map(
      (item, i) => `
    <tr>
      <td style="border:1px solid #ddd;padding:8px">${escapeHtml(item.description)}</td>
      <td style="border:1px solid #ddd;padding:8px;text-align:right">${item.quantity}</td>
      <td style="border:1px solid #ddd;padding:8px;text-align:right">${formatJPY(item.unitPrice)}</td>
      <td style="border:1px solid #ddd;padding:8px;text-align:right">${formatJPY(calc.itemTotals[i])}</td>
    </tr>`,
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<title>請求書 ${escapeHtml(data.invoiceNumber)}</title>
<style>
  body { font-family: 'Hiragino Sans', 'Yu Gothic', sans-serif; margin: 40px; color: #333; }
  h1 { text-align: center; font-size: 28px; margin-bottom: 30px; border-bottom: 3px solid #333; padding-bottom: 10px; }
  .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
  .header-left { font-size: 16px; }
  .header-right { text-align: right; font-size: 14px; }
  .client { font-size: 20px; font-weight: bold; border-bottom: 2px solid #333; display: inline-block; padding-bottom: 4px; }
  table { width: 100%; border-collapse: collapse; margin: 20px 0; }
  th { background: #f5f5f5; border: 1px solid #ddd; padding: 8px; text-align: left; }
  .totals { text-align: right; margin-top: 20px; }
  .totals td { padding: 4px 8px; }
  .total-row { font-size: 20px; font-weight: bold; }
  .notes { margin-top: 30px; padding: 15px; background: #f9f9f9; border-radius: 4px; white-space: pre-wrap; }
  @media print { body { margin: 20px; } }
</style>
</head>
<body>
<h1>請求書</h1>
<div class="header">
  <div class="header-left">
    <p class="client">${escapeHtml(data.clientName)} 御中</p>
  </div>
  <div class="header-right">
    <p>請求書番号: ${escapeHtml(data.invoiceNumber)}</p>
    <p>発行日: ${escapeHtml(data.issueDate)}</p>
    <p>お支払い期限: ${escapeHtml(data.dueDate)}</p>
    <p style="margin-top:10px;font-weight:bold">${escapeHtml(data.companyName)}</p>
  </div>
</div>

<table>
  <thead>
    <tr>
      <th>品目</th>
      <th style="text-align:right;width:80px">数量</th>
      <th style="text-align:right;width:120px">単価</th>
      <th style="text-align:right;width:120px">金額</th>
    </tr>
  </thead>
  <tbody>
    ${itemRows}
  </tbody>
</table>

<table class="totals" style="width:300px;margin-left:auto">
  <tr><td>小計</td><td style="text-align:right">${formatJPY(calc.subtotal)}</td></tr>
  <tr><td>消費税 (${data.taxRate * 100}%)</td><td style="text-align:right">${formatJPY(calc.taxAmount)}</td></tr>
  <tr class="total-row" style="border-top:2px solid #333"><td>合計</td><td style="text-align:right">${formatJPY(calc.total)}</td></tr>
</table>

${data.notes ? `<div class="notes"><strong>備考:</strong><br>${escapeHtml(data.notes)}</div>` : ''}
</body>
</html>`;
}

/**
 * Open print dialog with generated invoice using Blob URL (safe pattern).
 */
export function printInvoice(data: InvoiceData): void {
  const html = generateInvoiceHTML(data);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const printWindow = window.open(url, '_blank');
  if (!printWindow) {
    URL.revokeObjectURL(url);
    throw new Error('ポップアップがブロックされました。ポップアップを許可してください。');
  }
  printWindow.addEventListener('afterprint', () => {
    URL.revokeObjectURL(url);
  });
  // Fallback cleanup after 60 seconds
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}
