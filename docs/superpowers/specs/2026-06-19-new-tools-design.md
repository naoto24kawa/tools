# 新規ツール追加設計書

**作成日**: 2026-06-19  
**参考サイト**: zeller-lab.com/img-width/, keisan.site  
**追加数**: 16ツール（重複なし確認済み）

---

## アーキテクチャ方針

既存パターンに完全準拠する。各ツールは独立 SPA として `apps/<tool-name>/` に追加し、ビルド後に `packages/router/public/<tool-name>/` へ配置される。

### 各ツールの構成
```
apps/<tool-name>/
  src/
    App.tsx              # メインコンポーネント（ロジック + UI）
    main.tsx             # エントリポイント
    components/ui/       # shadcn/ui コンポーネント（コピー）
    utils/
      <logic>.ts         # コアロジック（純粋関数）
      __tests__/         # ユニットテスト
  index.html
  package.json
  vite.config.ts
  tailwind.config.js
  tsconfig.json
  postcss.config.js
```

### 新規カテゴリ追加
`packages/router/src/config/apps.ts` の `AppCategory` 型に 4 カテゴリを追加する。

```typescript
export type AppCategory =
  | 'Text' | 'Encode' | 'Crypto' | 'Number' | 'DateTime'
  | 'JSON' | 'Code' | 'Color / CSS' | 'Image' | 'PDF'
  | 'Video' | 'Generator' | 'Network'
  // 追加
  | 'Finance'      // お金・金融系
  | 'Health'       // 健康・身体系
  | 'Life'         // 生活・環境・暦系
  | 'Design';      // デザイン・写真系
```

---

## PR 構成（カテゴリ別 4PR）

### PR-1: Design（デザイン・写真）
- `golden-ratio`
- `image-grid-calculator`
- `photo-exposure`
- `depth-of-field`

### PR-2: Finance（お金）
- `savings-calculator`
- `retirement-calculator`
- `break-even-calculator`
- `bill-split-calculator`

### PR-3: Health（健康）
- `bmi-calculator`
- `calorie-burn-calculator`
- `basal-metabolic-rate`

### PR-4: Life（生活・環境・暦）
- `biorhythm`
- `yakudoshi-calculator`
- `electricity-cost`
- `fuel-cost-calculator`
- `co2-footprint`

---

## ツール個別仕様

### PR-1: Design

#### `golden-ratio`
- **displayName**: Golden Ratio
- **icon**: φ
- **description**: 黄金比・白銀比・各種比率から寸法計算
- **機能**:
  - 入力: 幅または高さの数値
  - 出力: 黄金比(1:1.618)、白銀比(1:√2)、青銅比(1:3.303)、三分割の長辺・短辺
  - コピーボタン付き結果表示
- **ロジック**: `utils/goldenRatio.ts`
  - `calcRatio(input: number, side: 'width'|'height', ratio: number): number`

#### `image-grid-calculator`
- **displayName**: Image Grid
- **icon**: 🔲
- **description**: コンテナ幅・画像サイズ・ギャップから何枚並ぶか計算
- **機能**:
  - 入力: コンテナ幅 / 画像幅 / gap(px)
  - 出力: 何列並ぶか / 余白(px) / CSS grid-template-columns の提案
  - 逆算モード: 列数指定→推奨画像幅
- **ロジック**: `utils/imageGrid.ts`
  - `calcGridColumns(containerWidth: number, imageWidth: number, gap: number): GridResult`
  - `calcImageWidth(containerWidth: number, columns: number, gap: number): number`

#### `photo-exposure`
- **displayName**: Exposure Calculator
- **icon**: 📷
- **description**: EV値・f値・ISO・シャッタースピードの相互計算
- **機能**:
  - 4値（EV, f値, ISO, SS）のうち3つを入力→残り1つを算出
  - 標準露出表（EV 値一覧）の表示
  - 標準的なf値/ISO/SS選択肢をドロップダウン提供
- **ロジック**: `utils/exposure.ts`
  - EV = log2(f² / t) + log2(ISO/100) の式群
  - `calcMissingValue(known: Partial<ExposureValues>): ExposureValues`

#### `depth-of-field`
- **displayName**: Depth of Field
- **icon**: 🔭
- **description**: 焦点距離・f値・被写体距離・センサーサイズから被写界深度計算
- **機能**:
  - 入力: 焦点距離(mm) / f値 / 被写体距離(m) / センサーサイズ(フルサイズ/APS-C/MFT/1型)
  - 出力: 許容錯乱円径 / 被写界深度(前景・背景) / 超焦点距離
  - センサーサイズ別CoC定数を内蔵
- **ロジック**: `utils/depthOfField.ts`
  - `calcDepthOfField(params: DofParams): DofResult`

---

### PR-2: Finance

#### `savings-calculator`
- **displayName**: Savings Calculator
- **icon**: 💰
- **description**: 積立シミュレーション（目標額・期間・利率から月額計算）
- **機能**:
  - モード①: 月額・期間・利率→元本合計・利息・最終残高
  - モード②: 目標額・期間・利率→必要月額
  - 年/月の積立グラフ（Canvas）
  - ※ compound-interest との差異: 「目標額から逆算」機能と積立専用 UI
- **ロジック**: `utils/savings.ts`
  - `calcSavings(params: SavingsParams): SavingsResult`
  - `calcRequiredMonthly(target: number, years: number, rate: number): number`

#### `retirement-calculator`
- **displayName**: Retirement Calculator
- **icon**: 🏖
- **description**: 老後資金シミュレーション（現在資産・積立・取崩しフェーズ）
- **機能**:
  - 入力: 現在年齢 / 退職年齢 / 寿命目標 / 現在資産 / 月積立額 / 退職後月支出 / 利率
  - 出力: 退職時資産額 / 資産が尽きる年齢 / 年齢別資産推移グラフ
- **ロジック**: `utils/retirement.ts`
  - `calcRetirement(params: RetirementParams): RetirementResult`

#### `break-even-calculator`
- **displayName**: Break-Even Point
- **icon**: 📊
- **description**: 損益分岐点計算（固定費・変動費・売上高）
- **機能**:
  - 入力: 固定費 / 変動費率(%) / 売上高
  - 出力: 損益分岐点売上高 / 安全余裕率 / 営業レバレッジ / 損益グラフ
  - 複数シナリオ比較
- **ロジック**: `utils/breakEven.ts`
  - `calcBreakEven(fixedCost: number, variableRatio: number, revenue: number): BreakEvenResult`

#### `bill-split-calculator`
- **displayName**: Bill Split
- **icon**: 🧾
- **description**: 割り勘計算（品目別・端数処理・不均等割り対応）
- **機能**:
  - 品目リスト入力（名前・金額）
  - 参加者リスト（名前・人数分比率設定可）
  - 端数処理: 切り上げ/切り捨て/四捨五入
  - 出力: 一人当たり明細 / コピー用テキスト
  - ※ tip-calculator との差異: チップ計算なし、品目別割り勘に特化
- **ロジック**: `utils/billSplit.ts`
  - `splitBill(items: BillItem[], members: Member[], rounding: RoundingMode): SplitResult`

---

### PR-3: Health

#### `bmi-calculator`
- **displayName**: BMI Calculator
- **icon**: ⚖️
- **description**: BMI・標準体重・肥満度計算（WHO/日本肥満学会基準）
- **機能**:
  - 入力: 身長(cm) / 体重(kg) / 性別（標準体重計算用）
  - 出力: BMI値 / 肥満度分類（低体重/普通/過体重/肥満I-IV度）/ 標準体重 / 理想体重範囲
  - ゲージ表示（BMIスケール視覚化）
  - 単位切替: cm/kg ↔ ft/lb
- **ロジック**: `utils/bmi.ts`
  - `calcBMI(height: number, weight: number): BMIResult`
  - `getIdealWeight(height: number): { min: number; max: number }`

#### `calorie-burn-calculator`
- **displayName**: Calorie Burn
- **icon**: 🔥
- **description**: 運動別消費カロリー計算（MET値使用）
- **機能**:
  - 入力: 体重(kg) / 運動種目（50種以上）/ 時間(分)
  - 出力: 消費カロリー(kcal) / 脂肪燃焼量(g) / 基礎代謝との比率
  - 運動種目リスト: ウォーキング・ランニング・水泳・自転車・筋トレ等
  - 複数運動の合計計算
- **ロジック**: `utils/calorieBurn.ts`
  - MET値テーブル（50種以上）内蔵
  - `calcCalorieBurn(weight: number, metValue: number, minutes: number): number`
  - 消費カロリー = MET × 体重(kg) × 時間(h) × 1.05

#### `basal-metabolic-rate`
- **displayName**: Basal Metabolic Rate
- **icon**: 💪
- **description**: 基礎代謝・1日の必要カロリー計算
- **機能**:
  - 入力: 身長 / 体重 / 年齢 / 性別 / 活動レベル（5段階）
  - 出力: BMR（Harris-Benedict式・ミフリン-St.ジョア式）/ TDEE / 目標別カロリー目安（減量/維持/増量）
  - 式の切替: Harris-Benedict ↔ Mifflin-St Jeor
- **ロジック**: `utils/bmr.ts`
  - `calcHarrisBenedict(params: BMRParams): number`
  - `calcMifflin(params: BMRParams): number`
  - `calcTDEE(bmr: number, activityLevel: ActivityLevel): number`

---

### PR-4: Life

#### `biorhythm`
- **displayName**: Biorhythm
- **icon**: 🌊
- **description**: 生年月日からバイオリズム波形を計算・表示
- **機能**:
  - 入力: 生年月日 / 基準日（デフォルト: 今日）
  - 出力: 身体(23日周期) / 感情(28日周期) / 知性(33日周期) の波形グラフ
  - 30日間の日別値テーブル
  - 「今日の調子」サマリー
- **ロジック**: `utils/biorhythm.ts`
  - `calcBiorhythm(birthDate: Date, targetDate: Date): BiorhythmValues`
  - 値 = sin(2π × 経過日数 / 周期)

#### `yakudoshi-calculator`
- **displayName**: Yakudoshi
- **icon**: 🎎
- **description**: 厄年・八方塞がり・小厄を生年月日から計算
- **機能**:
  - 入力: 生年月日 / 性別
  - 出力: 前厄・本厄・後厄の年齢・年号（西暦・和暦）/ 八方塞がり / 小厄
  - 男性: 25, 42, 61歳 / 女性: 19, 33, 37, 61歳（本厄）
  - 今年・前後5年のカレンダー表示
- **ロジック**: `utils/yakudoshi.ts`
  - `calcYakudoshi(birthDate: Date, gender: 'male'|'female'): YakudoshiResult`

#### `electricity-cost`
- **displayName**: Electricity Cost
- **icon**: ⚡
- **description**: 電気料金計算（kWh使用量と料金プランから月額試算）
- **機能**:
  - 入力: 月間使用量(kWh) / 契約アンペア / 電力会社・プラン選択（主要プリセット）/ またはカスタム単価
  - 出力: 基本料金 / 従量料金 / 燃料費調整額（概算）/ 合計 / 年間推計
  - 家電別消費量シミュレーション（エアコン・冷蔵庫等の時間入力）
- **ロジック**: `utils/electricityCost.ts`
  - 主要電力会社料金テーブル（東電・関電・中電等）
  - `calcElectricityCost(usage: number, plan: ElectricPlan): CostResult`

#### `fuel-cost-calculator`
- **displayName**: Fuel Cost
- **icon**: ⛽
- **description**: 燃費・ガソリン代・CO2排出量計算
- **機能**:
  - 入力: 走行距離(km) / 燃費(km/L) / ガソリン価格(円/L)
  - 出力: 必要燃料量(L) / ガソリン代(円) / CO2排出量(kg)
  - 月/年換算
  - EV比較モード: kWh単価入力で電費との比較
- **ロジック**: `utils/fuelCost.ts`
  - `calcFuelCost(distance: number, fuelEfficiency: number, pricePerLiter: number): FuelResult`
  - CO2排出係数: 2.322 kg-CO2/L（ガソリン）

#### `co2-footprint`
- **displayName**: CO2 Footprint
- **icon**: 🌍
- **description**: 生活行動別CO2排出量計算（カーボンフットプリント）
- **機能**:
  - カテゴリ: 電気 / ガス / 自動車 / 飛行機 / 食事
  - 各カテゴリの使用量を入力→CO2換算(kg)
  - 合計 / 日本人平均との比較 / 削減提案
  - 月・年単位の切替
- **ロジック**: `utils/co2Footprint.ts`
  - 排出係数テーブル（環境省公表値ベース）
  - `calcCO2(category: CO2Category, amount: number, unit: string): number`

---

## 共通実装方針

- すべてのコアロジックは `src/utils/<name>.ts` に純粋関数として実装
- ユニットテストを `src/utils/__tests__/<name>.test.ts` に作成（境界値・正常系・異常系）
- グラフが必要なツール（`savings-calculator`, `retirement-calculator`, `break-even-calculator`, `biorhythm`）は Canvas API を使用（既存 `compound-interest` と同パターン）
- 数値入力はすべて `NaN` チェック・範囲バリデーション必須
- 結果のコピーボタン（`useToast` + `navigator.clipboard`）は全ツールに実装

## `apps.ts` 追記内容

各ツールを以下のフォーマットで追記:
```typescript
{ path: '/golden-ratio', url: 'https://tools-golden-ratio.elchika.app', icon: 'φ', displayName: 'Golden Ratio', description: '黄金比・白銀比から寸法計算', category: 'Design' },
```

※ `url` フィールドはレガシー（現在は static assets から配信するため未使用）。慣習に合わせてダミー URL を設定する。
