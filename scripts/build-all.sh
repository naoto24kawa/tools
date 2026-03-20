#!/bin/bash
set -e

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
