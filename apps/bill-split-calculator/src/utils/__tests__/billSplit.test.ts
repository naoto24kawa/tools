import { describe, expect, it } from 'vitest';
import { splitBill } from '../billSplit';

const members = [
  { id: 'a', name: 'Alice', ratio: 1 },
  { id: 'b', name: 'Bob', ratio: 1 },
];

describe('billSplit', () => {
  it('2人均等割り', () => {
    const result = splitBill({
      items: [{ id: '1', name: '食事', amount: 10000 }],
      members,
      rounding: 'nearest',
    });
    expect(result.totalAmount).toBe(10000);
    expect(result.perMember[0].amount).toBe(5000);
    expect(result.perMember[1].amount).toBe(5000);
  });

  it('不均等割り（2:1）', () => {
    const result = splitBill({
      items: [{ id: '1', name: '食事', amount: 9000 }],
      members: [
        { id: 'a', name: 'Alice', ratio: 2 },
        { id: 'b', name: 'Bob', ratio: 1 },
      ],
      rounding: 'nearest',
    });
    expect(result.perMember[0].amount).toBe(6000); // 2/3
    expect(result.perMember[1].amount).toBe(3000); // 1/3
  });

  it('切り上げ端数処理', () => {
    const result = splitBill({
      items: [{ id: '1', name: '食事', amount: 1000 }],
      members: [
        { id: 'a', name: 'Alice', ratio: 1 },
        { id: 'b', name: 'Bob', ratio: 1 },
        { id: 'c', name: 'Carol', ratio: 1 },
      ],
      rounding: 'up',
    });
    // 1000/3 = 333.33 → ceil = 334
    expect(result.perMember[0].amount).toBe(334);
  });

  it('品目が空の場合はゼロ', () => {
    const result = splitBill({ items: [], members, rounding: 'nearest' });
    expect(result.totalAmount).toBe(0);
    expect(result.perMember[0].amount).toBe(0);
  });

  it('メンバーが空は例外を投げる', () => {
    expect(() =>
      splitBill({
        items: [{ id: '1', name: 'test', amount: 1000 }],
        members: [],
        rounding: 'nearest',
      }),
    ).toThrow('At least one member required');
  });

  it('summaryText にメンバー名が含まれる', () => {
    const result = splitBill({
      items: [{ id: '1', name: '食事', amount: 10000 }],
      members,
      rounding: 'nearest',
    });
    expect(result.summaryText).toContain('Alice');
    expect(result.summaryText).toContain('Bob');
  });

  it('端数処理後の合計は totalAmount と一致する', () => {
    const result = splitBill({
      items: [{ id: '1', name: '食事', amount: 1000 }],
      members: [
        { id: '1', name: 'A', ratio: 1 },
        { id: '2', name: 'B', ratio: 1 },
        { id: '3', name: 'C', ratio: 1 },
      ],
      rounding: 'up',
    });
    const sum = result.perMember.reduce((s, m) => s + m.amount, 0);
    expect(sum).toBe(result.totalAmount);
  });
});
