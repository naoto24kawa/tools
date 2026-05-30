# AI Design Rules — Elchika Tools

このファイルを読んでから `apps/` 配下の UI コードを書く・レビューすること。

## 使い方

- **新規アプリ生成時**: MUST ルールをすべて適用し、コードテンプレートをそのまま使う
- **既存アプリ監査時**: `node scripts/design-audit.js --app=<name>` を実行し、ルール ID で違反を特定して修正する

---

## DS-001: ページラッパー

**MUST** アプリ全体を `min-h-screen bg-background` で囲む

```tsx
// ✅
export default function App() {
  return (
    <div className="min-h-screen bg-background">
      {/* ... */}
    </div>
  );
}

// ❌ bg-white / bg-gray-50 / h-full など shadcn トークン以外
```

---

## DS-002: ヘッダー構造

**MUST** header 要素内に「← Tools トップに戻る」リンク・h1・説明文を配置する

```tsx
// ✅
<header className="border-b bg-card shadow-sm">
  <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
    <div className="mb-2">
      <a href="/" className="text-sm text-primary hover:underline">← Tools トップに戻る</a>
    </div>
    <h1 className="text-3xl font-bold tracking-tight">🔧 Tool Name</h1>
    <p className="mt-1 text-sm text-muted-foreground">ツールの説明文。</p>
  </div>
</header>

// ❌ バックリンクなし / <div> でヘッダー代替 / インラインスタイル
```

---

## DS-003: ボタン

**MUST** shadcn `<Button>` に `type="button"` を付与する
**MUST NOT** ネイティブ `<button>` を type 属性なしで使う
**MUST NOT** `<div onClick>` でボタンを代替する

```tsx
// ✅
import { Button } from '@/components/ui/button';
<Button type="button" onClick={handleAction}>実行</Button>

// ❌
<button onClick={handleAction}>実行</button>
<div onClick={handleAction} className="cursor-pointer">実行</div>
```

---

## DS-004: カラー

**MUST** すべての色指定に shadcn CSS 変数トークンを使う
**MUST NOT** Tailwind の任意カラークラスを直書きする

```
✅ text-foreground / bg-background / text-muted-foreground / border-border / bg-card / text-primary / text-destructive

❌ text-blue-500 / bg-gray-100 / text-slate-700 / border-zinc-200 / bg-red-50
```

---

## DS-005: インポートパス

**MUST** コンポーネントのインポートにパスエイリアスを使う
**MUST NOT** `../../components/ui/` のような相対パスを使う

```tsx
// ✅
import { Button } from '@/components/ui/button';
import { Card } from '@components/ui/card';

// ❌
import { Button } from '../../components/ui/button';
import { Card } from '../components/ui/card';
```

---

## DS-006: HTML lang 属性

**MUST** `index.html` のルート `<html>` 要素に `lang="ja"` を設定する

```
✅ <html lang="ja">
❌ <html> / <html lang="en">
```

---

## DS-007: Meta Description

**MUST** `index.html` にツール固有の `<meta name="description">` を設定する
**MUST NOT** 空・他アプリのコピー・テンプレート文言を使う

```
✅ <meta name="description" content="URLエンコード・デコード" />
❌ <meta name="description" content="" /> / タグ自体がない
```

---

## DS-008: OGP タグ

**MUST** `index.html` に `og:title` と `og:description` を設定する

```html
<!-- ✅ -->
<meta property="og:title" content="URL Encoder - Elchika Tools" />
<meta property="og:description" content="URLエンコード・デコード" />

<!-- ❌ og タグが1つ以上欠けている -->
```

---

## DS-009: コンテンツコンテナ

**MUST** メインコンテンツを `mx-auto max-w-7xl`（または `max-w-6xl` / `max-w-5xl`）+ レスポンシブ padding で囲む

```
✅ className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
❌ className="w-full px-4" / style={{ maxWidth: '1200px' }}
```

---

## DS-010: スペーシング (SHOULD)

**SHOULD** Tailwind スケールトークンを使う。任意値は最終手段とし、使う場合はコメントを付ける

```
✅ gap-6 / p-4 / space-y-4 / mt-2
⚠️ gap-[14px] / p-[18px] → 使う場合は /* optical adjustment */ を添える
```

---

## クイックチェックリスト (新規アプリ生成後に確認)

- [ ] DS-001: `min-h-screen bg-background` ラッパーがある
- [ ] DS-002: ヘッダーにバックリンク・h1・説明文がある
- [ ] DS-003: すべての Button に `type="button"` がある
- [ ] DS-004: 任意カラークラスを使っていない
- [ ] DS-005: インポートがパスエイリアス経由である
- [ ] DS-006: `<html lang="ja">` が設定されている
- [ ] DS-007: meta description がツール固有である
- [ ] DS-008: og:title / og:description がある
- [ ] DS-009: `max-w-5xl` / `max-w-6xl` / `max-w-7xl` コンテナがある
