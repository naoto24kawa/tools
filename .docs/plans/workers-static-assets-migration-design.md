# Workers Static Assets Migration Design

## Overview

178個の個別 Cloudflare Pages プロジェクトを、1つの Cloudflare Workers Static Assets に統合する。
合わせて既存 Pages プロジェクトとカスタムドメイン(CNAME)を全削除する。

## Motivation

- 178個の Pages プロジェクト個別管理が困難
- Pages プロジェクト数のソフトリミット(100個)を超過する
- 178個分の CNAME レコードが DNS 上限(200件)に抵触する
- Cloudflare 公式が Pages → Workers Static Assets への移行を推奨

## Architecture

### Before

```
User → tools.elchika.app/<app>/
  → Router Worker (proxy)
    → tools-<app>.elchika.app (Pages project)
      → static assets
```

- 178 Pages projects
- 178 CNAME records
- Router is a proxy relay

### After

```
User → tools.elchika.app/<app>/
  → Router Worker + Static Assets
    → direct file serving (no proxy)
```

- 1 Worker project with static assets
- 0 Pages projects (tools)
- 0 CNAME records (tools)

## Technical Design

### 1. Static Assets Directory Structure

```
packages/router/public/
  index.html                    # home app
  assets/                       # home app assets
  url-encoder/
    index.html
    assets/index-{hash}.js
    assets/index-{hash}.css
  aes-encrypt/
    index.html
    assets/...
  ... (178 apps total)
```

### 2. wrangler.toml

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

- `html_handling = "auto-trailing-slash"`: `/url-encoder` → `/url-encoder/` → `url-encoder/index.html`
- `not_found_handling = "none"`: unmatched requests fall through to Worker script for custom 404

### 3. Vite Base Path

All apps: `base: '/'` → `base: './'`

This ensures relative asset paths work regardless of the app's URL prefix:
- `./assets/index-abc.js` resolves to `/url-encoder/assets/index-abc.js` when served from `/url-encoder/`
- Also works in individual dev mode

### 4. Router Worker Changes

**Remove:**
- `createProxyHandler` and all proxy logic
- `fetch()` calls to external Pages domains

**Keep:**
- `GET /health` - health check endpoint
- 404 handler with available tools list
- CORS and security headers middleware
- `APPS_CONFIG` for tool list/metadata

**Add:**
- ASSETS binding for programmatic asset access (if needed)

### 5. Build Script (`scripts/build-all.sh`)

```bash
#!/bin/bash
# 1. Clean output directory
rm -rf packages/router/public

# 2. Build all apps in parallel (controlled concurrency)
for app in apps/*/; do
  app_name=$(basename "$app")
  (cd "$app" && vp build) &
  # Limit parallel jobs
done
wait

# 3. Copy dist outputs to combined directory
for app in apps/*/; do
  app_name=$(basename "$app")
  if [ "$app_name" = "home" ]; then
    cp -r "$app/dist/"* packages/router/public/
  else
    mkdir -p "packages/router/public/$app_name"
    cp -r "$app/dist/"* "packages/router/public/$app_name/"
  fi
done
```

### 6. Deploy Command

```bash
cd packages/router && wrangler deploy
```

Single command deploys everything (Worker + all static assets).

## File Count Estimate

- 178 apps x ~15 files/app = ~2,700 files
- Free plan limit: 20,000 files
- Headroom: ~17,000 files

## Migration Phases

### Phase 1: Build Infrastructure

1. Change all 178 apps' `vite.config.ts`: `base: '/'` → `base: './'`
2. Create `scripts/build-all.sh`
3. Update `packages/router/wrangler.toml` with `[assets]` section
4. Add `packages/router/public/` to `.gitignore`

### Phase 2: Router Migration

1. Remove proxy logic from `packages/router/src/utils/proxy.ts`
2. Simplify `packages/router/src/index.ts` (remove proxy routes, keep health/404/metadata)
3. Update `packages/router/src/config/apps.ts` URLs (no longer needed for proxy, but keep for metadata)
4. Build all apps with `scripts/build-all.sh`
5. Deploy and verify

### Phase 3: Delete Pages Projects

```bash
# Delete all tools-* Pages projects
for project in $(wrangler pages project list --json | jq -r '.[].name' | grep '^tools-'); do
  wrangler pages project delete "$project" --yes
done
```

Also delete non-tools projects if desired:
- calculator-for-kids, remote-bingo, remote-bingo-admin, etc.

### Phase 4: Delete CNAME Records

```bash
# Delete all tools-*.elchika.app CNAME records via Cloudflare API
zone_id="476c84f629e0c95b8e95557c683e3fb9"
# List and delete CNAME records matching tools-*.elchika.app
```

## Rollback Plan

- Phase 1-2: Revert git changes, redeploy old router
- Phase 3: Pages projects are permanently deleted (not easily reversible, but apps are in git)
- Phase 4: CNAME records can be re-created

Therefore: verify Phase 2 thoroughly before proceeding to Phase 3.

## Out of Scope

- CI/CD automation for the combined build
- Incremental build (only changed apps)
- Performance optimization of build script
- Individual app dev workflow changes (dev mode continues to work as-is)

## References

- [Migrate from Pages to Workers](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/)
- [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/)
- [Workers Static Assets Limits](https://developers.cloudflare.com/workers/platform/limits/#static-assets)
