#!/bin/bash
set -e

# Step -1: アセットパス整合性チェック(ビルド前ゲート)
# base が './' 以外だと、ビルドした瞬間に全アプリが白画面になる成果物ができあがる。
# ここで止めることで「壊れた成果物を作ってしまう」こと自体を防ぐ。
# 詳細: .docs/ASSET_PATH_INCIDENT.md
echo "Checking asset path configuration..."
node "$(dirname "$0")/check-asset-paths.js" --config-only

# Step 0: WASM ビルド(アプリビルドの前に)
if [ -d "packages/wasm-utils" ]; then
  echo "Building wasm-utils..."
  (cd packages/wasm-utils && pnpm run build)
fi

# Step 1: 各アプリビルド -> packages/router/public/ にコピー
for app in apps/*/; do
  app_name=$(basename "$app")
  echo "Building $app_name..."
  (cd "$app" && pnpm run build)
  mkdir -p "packages/router/public/$app_name"
  cp -r "$app/dist/"* "packages/router/public/$app_name/"
done

echo "All apps built successfully!"
