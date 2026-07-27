#!/usr/bin/env bash
# Audit progress tracker.
# Reads manifest.txt (one report per lesson) and reports which report files
# exist and are non-trivial (> MIN_LINES lines). No lesson may be skipped.
#
# Usage:
#   ./check-progress.sh           # summary + list of MISSING reports
#   ./check-progress.sh --all     # full per-report status
#   ./check-progress.sh --missing # only the missing/thin ones (machine friendly)
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MANIFEST="$HERE/manifest.txt"
MIN_LINES=15   # a real report has at least this many lines; below = stub

mode="${1:-summary}"
total=0; done=0; missing=()

while IFS=$'\t' read -r report src title; do
  [[ -z "${report:-}" || "${report:0:1}" == "#" ]] && continue
  total=$((total+1))
  f="$HERE/$report"
  if [[ -f "$f" ]] && [[ "$(grep -cve '^[[:space:]]*$' "$f")" -ge "$MIN_LINES" ]]; then
    done=$((done+1))
    [[ "$mode" == "--all" ]] && printf 'OK    %-44s %s\n' "$report" "$title"
  else
    missing+=("$report")
    [[ "$mode" == "--all" || "$mode" == "--missing" ]] && printf 'TODO  %-44s %s\n' "$report" "$title"
  fi
done < "$MANIFEST"

if [[ "$mode" != "--missing" ]]; then
  pct=$(( total>0 ? done*100/total : 0 ))
  echo "-------------------------------------------------------------"
  echo "Reports: $done / $total done ($pct%).  Remaining: $((total-done))."
  if ((${#missing[@]})); then
    echo "Missing/thin:"
    printf '  - %s\n' "${missing[@]}"
  else
    echo "All lesson reports present. Audit content complete."
  fi
fi
