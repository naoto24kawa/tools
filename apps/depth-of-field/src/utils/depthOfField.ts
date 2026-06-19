export interface SensorSize {
  id: string;
  label: string;
  coc: number; // 許容錯乱円径 (mm)
}

export interface DofParams {
  focalLength: number; // mm
  fNumber: number;
  subjectDistance: number; // mm
  sensorId: string;
}

export interface DofResult {
  dof: number; // mm (Infinity の場合あり)
  nearLimit: number; // mm
  farLimit: number; // mm (Infinity の場合あり)
  hyperfocalDistance: number; // mm
  coc: number; // mm
}

export const SENSOR_SIZES: SensorSize[] = [
  { id: 'fullframe', label: 'フルサイズ (35mm)', coc: 0.03 },
  { id: 'apsc_canon', label: 'APS-C (Canon)', coc: 0.019 },
  { id: 'apsc_nikon', label: 'APS-C (Nikon/Sony)', coc: 0.02 },
  { id: 'mft', label: 'マイクロフォーサーズ', coc: 0.015 },
  { id: 'one_inch', label: '1型', coc: 0.011 },
];

export function calcDepthOfField(params: DofParams): DofResult {
  const { focalLength, fNumber, subjectDistance, sensorId } = params;

  if (focalLength <= 0) throw new Error('Focal length must be positive');
  if (fNumber <= 0) throw new Error('f-number must be positive');
  if (subjectDistance <= 0) throw new Error('Subject distance must be positive');

  const sensor = SENSOR_SIZES.find((s) => s.id === sensorId);
  if (!sensor) throw new Error(`Unknown sensor: ${sensorId}`);

  const { coc } = sensor;
  const f = focalLength;
  const N = fNumber;
  const d = subjectDistance;

  // 超焦点距離: H = f² / (N × c) + f
  const H = (f * f) / (N * coc) + f;

  // 前景限界: Dn = d(H-f) / (H+d-2f)
  const Dn = (d * (H - f)) / (H + d - 2 * f);

  // 後景限界: Df = d(H-f) / (H-d)
  const HminusD = H - d;
  const Df = HminusD <= 0 ? Infinity : (d * (H - f)) / HminusD;

  const dof = Df === Infinity ? Infinity : Df - Dn;

  return {
    dof,
    nearLimit: Dn,
    farLimit: Df,
    hyperfocalDistance: H,
    coc,
  };
}
