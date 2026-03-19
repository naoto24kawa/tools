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
    if npx vp build > /dev/null 2>&1; then
      echo "[OK] $app_name"
    else
      echo "[FAIL] $app_name" >&2
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
