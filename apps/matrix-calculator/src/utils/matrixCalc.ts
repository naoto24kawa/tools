export type Matrix = number[][];

export function createMatrix(rows: number, cols: number, fill = 0): Matrix {
  return Array.from({ length: rows }, () => Array(cols).fill(fill));
}

export function add(a: Matrix, b: Matrix): Matrix {
  if (a.length !== b.length || a[0].length !== b[0].length) {
    throw new Error('Matrices must have the same dimensions for addition');
  }
  return a.map((row, i) => row.map((val, j) => val + b[i][j]));
}

export function subtract(a: Matrix, b: Matrix): Matrix {
  if (a.length !== b.length || a[0].length !== b[0].length) {
    throw new Error('Matrices must have the same dimensions for subtraction');
  }
  return a.map((row, i) => row.map((val, j) => val - b[i][j]));
}

export function multiply(a: Matrix, b: Matrix): Matrix {
  if (a[0].length !== b.length) {
    throw new Error(
      'Number of columns in first matrix must equal number of rows in second matrix'
    );
  }
  const rows = a.length;
  const cols = b[0].length;
  const k = a[0].length;
  const result = createMatrix(rows, cols);
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let sum = 0;
      for (let p = 0; p < k; p++) {
        sum += a[i][p] * b[p][j];
      }
      result[i][j] = sum;
    }
  }
  return result;
}

export function scalarMultiply(m: Matrix, scalar: number): Matrix {
  return m.map((row) => row.map((val) => val * scalar));
}

export function transpose(m: Matrix): Matrix {
  const rows = m.length;
  const cols = m[0].length;
  const result = createMatrix(cols, rows);
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      result[j][i] = m[i][j];
    }
  }
  return result;
}

function getMinor(m: Matrix, row: number, col: number): Matrix {
  return m
    .filter((_, i) => i !== row)
    .map((r) => r.filter((_, j) => j !== col));
}

export function determinant(m: Matrix): number {
  const n = m.length;
  if (n !== m[0].length) {
    throw new Error('Matrix must be square to compute determinant');
  }
  if (n === 1) return m[0][0];
  if (n === 2) return m[0][0] * m[1][1] - m[0][1] * m[1][0];

  let det = 0;
  for (let j = 0; j < n; j++) {
    const sign = j % 2 === 0 ? 1 : -1;
    det += sign * m[0][j] * determinant(getMinor(m, 0, j));
  }
  return det;
}

export function inverse(m: Matrix): Matrix {
  const n = m.length;
  if (n !== m[0].length) {
    throw new Error('Matrix must be square to compute inverse');
  }
  const det = determinant(m);
  if (det === 0) {
    throw new Error('Matrix is singular and cannot be inverted');
  }

  if (n === 1) {
    return [[1 / m[0][0]]];
  }

  if (n === 2) {
    return [
      [m[1][1] / det, -m[0][1] / det],
      [-m[1][0] / det, m[0][0] / det],
    ];
  }

  // Cofactor matrix
  const cofactors = createMatrix(n, n);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const sign = (i + j) % 2 === 0 ? 1 : -1;
      cofactors[i][j] = sign * determinant(getMinor(m, i, j));
    }
  }

  // Adjugate (transpose of cofactor matrix)
  const adj = transpose(cofactors);

  // Inverse = adjugate / determinant
  return scalarMultiply(adj, 1 / det);
}

export function determinantSteps(m: Matrix): string[] {
  const n = m.length;
  const steps: string[] = [];

  if (n !== m[0].length) {
    steps.push('Error: Matrix must be square');
    return steps;
  }

  const matStr = (mat: Matrix) =>
    `[${mat.map((r) => `[${r.join(', ')}]`).join(', ')}]`;

  steps.push(`Input matrix: ${matStr(m)}`);

  if (n === 1) {
    steps.push(`det = ${m[0][0]}`);
    return steps;
  }

  if (n === 2) {
    steps.push(`det = (${m[0][0]} * ${m[1][1]}) - (${m[0][1]} * ${m[1][0]})`);
    steps.push(`det = ${m[0][0] * m[1][1]} - ${m[0][1] * m[1][0]}`);
    steps.push(`det = ${determinant(m)}`);
    return steps;
  }

  steps.push('Expanding along the first row (cofactor expansion):');
  const terms: string[] = [];
  for (let j = 0; j < n; j++) {
    const sign = j % 2 === 0 ? '+' : '-';
    const minor = getMinor(m, 0, j);
    const minorDet = determinant(minor);
    terms.push(`${sign} ${m[0][j]} * det(M[0,${j}]) = ${sign} ${m[0][j]} * ${minorDet}`);
  }
  steps.push(terms.join('\n'));
  steps.push(`det = ${determinant(m)}`);

  return steps;
}

export function formatMatrix(m: Matrix): string {
  return m.map((row) => row.map((v) => (Number.isInteger(v) ? v : v.toFixed(4))).join('\t')).join('\n');
}
