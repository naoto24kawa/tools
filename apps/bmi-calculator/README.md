# BMI Calculator

BMI・標準体重・肥満度計算（日本肥満学会基準）。

## 概要

身長・体重を入力するとBMI・肥満度カテゴリ・標準体重・健康体重範囲をリアルタイム計算するブラウザツール。日本肥満学会基準（BMI 25以上を肥満）に準拠。

## 機能

- BMI計算（メートル法 / ヤード・ポンド法の切り替え対応）
- 肥満度カテゴリ表示（低体重 / 普通体重 / 肥満1〜4度）
- 標準体重（BMI 22）計算
- 健康体重範囲（BMI 18.5〜24.9）表示

## 技術スタック

- SPA: React 19 + TypeScript + Vite+
- UI: Tailwind CSS 3.4 + shadcn/ui (Radix UI)
- デプロイ: Cloudflare Workers + Static Assets
- 完全クライアントサイド処理（サーバー通信なし）

## コマンド

```bash
vp dev       # 開発サーバー (port 5465)
vp build     # ビルド
vp test      # テスト
```
