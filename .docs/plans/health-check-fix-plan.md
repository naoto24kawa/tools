# Health Check Fix Plan (全328ツール)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 全328ツールに OGP 追加・meta description 修正・アクセシビリティ改善・SEO 改善を適用し、health-check Issue をクローズできる状態にする。

**Architecture:**

1. Phase 0: スクリプトで全ツールの OGP タグ・description を機械的に修正（変更規模: 328 index.html）
2. Phase 1: 17 並列エージェントがカテゴリ別に `accessibility` + `seo-audit` を適用（変更規模: apps/\*/src/App.tsx, index.html）
3. Phase 2: `parallel-review-cycle` で全変更を専門家レビュー → 0件になるまで繰り返す

**Tech Stack:** Node.js スクリプト、React/TypeScript、shadcn/ui、Tailwind CSS、Vite、GitHub CLI (gh)

---

## Phase 0: OGP・meta description 一括修正スクリプト

### Task 0-1: OGP 追加スクリプト作成・実行

**Files:**

- Create: `scripts/add-ogp-tags.js`
- Modify: `apps/*/index.html` (全328ファイル)

- [ ] **Step 1: `scripts/add-ogp-tags.js` を作成する**

  ファイルに含める処理:
  1. `packages/router/src/config/apps.ts` から全ツールの `path / displayName / description` を正規表現で抽出し Map に格納
  2. `apps/` 配下の全ディレクトリをスキャン
  3. 各 `index.html` に対して:
     - `og:title` がすでに存在する場合はスキップ（冪等）
     - `apps.ts` の displayName / description を使って `og:title`, `og:description`, `og:type`, `og:url` を `</head>` 直前に挿入
     - description が `クライアントサイドで動作する画像トリミングアプリ` のままなら apps.ts の description で上書き
     - 未登録ツールは `index.html` の `<title>` / `<meta name="description">` を代替ソースとして使用
  4. シェルコマンド実行が必要な場合は `spawnSync`（child_process）を使用し、引数は配列で渡す

  OGP タグの挿入形式:

  ```html
      <meta property="og:title" content="{displayName} - Elchika Tools" />
      <meta property="og:description" content="{description}" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://tools.elchika.app{path}" />
    </head>
  ```

- [ ] **Step 2: スクリプトを実行する**

  ```bash
  node scripts/add-ogp-tags.js
  ```

  期待出力:

  ```
  ✅ 328 修正済み
  完了: 328 修正 / 0 スキップ
  ```

- [ ] **Step 3: OGP が正しく追加されたか3件サンプル検証する**

  ```bash
  grep -A 4 'og:title' apps/url-encoder/index.html
  grep -A 4 'og:title' apps/alt-text-helper/index.html
  grep -A 4 'og:title' apps/aes-encrypt/index.html
  ```

  url-encoder の期待出力:

  ```html
  <meta property="og:title" content="URL Encoder - Elchika Tools" />
  <meta property="og:description" content="URLエンコード・デコード" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://tools.elchika.app/url-encoder" />
  ```

- [ ] **Step 4: テンプレート description が残っていないか確認する**

  ```bash
  grep -rl "クライアントサイドで動作する画像トリミングアプリ" apps/ && echo "残存あり" || echo "全修正済み"
  ```

  期待出力: `全修正済み`

- [ ] **Step 5: コミットする**

  ```bash
  git add apps/*/index.html scripts/add-ogp-tags.js
  git commit -m "feat: add OGP meta tags to all 328 tools and fix template descriptions"
  ```

---

## Phase 1: カテゴリ別並列 Accessibility + SEO 修正

> **重要:** Task 1-1 〜 1-17 は `superpowers:dispatching-parallel-agents` スキルで同時並列実行する。
> 各エージェントは担当ツールの `apps/<tool>/src/App.tsx` と `index.html` に対して
> `accessibility` スキルと `seo-audit` スキルを適用し修正・コミットする。

### 各エージェントへの共通作業内容

1. `accessibility` スキルを呼び出し、各 `App.tsx` に WCAG 2.2 AA 準拠の修正を適用
   - `<main>`, `<header>`, `<section>` などランドマーク要素の追加
   - ボタン・フォームへの `aria-label` / `aria-describedby` の追加
   - キーボードフォーカス順序の確認・修正
   - コントラスト比の問題があれば Tailwind クラスで修正
2. `seo-audit` スキルを呼び出し、各ツールの SEO を確認・修正
   - `<title>` が `{displayName} - Elchika Tools` 形式か確認
   - `<meta name="description">` がツール内容を正確に説明しているか確認・修正
3. 担当ツール全てに対して `vp check` を実行し、Lint エラーがあれば修正
4. 修正完了後にカテゴリ単位でコミット

---

### Task 1-1: Text カテゴリ (18ツール)

**担当ツール:**
`text-counter`, `text-deduplicate`, `text-diff-checker`, `text-case-converter`, `text-code-case`,
`text-reverse`, `text-sort`, `text-replace`, `text-line-number`, `text-prefix-suffix`,
`text-slugify`, `text-lorem-ipsum`, `text-word-frequency`, `text-fullwidth-halfwidth`,
`text-kana-converter`, `text-bionic-reading`, `text-markdown-html`, `text-markdown-preview`

- [ ] accessibility スキルで各 App.tsx を修正する
- [ ] seo-audit スキルで index.html を確認・修正する
- [ ] `cd apps/<tool> && vp check` でリントエラーがないか確認する
- [ ] `git commit -m "fix: accessibility and SEO for Text tools"` でコミットする

---

### Task 1-2: Encode カテゴリ (10ツール)

**担当ツール:**
`url-encoder`, `encode-base64-string`, `encode-base64-file`, `encode-base32`, `encode-binary`,
`encode-html-entity`, `encode-morse`, `encode-punycode`, `encode-unicode`, `uuencode`

- [ ] accessibility スキルで各 App.tsx を修正する
- [ ] seo-audit スキルで index.html を確認・修正する
- [ ] リントチェック・修正
- [ ] `git commit -m "fix: accessibility and SEO for Encode tools"` でコミットする

---

### Task 1-3: Crypto カテゴリ (16ツール)

**担当ツール:**
`hash-md5`, `hash-sha1`, `hash-sha256`, `hash-crc32`, `hash-hmac`,
`aes-encrypt`, `des-encrypt`, `bcrypt-hash`, `rsa-keygen`,
`crypto-caesar`, `crypto-rot13`, `crypto-vigenere`, `crypto-atbash`, `crypto-affine`,
`crypto-rail-fence`, `enigma-cipher`

- [ ] accessibility スキルで各 App.tsx を修正する
- [ ] seo-audit スキルで index.html を確認・修正する
- [ ] リントチェック・修正
- [ ] `git commit -m "fix: accessibility and SEO for Crypto tools"` でコミットする

---

### Task 1-4: Number カテゴリ (11ツール)

**担当ツール:**
`number-base-converter`, `number-fraction`, `number-kanji`,
`math-calculator`, `math-percentage`, `math-statistics`, `math-area`,
`unit-converter`, `random-number`, `random-dice`, `random-coin`

- [ ] accessibility スキルで各 App.tsx を修正する
- [ ] seo-audit スキルで index.html を確認・修正する
- [ ] リントチェック・修正
- [ ] `git commit -m "fix: accessibility and SEO for Number tools"` でコミットする

---

### Task 1-5: DateTime カテゴリ (11ツール)

**担当ツール:**
`datetime-unix`, `datetime-iso8601`, `datetime-rfc2822`, `datetime-diff`, `datetime-wareki`,
`datetime-world-clock`, `datetime-countdown`, `datetime-timer`, `datetime-stopwatch`,
`datetime-crontab`, `datetime-eta`

- [ ] accessibility スキルで各 App.tsx を修正する
- [ ] seo-audit スキルで index.html を確認・修正する
- [ ] リントチェック・修正
- [ ] `git commit -m "fix: accessibility and SEO for DateTime tools"` でコミットする

---

### Task 1-6: JSON カテゴリ (12ツール)

**担当ツール:**
`json-formatter`, `json-minify`, `json-validator`, `json-viewer`, `json-editor`, `json-diff`,
`json-to-csv`, `json-to-yaml`, `json-to-xml`, `json-to-toml`, `json-to-table`, `jsonpath-tester`

- [ ] accessibility スキルで各 App.tsx を修正する
- [ ] seo-audit スキルで index.html を確認・修正する
- [ ] リントチェック・修正
- [ ] `git commit -m "fix: accessibility and SEO for JSON tools"` でコミットする

---

### Task 1-7: Code カテゴリ (21ツール)

**担当ツール:**
`html-formatter`, `html-minifier`, `css-formatter`, `css-minifier`, `scss-formatter`,
`js-formatter`, `js-minifier`, `ts-formatter`, `sql-formatter`, `xml-formatter`,
`yaml-formatter`, `graphql-formatter`, `syntax-highlight`, `code-diff-viewer`,
`code-http-status`, `code-jwt-decoder`, `code-regex-tester`, `code-chmod`,
`code-to-image`, `docker-compose-converter`, `git-cheatsheet`

- [ ] accessibility スキルで各 App.tsx を修正する
- [ ] seo-audit スキルで index.html を確認・修正する
- [ ] リントチェック・修正
- [ ] `git commit -m "fix: accessibility and SEO for Code tools"` でコミットする

---

### Task 1-8: Color/CSS カテゴリ (16ツール)

**担当ツール:**
`color-converter`, `color-picker`, `color-mixer`, `color-shade`, `color-brightness`,
`color-invert`, `color-blind-simulator`,
`css-gradient`, `css-box-shadow`, `css-border-radius`, `css-glassmorphism`,
`css-clip-path`, `css-flexbox`, `css-grid`, `css-checkbox`, `css-loader`

- [ ] accessibility スキルで各 App.tsx を修正する
- [ ] seo-audit スキルで index.html を確認・修正する
- [ ] リントチェック・修正
- [ ] `git commit -m "fix: accessibility and SEO for Color/CSS tools"` でコミットする

---

### Task 1-9: Image カテゴリ (22ツール)

**担当ツール:**
`image-crop`, `image-resize`, `image-generate`, `image-grayscale`, `image-transparent`,
`image-trim`, `image-assets`, `image-compress`, `image-convert`, `image-flip`,
`image-brightness`, `image-filter`, `image-color-extract`, `image-ascii-art`,
`image-favicon`, `image-app-icon`, `image-svg-blob`, `image-svg-pattern`,
`image-svg-placeholder`, `image-to-base64`, `image-ocr`, `handwriting-converter`

- [ ] accessibility スキルで各 App.tsx を修正する
- [ ] seo-audit スキルで index.html を確認・修正する
- [ ] リントチェック・修正
- [ ] `git commit -m "fix: accessibility and SEO for Image tools"` でコミットする

---

### Task 1-10: PDF カテゴリ (9ツール)

**担当ツール:**
`pdf-merge`, `pdf-split`, `pdf-compress`, `pdf-rotate`, `pdf-metadata`,
`pdf-watermark`, `pdf-password`, `pdf-to-image`, `image-to-pdf`

- [ ] accessibility スキルで各 App.tsx を修正する
- [ ] seo-audit スキルで index.html を確認・修正する
- [ ] リントチェック・修正
- [ ] `git commit -m "fix: accessibility and SEO for PDF tools"` でコミットする

---

### Task 1-11: Video カテゴリ (4ツール)

**担当ツール:**
`video-to-gif`, `gif-frame-extractor`, `screen-recorder`, `webcam-test`

- [ ] accessibility スキルで各 App.tsx を修正する
- [ ] seo-audit スキルで index.html を確認・修正する
- [ ] リントチェック・修正
- [ ] `git commit -m "fix: accessibility and SEO for Video tools"` でコミットする

---

### Task 1-12: Generator カテゴリ (11ツール)

**担当ツール:**
`password-generator`, `uuid-generator`, `dummy-data-generator`, `htpasswd-generator`,
`bip39-generator`, `qr-code-generator`, `qr-code-reader`, `barcode-generator`,
`seo-ogp-generator`, `morpheme-analyzer`, `braille-converter`

- [ ] accessibility スキルで各 App.tsx を修正する
- [ ] seo-audit スキルで index.html を確認・修正する
- [ ] リントチェック・修正
- [ ] `git commit -m "fix: accessibility and SEO for Generator tools"` でコミットする

---

### Task 1-13: Network カテゴリ (12ツール)

**担当ツール:**
`cidr-calculator`, `subnet-calculator`, `user-agent-parser`, `display-checker`,
`validator-html`, `validator-xml`, `validator-password`,
`csv-to-chart`, `csv-to-sql`, `list-compare`, `list-randomize`

- [ ] accessibility スキルで各 App.tsx を修正する
- [ ] seo-audit スキルで index.html を確認・修正する
- [ ] リントチェック・修正
- [ ] `git commit -m "fix: accessibility and SEO for Network tools"` でコミットする

---

### Task 1-14: 未登録 Batch 1 (39ツール)

**担当ツール:**
`alt-text-helper`, `aria-reference`, `ascii-chart`, `ascii-table-generator`, `aspect-ratio-calculator`,
`audio-convert`, `audio-merge`, `audio-metronome`, `audio-noise-gate`, `audio-speed`,
`audio-tone-generator`, `audio-trim`, `audio-visualizer`, `avatar-generator`, `bookmark-manager`,
`boolean-algebra`, `business-card`, `certificate-generator`, `changelog-generator`, `charset-detector`,
`chart-builder`, `code-snippet-manager`, `color-palette-generator`, `compound-interest`, `contrast-checker`,
`coordinate-converter`, `cors-checker`, `csp-builder`, `css-animation-builder`, `css-filter-generator`,
`css-text-shadow`, `css-to-tailwind`, `csv-to-json`, `currency-converter`, `data-anonymizer`,
`data-masking`, `data-sampler`, `decision-wheel`, `discount-calculator`

- [ ] accessibility スキルで各 App.tsx を修正する
- [ ] seo-audit スキルで index.html を確認・修正する
- [ ] リントチェック・修正
- [ ] `git commit -m "fix: accessibility and SEO for unregistered tools batch 1"` でコミットする

---

### Task 1-15: 未登録 Batch 2 (39ツール)

**担当ツール:**
`dns-lookup`, `docker-run-to-compose`, `dockerfile-generator`, `editorconfig-generator`, `env-file-editor`,
`er-diagram`, `exif-editor`, `fibonacci-generator`, `file-hash-checker`, `file-metadata-viewer`,
`file-rename-batch`, `file-size-converter`, `flashcard`, `font-preview`, `font-size-calculator`,
`gantt-chart`, `gcd-lcm`, `geo-distance`, `geojson-viewer`, `git-commit-message`,
`gitignore-generator`, `gradient-mesh`, `graph-plotter`, `habit-tracker`, `home`,
`homoglyph-detector`, `htaccess-generator`, `html-to-markdown`, `http-header-viewer`, `http-request-builder`,
`ical-parser`, `icon-search`, `image-placeholder`, `invoice-generator`, `ip-address-info`,
`json-schema-generator`, `k8s-yaml-generator`, `kanban-board`, `kaomoji-picker`

- [ ] accessibility スキルで各 App.tsx を修正する
- [ ] seo-audit スキルで index.html を確認・修正する
- [ ] リントチェック・修正
- [ ] `git commit -m "fix: accessibility and SEO for unregistered tools batch 2"` でコミットする

---

### Task 1-16: 未登録 Batch 3 (39ツール)

**担当ツール:**
`license-chooser`, `list-to-table`, `loan-calculator`, `markdown-to-slides`, `matrix-calculator`,
`mermaid-preview`, `mockup-device`, `nato-phonetic`, `network-port-reference`, `nginx-config-generator`,
`noise-texture`, `note-pad`, `npm-package-info`, `package-json-validator`, `password-strength`,
`pattern-generator`, `periodic-table`, `pivot-table`, `pixel-art-editor`, `plantuml-preview`,
`pomodoro-timer`, `prime-checker`, `protobuf-to-json`, `regex-builder`, `responsive-preview`,
`robots-txt-generator`, `roman-numeral`, `secret-redactor`, `semver-calculator`, `social-card-generator`,
`spacing-calculator`, `sql-playground`, `sql-to-json-schema`, `sri-hash-generator`, `ssl-cert-decoder`,
`svg-optimizer`, `svg-to-component`, `systemd-unit-generator`, `tailwind-to-css`

- [ ] accessibility スキルで各 App.tsx を修正する
- [ ] seo-audit スキルで index.html を確認・修正する
- [ ] リントチェック・修正
- [ ] `git commit -m "fix: accessibility and SEO for unregistered tools batch 3"` でコミットする

---

### Task 1-17: 未登録 Batch 4 (39ツール)

**担当ツール:**
`tax-calculator`, `terraform-fmt`, `text-columns`, `text-emoji-search`, `text-encryption`,
`text-invisible-chars`, `text-readability`, `text-reading-time`, `text-ruby`, `text-speech`,
`text-vertical`, `timezone-converter`, `tip-calculator`, `toml-to-json`, `toml-validator`,
`totp-generator`, `treemap-generator`, `tsconfig-builder`, `typing-speed-test`, `unicode-inspector`,
`unit-converter-advanced`, `url-parser`, `video-compress`, `video-mute`, `video-rotate`,
`video-speed`, `video-thumbnail`, `video-trim`, `video-watermark`, `websocket-tester`,
`what3words-converter`, `whiteboard`, `working-days-calculator`, `xml-to-json`, `yaml-to-json`,
`yaml-validator`, `zalgo-text`, `zip-creator`, `zip-extractor`

- [ ] accessibility スキルで各 App.tsx を修正する
- [ ] seo-audit スキルで index.html を確認・修正する
- [ ] リントチェック・修正
- [ ] `git commit -m "fix: accessibility and SEO for unregistered tools batch 4"` でコミットする

---

## Phase 2: parallel-review-cycle で品質ゲート

### Task 2-1: 全変更のレビューサイクル実行

- [ ] **`parallel-review-cycle` スキルを呼び出す**

  以下の指示でスキルを起動:

  ```
  feat/accessibility-fixes ブランチの全変更を対象に並列専門家レビューを実行。
  対象: apps/*/index.html (OGP追加), apps/*/src/App.tsx (accessibility/SEO修正)
  0件になるまで レビュー → 修正 → 再レビュー を繰り返す。
  ```

- [ ] **発見された問題を全て修正する**
- [ ] **再レビューが 0件になるまで繰り返す**
- [ ] **最終コミットをする**

  ```bash
  git add -A
  git commit -m "fix: address all review findings from parallel-review-cycle"
  ```

---

## Phase 3: Issue クローズ + PR 作成

### Task 3-1: health-check Issue を一括クローズ

- [ ] **`commit-commands:commit-push-pr` スキルで PR を作成する**

  PR タイトル: `fix: health check improvements - OGP, accessibility, SEO for all 328 tools`

- [ ] **対応済み Issue を一括クローズする**

  `gh issue list --label health-check --limit 400` で Issue 番号を取得し、
  `gh issue close <number> --comment "修正完了"` で順次クローズする。
  ※ `spawnSync('gh', ['issue', 'close', number, '--repo', 'naoto24kawa/tools'], ...)` で実装

---

## 実行チェックリスト

| Phase | 内容                         | ツール数 | 完了 |
| ----- | ---------------------------- | -------- | ---- |
| 0     | OGP + description スクリプト | 328      | [ ]  |
| 1-1   | Text                         | 18       | [ ]  |
| 1-2   | Encode                       | 10       | [ ]  |
| 1-3   | Crypto                       | 16       | [ ]  |
| 1-4   | Number                       | 11       | [ ]  |
| 1-5   | DateTime                     | 11       | [ ]  |
| 1-6   | JSON                         | 12       | [ ]  |
| 1-7   | Code                         | 21       | [ ]  |
| 1-8   | Color/CSS                    | 16       | [ ]  |
| 1-9   | Image                        | 22       | [ ]  |
| 1-10  | PDF                          | 9        | [ ]  |
| 1-11  | Video                        | 4        | [ ]  |
| 1-12  | Generator                    | 11       | [ ]  |
| 1-13  | Network                      | 12       | [ ]  |
| 1-14  | 未登録 Batch 1               | 39       | [ ]  |
| 1-15  | 未登録 Batch 2               | 39       | [ ]  |
| 1-16  | 未登録 Batch 3               | 39       | [ ]  |
| 1-17  | 未登録 Batch 4               | 39       | [ ]  |
| 2     | parallel-review-cycle        | —        | [ ]  |
| 3     | Issue クローズ + PR          | —        | [ ]  |
