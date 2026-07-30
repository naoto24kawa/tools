---
trigger: next-session
created: 2026-07-29
autonomy: manual
---

# scripts/ の検証スクリプトにテストが無い（SP2 前の整備候補）

`scripts/verify-v4-migration.js`（SP1 で新設）を SP2 で 346 アプリの検証ゲートとして使う前に、
このスクリプト自体の正しさをテストで固定することを検討する。

## 背景

SP1 で、検証コードが壊れていても気づけないことが実証された。

- `verify-v4-migration.js` の G4 は当初 `builtCss.includes('oklch(0.55 0.18 255)')` で判定していた。
  minifier が `oklch(55% .18 255)` へ正規化するため、**この判定は常に失敗する**。
  ブランドノブは正しく届いているのに「届いていない」と報告するゲートだった。
- 同じ時期、人手のシェル操作で複数の grep を連結した結果、
  末尾の `printf` が `grep` の exit 1 を exit 0 へ上書きし、**無出力を「1 件ヒット」と誤記**した。

どちらも「ゲートが機能しているように見えて機能していない」状態であり、
PASS 表示からは区別できなかった。

## 現状

- `scripts/` にテストの置き場所も慣習も存在しない。
- 既存の `check-asset-paths.js` / `design-audit.js` / `health-check-*.js` にもテストが無い。
- テストは `packages/*/src/__tests__/` にのみ存在する。
- SP1 では Task 3 Step 3 の実体破壊テスト（G4 / G5 / V3 を実際に壊して FAIL を確認）で代替した。
  これは 1 回きりの確認であり、将来スクリプトを変更したときの回帰は検知できない。

## 検討する内容

`verify-v4-migration.js` を module として export できる形に分離し、各チェック関数を単体テストする。

```js
module.exports = { CHECKS, isMigrated, readBuiltCss };
if (require.main === module) { /* CLI 部分 */ }
```

テストでは fixture を文字列として持ち、次を固定する。

- 正常な生成 CSS を渡すと violation が 0 件
- `--primary` が別の値の CSS で G4 が violation を返す
- `--primary` を含まない CSS で G4 が violation を返す（握りつぶして PASS にしない）
- minify 表記（`oklch(55% .18 255)`）と非 minify 表記（`oklch(0.55 0.18 255)`）の両方で G4 が PASS する
- `hsl(var(--` を含む CSS で G3 が violation を返す
- `base: "/"` の vite.config で G5 が violation を返す

同じ整理を `check-asset-paths.js` にも適用するかは別途判断する
（こちらは `next-session-asset-gate-quote.md` のクォート非依存化と併せて検討するのが自然）。

## 判断が必要な点

- `scripts/` にテスト置き場を新設するか、スクリプトを `packages/` 側へ移すか
- SP2 の着手前に必須とするか、SP2 と並行で進めるか
  （SP1 の破壊テストで一度は実証済みのため、ブロッカーではない）

## 関連

- `next-session-asset-gate-quote.md` — 同じく検証ゲートの健全性に関する項目
- SP1 spec: `docs/superpowers/specs/2026-07-29-design-standards-adoption-design.md`
- SP1 plan: `docs/superpowers/plans/2026-07-29-sp1-design-tokens-v4-pilot.md`
