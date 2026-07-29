# @tools/design-tokens

Elchika Tools 全アプリの oklch デザイントークン。**このパッケージが唯一の正本**。

## 使い方

各アプリの `src/index.css`:

```css
@import "@tools/design-tokens";
```

`@import "tailwindcss"` はこのパッケージが持つため、アプリ側は 1 行でよい。

## standards との関係

正準ソースは `naoto24kawa/standards` の `templates/design-tokens.css`。
変更許可トークンは `:root` の `--primary` / `--primary-foreground`、`.dark` の
`--primary` / `--primary-foreground`、light の `--warning-foreground` の5つ。standards の
暗色 warning foreground は warning 背景と 3.92:1 で WCAG AA 未達のため、明色へ変更している。
実際の standards diff 本体は4行だけである。`:root` の `--primary-foreground` は standards と
同値の `oklch(0.985 0 0)` のため、変更許可対象だが diff には現れない。他の本体差分はコピーミスである。
`tokens.css` は standards テンプレートとの diff を保つため、Oxfmt で整形しない。

standards のテンプレートが改訂されたら:

1. `diff ~/projects/naoto24kawa/standards/templates/design-tokens.css tokens.css` で差分を確認
2. 変更許可トークン5つと diff 本体4行以外の差分を取り込む
3. リポジトリルートで `pnpm exec vp test packages/design-tokens/src` を実行してコントラストが維持されているか確認

## ブランドノブ

| ノブ                | 値                     | 根拠                                                             |
| ------------------- | ---------------------- | ---------------------------------------------------------------- |
| `--primary` (light) | `oklch(0.55 0.18 255)` | 白 foreground と 4.72:1。**L を 0.57 まで上げると 4.5:1 を割る** |
| `--primary` (dark)  | `oklch(0.72 0.14 255)` | 暗色 foreground と 7.97:1                                        |

値を変更する場合は `src/__tests__/tokens.test.ts` が実計算で検証する（standards DESIGN.md §3 の MUST）。
