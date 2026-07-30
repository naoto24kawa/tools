---
trigger: next-session
created: 2026-07-31
autonomy: manual
---

# packages/router/public/ に v3 時代の残骸が 1390 ファイル堆積している

## 背景

`scripts/build-all.sh` はアプリの成果物を次の 1 行でコピーする（`scripts/build-all.sh:23`）。

```sh
cp -r "$app/dist/"* "packages/router/public/$app_name/"
```

**コピー先を消さないため、ファイル名ハッシュが変わった旧アセットが削除されずに残る。**
SP2（`6335c6dd`）で全 346 アプリのハッシュが変わった結果、v3 時代のアセットがそのまま残留し、
git 管理下に入った状態でマージされている。

## 実測値（2026-07-30、SP2 完了ゲート時点）

| 分類 | ファイル数 |
|---|---:|
| `public/` 総数 | 4175 |
| 現行（再ビルドで生成された） | 2785 |
| 残骸（再生成されなかった） | 1390（js 1018 / css 371 / html 1） |

残骸が v3 であることは実測で確定した。残骸側 CSS 5 件はすべて `oklch` 0 件・`hsl(` 1 件、
現行側 CSS 5 件はすべて `oklch` 1 件・`hsl(` 0 件で、新旧がきれいに分離している。

## 配信への影響

**ない。** 各アプリの `index.html` は現行アセットだけを参照しており、
`node scripts/check-asset-paths.js` は 346 / 346・違反 0 件を返す。
実害はリポジトリと Cloudflare Workers Static Assets に死んだファイルが載り続けること
（容量と、旧コードがハッシュ URL で到達可能なまま残ること）。

## やること

1. **残骸の掃除**: `packages/router/public/` を一度空にしてから `bash scripts/build-all.sh` を実行し、
   差分をコミットする。`public/` は git 管理が必須である点に注意
   （`.github/workflows/deploy.yml` はビルドせず、**コミットされている `public/` がそのまま本番になる**）
2. **再発防止**: `build-all.sh` がコピー前にアプリのディレクトリを消すようにする。
   ただし全消しは「ビルドに失敗したアプリのディレクトリが消える」危険があるため、
   アプリ単位で `rm -rf "packages/router/public/$app_name"` してから `cp` する形が安全

## 完了条件

1. `bash scripts/build-all.sh` が exit 0
2. `node scripts/check-asset-paths.js` が exit 0（346 / 346・違反 0 件）
3. `node scripts/verify-v4-migration.js` が exit 0（346 / 346 PASS）
4. `public/` のファイル総数が現行分のみに減っている（掃除前 4175 → 掃除後は約 2785 が目安）
5. 掃除後に再度 `build-all.sh` を実行しても `git status --short` が clean（＝冪等・残骸が増えない）

## 注意

- **ワークツリーが違うとビルド成果物が変わる（実測）。** SP2 完了ゲートで、同一コミット・
  同一 lockfile にもかかわらず、main のチェックアウトと worktree で **335 アプリの JS ハッシュが
  一致しなかった**。各ワークツリー内では 2 回ビルドしても同一ハッシュで決定的であり、
  非決定性ではなく環境差である。差分は Radix UI 内部実装の細部で、両方とも production ビルド
  （`process.env` 置換済み・dev バンドルなし）であり機能的な優劣はない。
  原因は main の `node_modules` が worktree の上位集合で、storybook 系など 16 パッケージを
  余分に持つことによる peer 解決の差と見られる（`vite` / `rolldown` / `vite-plus` /
  `@radix-ui/react-toast` の各バージョンは同一であることを確認済み）。

  **したがってこの掃除を行うワークツリーを決めてから着手し、そこで生成した成果物一式を
  コミットすること。** 別ワークツリーでビルドし直して部分的に混ぜてはならない。
  SP2 完了ゲートでは、コミット済み（検証・目視を通した worktree 由来）の成果物を正とし、
  main で再ビルドした差分は `git checkout` / `git clean` で破棄した
- **`verify-v4-migration.js` は `apps/*/dist` を見る。** 検証前に必ず再ビルドすること。
  古い `dist` が残っていると「生成 CSS に oklch が存在しない」と**偽の失敗**を出す
  （SP2 完了ゲートで実際に main 側で発生し、1 / 346 PASS と表示された。
  再ビルド後は 346 / 346 PASS になることを実測で確認した）
- 検証コマンドを `;` や `&&` で連結しない
- `packages/router/public/index.html` は参照先（`/assets/...`）が実在しない残骸だが、
  ルーターが `/` を `/home/` へ 302 するため配信経路がない。SP2 とは無関係の既存状態であり、
  この掃除のついでに扱うかは別途判断する

## 出典

`.docs/verification/2026-07-30-sp2-completion-gate.md` の「発見事項」
