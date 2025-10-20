/**
 * 数値バリデーション結果
 */
export type NumberValidationResult = {
  isValid: boolean;
  value: number | null;
};

/**
 * 数値範囲の制約
 */
export type NumberConstraints = {
  min?: number;
  max?: number;
  /** trueの場合、min/max を含む (>=, <=) */
  inclusive?: boolean;
};

/**
 * 入力文字列を整数としてパースし、バリデーションを行う
 *
 * @param input - パース対象の文字列
 * @param constraints - 数値の制約条件
 * @returns バリデーション結果
 *
 * @example
 * // 1以上の整数
 * validateNumberInput("42", { min: 1 })
 * // => { isValid: true, value: 42 }
 *
 * @example
 * // 1-100の範囲
 * validateNumberInput("150", { min: 1, max: 100, inclusive: true })
 * // => { isValid: false, value: null }
 */
export function validateNumberInput(
  input: string,
  constraints: NumberConstraints = {}
): NumberValidationResult {
  const value = parseInt(input, 10);

  if (isNaN(value)) {
    return { isValid: false, value: null };
  }

  const { min, max, inclusive = true } = constraints;

  if (min !== undefined) {
    if (inclusive ? value < min : value <= min) {
      return { isValid: false, value: null };
    }
  }

  if (max !== undefined) {
    if (inclusive ? value > max : value >= max) {
      return { isValid: false, value: null };
    }
  }

  return { isValid: true, value };
}

/**
 * 数値入力用の onChange ハンドラーを生成する
 *
 * @param callback - バリデーション成功時のコールバック
 * @param constraints - 数値の制約条件
 * @returns React の onChange ハンドラー
 *
 * @example
 * const handleWidthChange = createNumberInputHandler(onWidthChange, { min: 1, max: 10000 });
 */
export function createNumberInputHandler(
  callback: (value: number) => void,
  constraints: NumberConstraints = {}
) {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    const result = validateNumberInput(e.target.value, constraints);
    if (result.isValid && result.value !== null) {
      callback(result.value);
    }
  };
}
