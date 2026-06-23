export interface RetirementParams {
  currentAge: number;
  retireAge: number;
  targetAge: number;
  currentAssets: number;
  monthlyContribution: number;
  monthlyExpenseAfterRetire: number;
  annualRate: number;
}

export interface RetirementEntry {
  age: number;
  balance: number;
  phase: 'accumulation' | 'withdrawal';
}

export interface RetirementResult {
  assetsAtRetirement: number;
  depletionAge: number | null;
  yearlyBreakdown: RetirementEntry[];
}

export function calcRetirement(params: RetirementParams): RetirementResult {
  const {
    currentAge,
    retireAge,
    targetAge,
    currentAssets,
    monthlyContribution,
    monthlyExpenseAfterRetire,
    annualRate,
  } = params;

  if (retireAge < currentAge) throw new Error('Retire age must be greater than or equal to current age');
  if (targetAge <= retireAge) throw new Error('Life expectancy must be greater than retire age');

  const monthlyRate = annualRate / 100 / 12;
  const yearlyBreakdown: RetirementEntry[] = [];
  let balance = currentAssets;
  let depletionAge: number | null = null;

  for (let age = currentAge; age <= targetAge; age++) {
    const isAccumulation = age < retireAge;
    const monthlyFlow = isAccumulation ? monthlyContribution : -monthlyExpenseAfterRetire;

    for (let m = 0; m < 12; m++) {
      balance = balance * (1 + monthlyRate) + monthlyFlow;
      if (balance < 0 && depletionAge === null) {
        depletionAge = age + (m + 1) / 12;
        balance = 0;
      }
    }

    yearlyBreakdown.push({
      age,
      balance,
      phase: isAccumulation ? 'accumulation' : 'withdrawal',
    });
  }

  const retirementEntry = yearlyBreakdown.find((e) => e.age === retireAge - 1);
  const assetsAtRetirement = retirementEntry?.balance ?? currentAssets;

  return { assetsAtRetirement, depletionAge, yearlyBreakdown };
}
