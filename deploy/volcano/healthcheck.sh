#!/usr/bin/env bash
# Probe every mock and report PASS / FAIL.
#
# Usage:
#   bash healthcheck.sh
#   bash healthcheck.sh --base-port 8000 --repo-dir /opt/CUA-Gym-Hub
#   bash healthcheck.sh --json   # machine-readable
#
# Exit code is 0 iff every mock answered /go?sid=hc with a valid JSON payload.

set -euo pipefail

REPO_DIR="/opt/CUA-Gym-Hub"
BASE_PORT=8000
HOST="127.0.0.1"
TIMEOUT=3
FORMAT="text"
WRITE_PORT_MAP=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --repo-dir)        REPO_DIR="$2"; shift 2 ;;
    --base-port)       BASE_PORT="$2"; shift 2 ;;
    --host)            HOST="$2"; shift 2 ;;
    --timeout)         TIMEOUT="$2"; shift 2 ;;
    --json)            FORMAT="json"; shift ;;
    --write-port-map)  WRITE_PORT_MAP="$2"; shift 2 ;;
    -h|--help)
      sed -n '1,/^set -euo/p' "$0" | sed '$d' | sed 's/^# \{0,1\}//'
      exit 0 ;;
    *) echo "Unknown arg: $1" >&2; exit 2 ;;
  esac
done

WEBSITES_DIR="$REPO_DIR/websites"
[[ -d "$WEBSITES_DIR" ]] || { echo "websites/ not found under $REPO_DIR" >&2; exit 2; }

command -v curl >/dev/null || { echo "curl required" >&2; exit 2; }

MOCKS=()
while IFS= read -r d; do
  [[ -d "$WEBSITES_DIR/$d" ]] || continue
  [[ "$d" == *_mock ]] || continue
  MOCKS+=("$d")
done < <(ls -1 "$WEBSITES_DIR" | sort)

TOTAL=${#MOCKS[@]}
[[ $TOTAL -gt 0 ]] || { echo "no mocks discovered" >&2; exit 2; }

# Build port map first so we can emit it even if probes fail.
if [[ -n "$WRITE_PORT_MAP" ]]; then
  : > "$WRITE_PORT_MAP"
  for i in "${!MOCKS[@]}"; do
    printf "%d\t%s\n" "$((BASE_PORT + i))" "${MOCKS[$i]}" >> "$WRITE_PORT_MAP"
  done
fi

probe() {
  local port="$1"
  local url="http://${HOST}:${port}/go?sid=hc"
  local body
  body="$(curl -fsS --max-time "$TIMEOUT" "$url" 2>/dev/null || true)"
  [[ -n "$body" ]] || return 1
  # Cheap sanity check: must contain initial_state key.
  echo "$body" | grep -q '"initial_state"' || return 1
  return 0
}

PASS=0
FAIL=0
FAIL_LIST=()
JSON_ITEMS=()

for i in "${!MOCKS[@]}"; do
  port=$((BASE_PORT + i))
  name="${MOCKS[$i]}"
  if probe "$port"; then
    status="ok"
    PASS=$((PASS + 1))
    [[ "$FORMAT" == "text" ]] && printf "  [OK ] %5d  %s\n" "$port" "$name"
  else
    status="fail"
    FAIL=$((FAIL + 1))
    FAIL_LIST+=("$name@$port")
    [[ "$FORMAT" == "text" ]] && printf "  [ERR] %5d  %s\n" "$port" "$name"
  fi
  JSON_ITEMS+=("{\"name\":\"$name\",\"port\":$port,\"status\":\"$status\"}")
done

if [[ "$FORMAT" == "json" ]]; then
  printf '{"total":%d,"pass":%d,"fail":%d,"items":[' "$TOTAL" "$PASS" "$FAIL"
  ( IFS=,; echo "${JSON_ITEMS[*]}" )
  printf ']}\n'
else
  echo ""
  echo "----------------------------------------"
  echo "Summary: $PASS / $TOTAL passing, $FAIL failed"
  if [[ $FAIL -gt 0 ]]; then
    echo "Failed mocks:"
    for f in "${FAIL_LIST[@]}"; do echo "  - $f"; done
    echo ""
    echo "Inspect logs:  sudo -u <user> tmux attach -t cua-gym-hub"
    echo "Or:            cd $WEBSITES_DIR/<mock> && npm run preview"
  fi
fi

[[ $FAIL -eq 0 ]]
