---
trigger: after-deploy
created: 2026-06-02
deploy_status: confirmed
pr: 837
autonomy: manual
---

# PR #837 デプロイ後確認: Deploy ワークフロー復活

pnpm 対応の Deploy ワークフローが正常に動作しているか確認する。

## 確認項目

### 1. 本番サイト（最重要）
- [ ] https://tools.elchika.app/ にアクセスして正常表示されること
- [ ] ホームページから各ツールへのリンクが機能すること
- [ ] PR #835/#836 の修正（ルートリダイレクト・ratio calculator）が反映されていること

### 2. Deploy ワークフロー動作
- [ ] GitHub Actions → Deploy ワークフローが成功していること ✅（2026-06-02 確認済み）
- [ ] `packages/router/public/` の静的アセットが正しくデプロイされていること

### 3. 代表ツール動作確認
- [ ] https://tools.elchika.app/ratio-calculator/ が表示されること
- [ ] ratio calculator で long:short の計算が正しく動作すること（PR #835 の修正）

### 4. 今後の CI 継続性
- [ ] 次回 main push 時に Deploy ワークフローが自動で走ること
- [ ] Node.js 20 → 22 への更新（2026-06-16 の Node 20 EOL 対応）

## 備考
- `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` は 2026-06-02 に GitHub Secrets へ登録済み
- Node.js 20 deprecation warning あり → 別途 `node-version: '22'` に更新する

## 関連
- PR: https://github.com/naoto24kawa/tools/pull/837
