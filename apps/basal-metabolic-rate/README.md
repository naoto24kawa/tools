# Basal Metabolic Rate

基礎代謝・1日の必要カロリー計算

## 概要

Harris-Benedict改訂版（1984年）とMifflin-St Jeor式（1990年）を用いた基礎代謝（BMR）と1日の総消費カロリー（TDEE）の計算ツール。

## 機能

- BMR計算: Harris-Benedict式 / Mifflin-St Jeor式の切り替え対応
- TDEE計算: 活動レベル（5段階）に応じた1日消費カロリー算出
- 目標カロリー: 減量/維持/増量の目安カロリーを表示

## 技術スタック

- React 19 + TypeScript (strict)
- Vite+ / Vite 8
- Tailwind CSS 3.4 + shadcn/ui
- Cloudflare Workers + Static Assets

## コマンド

```bash
vp dev        # 開発サーバー (port: 5467)
vp build      # ビルド
vp test       # ユニットテスト
```
