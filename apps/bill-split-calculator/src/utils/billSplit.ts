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

  const perMember: MemberShare[] = members.map((member) => ({
    memberId: member.id,
    memberName: member.name,
    amount: applyRounding((totalAmount * member.ratio) / totalRatio, rounding),
  }));

  const lines = perMember.map(
    (m) => `${m.memberName}: ${m.amount.toLocaleString('ja-JP')}円`,
  );
  const summaryText = [
    `合計: ${totalAmount.toLocaleString('ja-JP')}円`,
    ...lines,
  ].join('\n');

  return { totalAmount, perMember, summaryText };
}
