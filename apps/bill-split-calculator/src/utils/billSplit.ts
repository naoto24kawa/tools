export type RoundingMode = 'up' | 'down' | 'nearest';

export interface BillItem {
  id: string;
  name: string;
  amount: number;
}

export interface Member {
  id: string;
  name: string;
  ratio: number;
}

export interface MemberShare {
  memberId: string;
  memberName: string;
  amount: number;
}

export interface SplitParams {
  items: BillItem[];
  members: Member[];
  rounding: RoundingMode;
}

export interface SplitResult {
  totalAmount: number;
  perMember: MemberShare[];
  summaryText: string;
}

function applyRounding(value: number, mode: RoundingMode): number {
  switch (mode) {
    case 'up':
      return Math.ceil(value);
    case 'down':
      return Math.floor(value);
    case 'nearest':
      return Math.round(value);
  }
}

export function splitBill(params: SplitParams): SplitResult {
  const { items, members, rounding } = params;
  if (members.length === 0) throw new Error('At least one member required');

  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
  const totalRatio = members.reduce((sum, m) => sum + m.ratio, 0);
  if (totalRatio <= 0) throw new Error('Total ratio must be positive');

  const perMember: MemberShare[] = [];
  let assigned = 0;
  members.forEach((member, idx) => {
    const raw = (totalAmount * member.ratio) / totalRatio;
    const amount =
      idx === members.length - 1
        ? totalAmount - assigned // 最後のメンバーが端数を吸収し合計を一致させる
        : applyRounding(raw, rounding);
    assigned += amount;
    perMember.push({ memberId: member.id, memberName: member.name, amount });
  });

  const lines = perMember.map(
    (m) => `${m.memberName}: ${m.amount.toLocaleString('ja-JP')}円`,
  );
  const summaryText = [
    `合計: ${totalAmount.toLocaleString('ja-JP')}円`,
    ...lines,
  ].join('\n');

  return { totalAmount, perMember, summaryText };
}
