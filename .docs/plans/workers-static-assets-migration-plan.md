# Workers Static Assets Migration Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 178個の個別 Cloudflare Pages を1つの Workers Static Assets に統合し、既存 Pages/CNAME を全削除する

**Architecture:** Router Worker (`packages/router`) に `[assets]` 設定を追加し、全アプリのビルド出力を `public/` に結合して配信。プロキシロジックを削除し、Worker は health check と 404 のみ担当。静的アセットは Workers が直接配信(asset-first)。

**Tech Stack:** Cloudflare Workers Static Assets, Hono, Vite+ (vp), Cloudflare API

**Spec:** `.docs/plans/workers-static-assets-migration-design.md`

---

## File Structure

### Create
- `scripts/build-all.sh` - 全アプリビルド&結合スクリプト
- `packages/router/public/` - 結合ビルド出力(gitignore、デプロイ時に生成)

### Modify
- `apps/*/vite.config.ts` (178個) - `base: '/'` → `base: './'`
- `packages/router/wrangler.toml` - `[assets]` セクション追加
- `packages/router/src/index.ts` - プロキシ削除、簡素化
- `packages/router/src/__tests__/index.test.ts` - テスト更新
- `.gitignore` - `packages/router/public/` 追加

### Delete
- `packages/router/src/utils/proxy.ts` - プロキシ不要
- `packages/router/src/utils/__tests__/proxy.test.ts` - プロキシテスト不要

---

## Chunk 1: Build Infrastructure

### Task 1: Update Vite base path for all apps

**Files:**
- Modify: `apps/*/vite.config.ts` (178個)

- [ ] **Step 1: Create a sed script to batch-update all vite.config.ts**

```bash
# 全アプリの base: '/' を base: './' に変更
for config in apps/*/vite.config.ts; do
  sed -i '' "s|base: '/'|base: './'|" "$config"
done
```

- [ ] **Step 2: Verify the changes**

Run: `grep -r "base: " apps/*/vite.config.ts | head -10`
Expected: all show `base: './'`

Run: `grep -r "base: '/'" apps/*/vite.config.ts | wc -l`
Expected: 0

- [ ] **Step 3: Spot-check a few apps still build correctly**

```bash
cd apps/url-encoder && vp build && ls dist/
cd ../../apps/aes-encrypt && vp build && ls dist/
```

Expected: dist/ contains `index.html` and `assets/` with relative paths

- [ ] **Step 4: Verify HTML uses relative paths**

```bash
grep -o 'src="[^"]*"' apps/url-encoder/dist/index.html
grep -o 'href="[^"]*"' apps/url-encoder/dist/index.html
```

Expected: `src="./assets/index-xxx.js"` (relative, not absolute)

- [ ] **Step 5: Commit**

```bash
git add apps/*/vite.config.ts
git commit -m "chore: change vite base path to relative for Workers Static Assets migration"
```

---

### Task 2: Create build-all script

**Files:**
- Create: `scripts/build-all.sh`

- [ ] **Step 1: Write the build script**

```bash
#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
OUTPUT_DIR="$ROOT_DIR/packages/router/public"
MAX_PARALLEL=${MAX_PARALLEL:-8}

echo "=== Building all apps ==="
echo "Output: $OUTPUT_DIR"
echo "Parallelism: $MAX_PARALLEL"

# Clean output directory
rm -rf "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR"

# Build all apps with controlled parallelism
FAILED=0
TOTAL=0
RUNNING=0

for app_dir in "$ROOT_DIR"/apps/*/; do
  app_name=$(basename "$app_dir")
  TOTAL=$((TOTAL + 1))

  (
    cd "$app_dir"
    if vp build 2>&1 | tail -1; then
      echo "[OK] $app_name"
    else
      echo "[FAIL] $app_name"
      exit 1
    fi
  ) &

  RUNNING=$((RUNNING + 1))
  if [ "$RUNNING" -ge "$MAX_PARALLEL" ]; then
    wait -n || FAILED=$((FAILED + 1))
    RUNNING=$((RUNNING - 1))
  fi
done

# Wait for remaining jobs
while [ "$RUNNING" -gt 0 ]; do
  wait -n || FAILED=$((FAILED + 1))
  RUNNING=$((RUNNING - 1))
done

if [ "$FAILED" -gt 0 ]; then
  echo "=== $FAILED/$TOTAL apps failed to build ==="
  exit 1
fi

echo "=== All $TOTAL apps built successfully ==="

# Copy dist outputs to combined directory
for app_dir in "$ROOT_DIR"/apps/*/; do
  app_name=$(basename "$app_dir")
  dist_dir="$app_dir/dist"

  if [ ! -d "$dist_dir" ]; then
    echo "[SKIP] $app_name (no dist/)"
    continue
  fi

  if [ "$app_name" = "home" ]; then
    # Home app goes to root
    cp -r "$dist_dir/"* "$OUTPUT_DIR/"
  else
    # Other apps go to subdirectory
    mkdir -p "$OUTPUT_DIR/$app_name"
    cp -r "$dist_dir/"* "$OUTPUT_DIR/$app_name/"
  fi
done

# Report
FILE_COUNT=$(find "$OUTPUT_DIR" -type f | wc -l | tr -d ' ')
SIZE=$(du -sh "$OUTPUT_DIR" | cut -f1)
echo "=== Combined output: $FILE_COUNT files, $SIZE ==="
```

- [ ] **Step 2: Make executable**

```bash
chmod +x scripts/build-all.sh
```

- [ ] **Step 3: Test with 2-3 apps first (quick validation)**

```bash
# Build only url-encoder and aes-encrypt to verify the copy logic
cd apps/url-encoder && vp build && cd ../..
cd apps/aes-encrypt && vp build && cd ../..

mkdir -p packages/router/public
cp -r apps/url-encoder/dist/* packages/router/public/url-encoder/
cp -r apps/aes-encrypt/dist/* packages/router/public/aes-encrypt/

ls packages/router/public/url-encoder/
ls packages/router/public/aes-encrypt/
```

Expected: each has `index.html` and `assets/`

- [ ] **Step 4: Clean up test output and commit**

```bash
rm -rf packages/router/public
git add scripts/build-all.sh
git commit -m "feat: add build-all script for combined static assets deployment"
```

---

### Task 3: Update wrangler.toml and .gitignore

**Files:**
- Modify: `packages/router/wrangler.toml`
- Modify: `.gitignore`

- [ ] **Step 1: Update wrangler.toml**

Replace `packages/router/wrangler.toml` with:

```toml
name = "tools-router"
main = "src/index.ts"
compatibility_date = "2024-12-01"

[assets]
directory = "./public"
html_handling = "auto-trailing-slash"
not_found_handling = "none"

[[routes]]
pattern = "tools.elchika.app"
custom_domain = true
```

- [ ] **Step 2: Add public/ to .gitignore**

Append to `.gitignore`:

```
# Combined build output (generated by scripts/build-all.sh)
packages/router/public/
```

- [ ] **Step 3: Commit**

```bash
git add packages/router/wrangler.toml .gitignore
git commit -m "feat(router): add Workers Static Assets configuration"
```

---

## Chunk 2: Router Migration

### Task 4: Simplify router - remove proxy

**Files:**
- Modify: `packages/router/src/index.ts`
- Delete: `packages/router/src/utils/proxy.ts`
- Delete: `packages/router/src/utils/__tests__/proxy.test.ts`

- [ ] **Step 1: Rewrite index.ts to remove proxy logic**

Replace `packages/router/src/index.ts` with:

```typescript
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { APPS_CONFIG, AVAILABLE_PATHS } from './config/apps';

type Bindings = Record<string, never>;

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', secureHeaders());

app.use(
  '*',
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    maxAge: 86400,
  })
);

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API: tool list
app.get('/api/tools', (c) => {
  return c.json({
    tools: APPS_CONFIG.map((app) => ({
      path: app.path,
      icon: app.icon,
      displayName: app.displayName,
      description: app.description,
      category: app.category,
    })),
    total: APPS_CONFIG.length,
  });
});

// 404 handler (unmatched requests that aren't static assets)
app.notFound((c) => {
  return c.json(
    {
      error: 'Not found',
      message: '指定されたパスは存在しません',
      availablePaths: AVAILABLE_PATHS,
    },
    404
  );
});

app.onError((err, c) => {
  console.error('Router error:', err);
  return c.json(
    {
      error: 'Internal server error',
      message: 'サーバーエラーが発生しました',
    },
    500
  );
});

export default app;
```

- [ ] **Step 2: Delete proxy files**

```bash
rm packages/router/src/utils/proxy.ts
rm packages/router/src/utils/__tests__/proxy.test.ts
```

- [ ] **Step 3: Commit**

```bash
git add -A packages/router/src/
git commit -m "feat(router): remove proxy logic, serve static assets directly"
```

---

### Task 5: Update router tests

**Files:**
- Modify: `packages/router/src/__tests__/index.test.ts`

- [ ] **Step 1: Rewrite index.test.ts**

Replace `packages/router/src/__tests__/index.test.ts` with:

```typescript
import { describe, test, expect } from 'vitest';
import app from '../index';

describe('Router', () => {
  describe('GET /health', () => {
    test('should return health status', async () => {
      const res = await app.request('/health');
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json).toHaveProperty('status', 'ok');
      expect(json).toHaveProperty('timestamp');
    });
  });

  describe('GET /api/tools', () => {
    test('should return tool list', async () => {
      const res = await app.request('/api/tools');
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json).toHaveProperty('tools');
      expect(json).toHaveProperty('total');
      expect(json.tools.length).toBeGreaterThan(0);
      expect(json.tools[0]).toHaveProperty('path');
      expect(json.tools[0]).toHaveProperty('displayName');
      expect(json.tools[0]).toHaveProperty('category');
    });
  });

  describe('404 Not Found', () => {
    test('should return 404 for unknown paths', async () => {
      const res = await app.request('/unknown-path');
      expect(res.status).toBe(404);

      const json = await res.json();
      expect(json).toHaveProperty('error', 'Not found');
      expect(json).toHaveProperty('availablePaths');
    });
  });

  describe('CORS Headers', () => {
    test('should include CORS headers', async () => {
      const res = await app.request('/health', { method: 'OPTIONS' });
      expect(res.headers.get('access-control-allow-origin')).toBe('*');
      expect(res.headers.get('access-control-allow-methods')).toContain('GET');
    });
  });

  describe('Security Headers', () => {
    test('should include security headers', async () => {
      const res = await app.request('/health');
      expect(res.headers.get('x-content-type-options')).toBeTruthy();
      expect(res.headers.get('x-frame-options')).toBeTruthy();
    });
  });
});
```

- [ ] **Step 2: Run tests**

```bash
cd packages/router && npx vitest run
```

Expected: All tests pass

- [ ] **Step 3: Commit**

```bash
git add packages/router/src/__tests__/index.test.ts
git commit -m "test(router): update tests for static assets architecture"
```

---

## Chunk 3: Build, Deploy, Verify

### Task 6: Full build and deploy

- [ ] **Step 1: Install dependencies for all apps**

```bash
pnpm install
```

- [ ] **Step 2: Run build-all script**

```bash
./scripts/build-all.sh
```

Expected: `=== All N apps built successfully ===` and file count report

- [ ] **Step 3: Verify combined output structure**

```bash
ls packages/router/public/index.html         # home app
ls packages/router/public/url-encoder/index.html
ls packages/router/public/aes-encrypt/index.html
find packages/router/public -type f | wc -l   # should be ~2700
```

- [ ] **Step 4: Deploy**

```bash
cd packages/router && wrangler deploy
```

- [ ] **Step 5: Verify live site**

```bash
# Health check
curl -s https://tools.elchika.app/health | jq .

# Home page
curl -s -o /dev/null -w "%{http_code}" https://tools.elchika.app/

# Tool pages
curl -s -o /dev/null -w "%{http_code}" https://tools.elchika.app/url-encoder/
curl -s -o /dev/null -w "%{http_code}" https://tools.elchika.app/aes-encrypt/
curl -s -o /dev/null -w "%{http_code}" https://tools.elchika.app/json-formatter/

# 404
curl -s https://tools.elchika.app/nonexistent | jq .

# API
curl -s https://tools.elchika.app/api/tools | jq '.total'
```

Expected: 200 for valid paths, 404 JSON for invalid paths

- [ ] **Step 6: Commit deploy state if any changes were needed**

---

## Chunk 4: Cleanup - Pages & DNS

### Task 7: Delete all Pages projects

**Prerequisite:** Task 6 verified successfully. This is irreversible.

- [ ] **Step 1: List current Pages projects for confirmation**

```bash
CLOUDFLARE_ACCOUNT_ID=4c6f1bd50e566f5ba6c78865b89fb158 \
  npx wrangler pages project list
```

- [ ] **Step 2: Get user confirmation before deleting**

Ask user: "以下の Pages プロジェクトを削除します。よろしいですか?"

- [ ] **Step 3: Delete tools-* Pages projects**

```bash
ACCOUNT=4c6f1bd50e566f5ba6c78865b89fb158

# Delete each tools-* project
for project in tools-text-counter tools-text-deduplicate tools-text-diff-checker \
  tools-url-encoder tools-image-trim tools-image-assets tools-image-transparent \
  tools-image-grayscale tools-image-resize tools-image-generate tools-image-crop; do
  echo "Deleting $project..."
  CLOUDFLARE_ACCOUNT_ID=$ACCOUNT npx wrangler pages project delete "$project" --yes
done
```

Note: Full list of all tools-* projects should be generated from the actual `wrangler pages project list` output.

- [ ] **Step 4: Verify all tools Pages projects are deleted**

```bash
CLOUDFLARE_ACCOUNT_ID=4c6f1bd50e566f5ba6c78865b89fb158 \
  npx wrangler pages project list
```

Expected: No `tools-*` entries remain

---

### Task 8: Delete CNAME records

**Files:** None (Cloudflare API operations)

- [ ] **Step 1: List all CNAME records for elchika.app**

```bash
# Refresh OAuth token via wrangler
TOKEN=$(cat ~/Library/Preferences/.wrangler/config/default.toml | grep oauth_token | cut -d'"' -f2)
ZONE_ID="476c84f629e0c95b8e95557c683e3fb9"

curl -s -H "Authorization: Bearer $TOKEN" \
  "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records?type=CNAME&per_page=500" \
  | jq '.result[] | {id, name, content}'
```

- [ ] **Step 2: Get user confirmation**

Show the CNAME records to delete and ask for confirmation.

- [ ] **Step 3: Delete tools-* CNAME records**

```bash
ZONE_ID="476c84f629e0c95b8e95557c683e3fb9"

# For each CNAME record ID matching tools-*.elchika.app:
for record_id in $(curl -s -H "Authorization: Bearer $TOKEN" \
  "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records?type=CNAME&per_page=500" \
  | jq -r '.result[] | select(.name | startswith("tools-")) | .id'); do
  echo "Deleting record $record_id..."
  curl -s -X DELETE -H "Authorization: Bearer $TOKEN" \
    "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/$record_id"
done
```

- [ ] **Step 4: Verify CNAME records are deleted**

```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records?type=CNAME&per_page=500" \
  | jq '.result[] | .name' | grep tools-
```

Expected: No `tools-*` CNAME records remain

- [ ] **Step 5: Final verification - all tools still accessible via router**

```bash
curl -s -o /dev/null -w "%{http_code}" https://tools.elchika.app/url-encoder/
curl -s -o /dev/null -w "%{http_code}" https://tools.elchika.app/aes-encrypt/
```

Expected: 200 (served via Workers Static Assets, not Pages)

---

## Rollback

- **Before Phase 3 (Pages deletion):** `git revert` the router changes and redeploy
- **After Phase 3:** Apps are in git, can redeploy to new Pages projects if needed
- **After Phase 4:** CNAME records can be re-created via Cloudflare dashboard
