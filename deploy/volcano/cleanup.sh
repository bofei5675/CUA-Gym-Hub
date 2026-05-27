#!/usr/bin/env bash
# Purge stale per-session state and uploaded files.
#
# This is invoked daily by /etc/cron.daily/cua-gym-hub-cleanup if you ran
# bootstrap.sh without --no-cleanup-cron. You can also run it on demand.
#
# Usage:
#   bash cleanup.sh                       # default 7 days, /opt/CUA-Gym-Hub
#   bash cleanup.sh --retain-days 3
#   bash cleanup.sh --repo-dir /srv/cua --dry-run
#   bash cleanup.sh --all                 # nuke everything (after stopping service)

set -euo pipefail

REPO_DIR="/opt/CUA-Gym-Hub"
RETAIN_DAYS=7
DRY_RUN=false
PURGE_ALL=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --repo-dir)     REPO_DIR="$2"; shift 2 ;;
    --retain-days)  RETAIN_DAYS="$2"; shift 2 ;;
    --dry-run)      DRY_RUN=true; shift ;;
    --all)          PURGE_ALL=true; shift ;;
    -h|--help)
      sed -n '1,/^set -euo/p' "$0" | sed '$d' | sed 's/^# \{0,1\}//'
      exit 0 ;;
    *) echo "Unknown arg: $1" >&2; exit 2 ;;
  esac
done

WEBSITES_DIR="$REPO_DIR/websites"
[[ -d "$WEBSITES_DIR" ]] || { echo "websites/ not found under $REPO_DIR" >&2; exit 2; }

if $PURGE_ALL; then
  echo "Purging ALL .mock-states and .mock-files under $WEBSITES_DIR"
  for sub in .mock-states .mock-files; do
    if $DRY_RUN; then
      find "$WEBSITES_DIR"/*/"$sub" -mindepth 1 2>/dev/null | head -50
      echo "(dry-run; nothing deleted)"
    else
      find "$WEBSITES_DIR"/*/"$sub" -mindepth 1 -delete 2>/dev/null || true
    fi
  done
  exit 0
fi

echo "Removing entries older than ${RETAIN_DAYS} days under $WEBSITES_DIR"
ACTION=(-delete)
$DRY_RUN && ACTION=(-print)

find "$WEBSITES_DIR"/*/.mock-states -type f -mtime "+${RETAIN_DAYS}" "${ACTION[@]}" 2>/dev/null || true
find "$WEBSITES_DIR"/*/.mock-files  -type f -mtime "+${RETAIN_DAYS}" "${ACTION[@]}" 2>/dev/null || true

# Also drop empty per-sid file dirs left behind.
find "$WEBSITES_DIR"/*/.mock-files -mindepth 1 -type d -empty "${ACTION[@]}" 2>/dev/null || true

echo "Done."
