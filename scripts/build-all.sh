#!/bin/zsh
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

# Build all apps using xargs for parallel execution
build_app() {
  local app_dir="$1"
  local app_name=$(basename "$app_dir")
  cd "$app_dir"
  if npx vp build > /dev/null 2>&1; then
    echo "[OK] $app_name"
  else
    echo "[FAIL] $app_name" >&2
    return 1
  fi
}
export -f build_app 2>/dev/null || true

FAILED_FILE=$(mktemp)
echo 0 > "$FAILED_FILE"

ls -d "$ROOT_DIR"/apps/*/ | xargs -P "$MAX_PARALLEL" -I {} zsh -c '
  app_dir="{}"
  app_name=$(basename "$app_dir")
  cd "$app_dir"
  if npx vp build > /dev/null 2>&1; then
    echo "[OK] $app_name"
  else
    echo "[FAIL] $app_name" >&2
  fi
'

TOTAL=$(ls -d "$ROOT_DIR"/apps/*/ | wc -l | tr -d ' ')
echo "=== Build phase complete ($TOTAL apps) ==="

# Copy dist outputs to combined directory
COPIED=0
SKIPPED=0
for app_dir in "$ROOT_DIR"/apps/*/; do
  app_name=$(basename "$app_dir")
  dist_dir="$app_dir/dist"

  if [ ! -d "$dist_dir" ]; then
    echo "[SKIP] $app_name (no dist/)"
    SKIPPED=$((SKIPPED + 1))
    continue
  fi

  if [ "$app_name" = "home" ]; then
    cp -r "$dist_dir/"* "$OUTPUT_DIR/"
  else
    mkdir -p "$OUTPUT_DIR/$app_name"
    cp -r "$dist_dir/"* "$OUTPUT_DIR/$app_name/"
  fi
  COPIED=$((COPIED + 1))
done

rm -f "$FAILED_FILE"

# Report
FILE_COUNT=$(find "$OUTPUT_DIR" -type f | wc -l | tr -d ' ')
SIZE=$(du -sh "$OUTPUT_DIR" | cut -f1)
echo "=== Combined output: $COPIED apps, $FILE_COUNT files, $SIZE ==="
[ "$SKIPPED" -gt 0 ] && echo "=== Skipped: $SKIPPED apps (no dist/) ==="
