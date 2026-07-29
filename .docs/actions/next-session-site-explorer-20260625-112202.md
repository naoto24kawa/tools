---
trigger: next-session
created: 2026-06-25
---

# site-explorer サイクル 20260625-112202 -- 未解消 Issue の確認

サイクル 20260625-112202（2026-06-25）で以下の Issue が検出されました。
**Issue を手動 Close しないでください。** 修正後に site-explorer を再実行し、サイクルの diff で解消を確認してから自動 Close します。

## 未解消 Issue 一覧

| Issue | タイトル | 重大度 | フェーズ |
|-------|---------|--------|---------|
| #847 | depth-of-field が白画面 (React useMemo エラー) | High | Phase 3 |

## 対応手順

1. `apps/depth-of-field` の Reactインスタンス重複または Hooks ルール違反を修正してデプロイ
2. `depth-of-field` を含む URL セットで site-explorer を再実行
3. 差分レポートで ✅ 解消 に分類されたことを確認
4. エージェントが自動で `gh issue close #847` します

## 前回サイクルファイル

`.docs/explorer-cycles/20260625-112202.md`
