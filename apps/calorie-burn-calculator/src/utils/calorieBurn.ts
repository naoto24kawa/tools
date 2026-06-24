export interface ExerciseDef {
  id: string;
  name: string;
  category: string;
  met: number;
}

export interface CalorieBurnResult {
  kcal: number;
  fatGrams: number;
}

// MET値テーブル（厚生労働省・ACSMの身体活動のメッツ表をベース）
export const EXERCISES: ExerciseDef[] = [
  // 歩行
  { id: 'walk_slow', name: 'ゆっくり歩く (3km/h)', category: '歩行', met: 2.5 },
  { id: 'walk_normal', name: '普通歩き (4km/h)', category: '歩行', met: 3.0 },
  { id: 'walk_fast', name: '速歩き (5.5km/h)', category: '歩行', met: 4.3 },
  { id: 'walk_brisk', name: 'ウォーキング (6.5km/h)', category: '歩行', met: 5.0 },
  // ランニング
  { id: 'run_slow', name: 'ジョギング (7km/h)', category: 'ランニング', met: 7.0 },
  { id: 'run_normal', name: 'ランニング (8km/h)', category: 'ランニング', met: 8.3 },
  { id: 'run_fast', name: 'ランニング (10km/h)', category: 'ランニング', met: 10.0 },
  { id: 'run_sprint', name: 'スプリント (12km/h)', category: 'ランニング', met: 12.3 },
  { id: 'marathon', name: 'マラソン', category: 'ランニング', met: 13.3 },
  // 自転車
  { id: 'bike_slow', name: '自転車 (低速 <16km/h)', category: '自転車', met: 4.0 },
  { id: 'bike_normal', name: '自転車 (中速 16-19km/h)', category: '自転車', met: 6.0 },
  { id: 'bike_fast', name: '自転車 (高速 20-22km/h)', category: '自転車', met: 8.0 },
  { id: 'bike_racing', name: '自転車 (レース)', category: '自転車', met: 12.0 },
  // 水泳
  { id: 'swim_slow', name: '水泳（ゆっくり）', category: '水泳', met: 5.0 },
  { id: 'swim_normal', name: '水泳（クロール 中速）', category: '水泳', met: 7.0 },
  { id: 'swim_fast', name: '水泳（クロール 速い）', category: '水泳', met: 10.0 },
  { id: 'swim_back', name: '背泳ぎ', category: '水泳', met: 4.8 },
  { id: 'swim_breast', name: '平泳ぎ', category: '水泳', met: 5.3 },
  { id: 'swim_butterfly', name: 'バタフライ', category: '水泳', met: 13.8 },
  // 筋トレ
  { id: 'weight_light', name: '筋トレ（軽い）', category: '筋トレ', met: 3.0 },
  { id: 'weight_moderate', name: '筋トレ（中程度）', category: '筋トレ', met: 5.0 },
  { id: 'weight_heavy', name: '筋トレ（高強度）', category: '筋トレ', met: 6.0 },
  { id: 'pushup', name: '腕立て伏せ', category: '筋トレ', met: 3.8 },
  { id: 'situp', name: '腹筋', category: '筋トレ', met: 2.8 },
  { id: 'squat', name: 'スクワット', category: '筋トレ', met: 5.0 },
  // 有酸素運動
  { id: 'aerobics_low', name: 'エアロビクス（低強度）', category: '有酸素運動', met: 5.0 },
  { id: 'aerobics_high', name: 'エアロビクス（高強度）', category: '有酸素運動', met: 7.3 },
  { id: 'yoga', name: 'ヨガ', category: '有酸素運動', met: 2.5 },
  { id: 'pilates', name: 'ピラティス', category: '有酸素運動', met: 3.0 },
  { id: 'stretching', name: 'ストレッチ', category: '有酸素運動', met: 2.3 },
  { id: 'hiit', name: 'HIIT', category: '有酸素運動', met: 8.0 },
  // スポーツ
  { id: 'soccer', name: 'サッカー（試合）', category: 'スポーツ', met: 10.0 },
  { id: 'basketball', name: 'バスケットボール', category: 'スポーツ', met: 8.0 },
  { id: 'tennis', name: 'テニス（シングルス）', category: 'スポーツ', met: 8.0 },
  { id: 'badminton', name: 'バドミントン', category: 'スポーツ', met: 7.0 },
  { id: 'volleyball', name: 'バレーボール', category: 'スポーツ', met: 4.0 },
  { id: 'baseball', name: '野球', category: 'スポーツ', met: 5.0 },
  { id: 'golf', name: 'ゴルフ（ラウンド）', category: 'スポーツ', met: 4.8 },
  { id: 'table_tennis', name: '卓球', category: 'スポーツ', met: 4.0 },
  { id: 'bowling', name: 'ボーリング', category: 'スポーツ', met: 3.0 },
  { id: 'skiing', name: 'スキー（ダウンヒル）', category: 'スポーツ', met: 6.8 },
  { id: 'snowboard', name: 'スノーボード', category: 'スポーツ', met: 5.3 },
  // 日常活動
  { id: 'stair_climb', name: '階段昇降', category: '日常活動', met: 4.0 },
  { id: 'housework', name: '掃除（軽い）', category: '日常活動', met: 2.5 },
  { id: 'housework_heavy', name: '掃除（重い）', category: '日常活動', met: 3.5 },
  { id: 'cooking', name: '料理', category: '日常活動', met: 2.0 },
  { id: 'shopping', name: '買い物', category: '日常活動', met: 2.3 },
  { id: 'gardening', name: '庭仕事', category: '日常活動', met: 3.5 },
  { id: 'dancing', name: 'ダンス（一般）', category: '日常活動', met: 4.8 },
  { id: 'rope_jump', name: '縄跳び', category: '日常活動', met: 10.0 },
  { id: 'hula_hoop', name: 'フラフープ', category: '日常活動', met: 3.0 },
];

/** 消費カロリー = MET × 体重(kg) × 時間(h) × 1.05 */
export function calcCalorieBurn(
  weightKg: number,
  metValue: number,
  minutes: number,
): CalorieBurnResult {
  if (weightKg <= 0) throw new Error('Weight must be positive');
  if (metValue <= 0) throw new Error('MET value must be positive');
  if (minutes < 0) throw new Error('Minutes must be non-negative');

  const kcal = metValue * weightKg * (minutes / 60) * 1.05;
  const fatGrams = kcal / 7.2;

  return { kcal, fatGrams };
}
