#!/usr/bin/env bash
# CUA-Gym-Hub one-shot deployment for Volcano Engine Ubuntu VM.
#
# Usage (typical):
#   sudo bash bootstrap.sh
#
# Usage (custom):
#   sudo bash bootstrap.sh \
#       --repo-dir /opt/CUA-Gym-Hub \
#       --service-user ubuntu \
#       --base-port 8000 \
#       --npm-registry https://registry.npmmirror.com \
#       --node-version 20 \
#       --enable-nginx --nginx-domain mocks.example.com
#
# What this script does:
#   1. Installs system packages (curl, git, tmux, build-essential, nginx*)
#   2. Installs Node.js (NodeSource) at requested major version
#   3. Configures npm registry mirror (default: npmmirror)
#   4. Clones / updates the CUA-Gym-Hub repo
#   5. Runs the upstream deploy-all.sh (npm install + build + tmux start)
#   6. Installs a systemd unit so all mocks come back after reboot
#   7. Installs a daily cron to purge stale .mock-states / .mock-files
#   8. (optional) Generates an nginx reverse proxy config for *.<domain>
#
# Re-running this script is safe; passing --skip-install / --skip-build
# is forwarded to deploy-all.sh.

set -euo pipefail

# -------- defaults --------
REPO_URL="https://github.com/xlang-ai/CUA-Gym-Hub.git"
REPO_DIR="/opt/CUA-Gym-Hub"
SERVICE_USER=""
BASE_PORT=8000
NODE_MAJOR=20
NPM_REGISTRY="https://registry.npmmirror.com"
ENABLE_NGINX=false
NGINX_DOMAIN=""
ENABLE_CLEANUP_CRON=true
STATE_RETAIN_DAYS=7
SKIP_INSTALL=false
SKIP_BUILD=false
SKIP_SYSTEMD=false
TMUX_SESSION="cua-gym-hub"

usage() {
  sed -n '1,/^set -euo/p' "$0" | sed '$d' | sed 's/^# \{0,1\}//'
  exit 0
}

log()  { echo "[$(date '+%F %T')] $*"; }
warn() { echo "[$(date '+%F %T')] WARN: $*" >&2; }
die()  { echo "[$(date '+%F %T')] ERROR: $*" >&2; exit 1; }

# -------- args --------
while [[ $# -gt 0 ]]; do
  case "$1" in
    --repo-url)           REPO_URL="$2"; shift 2 ;;
    --repo-dir)           REPO_DIR="$2"; shift 2 ;;
    --service-user)       SERVICE_USER="$2"; shift 2 ;;
    --base-port)          BASE_PORT="$2"; shift 2 ;;
    --node-version)       NODE_MAJOR="$2"; shift 2 ;;
    --npm-registry)       NPM_REGISTRY="$2"; shift 2 ;;
    --enable-nginx)       ENABLE_NGINX=true; shift ;;
    --nginx-domain)       NGINX_DOMAIN="$2"; ENABLE_NGINX=true; shift 2 ;;
    --no-cleanup-cron)    ENABLE_CLEANUP_CRON=false; shift ;;
    --state-retain-days)  STATE_RETAIN_DAYS="$2"; shift 2 ;;
    --skip-install)       SKIP_INSTALL=true; shift ;;
    --skip-build)         SKIP_BUILD=true; shift ;;
    --skip-systemd)       SKIP_SYSTEMD=true; shift ;;
    -h|--help)            usage ;;
    *) die "Unknown argument: $1 (use --help)" ;;
  esac
done

[[ $EUID -eq 0 ]] || die "Please run with sudo (root required for apt / systemd / nginx)."

# Determine the unprivileged user that should own the repo and run vite preview.
if [[ -z "$SERVICE_USER" ]]; then
  if [[ -n "${SUDO_USER:-}" && "$SUDO_USER" != "root" ]]; then
    SERVICE_USER="$SUDO_USER"
  elif id -u ubuntu >/dev/null 2>&1; then
    SERVICE_USER="ubuntu"
  else
    SERVICE_USER="root"
  fi
fi
SERVICE_GROUP="$(id -gn "$SERVICE_USER")"

log "Config:"
log "  repo:           $REPO_URL"
log "  repo-dir:       $REPO_DIR"
log "  service-user:   $SERVICE_USER ($SERVICE_GROUP)"
log "  base-port:      $BASE_PORT"
log "  node-major:     $NODE_MAJOR"
log "  npm-registry:   $NPM_REGISTRY"
log "  nginx:          $ENABLE_NGINX domain=$NGINX_DOMAIN"
log "  cleanup-cron:   $ENABLE_CLEANUP_CRON retain=${STATE_RETAIN_DAYS}d"
log "  skip:           install=$SKIP_INSTALL build=$SKIP_BUILD systemd=$SKIP_SYSTEMD"

# -------- 1. system packages --------
log "Step 1/8: installing system packages"
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
APT_PKGS=(curl ca-certificates git tmux build-essential lsof jq)
$ENABLE_NGINX && APT_PKGS+=(nginx)
apt-get install -y --no-install-recommends "${APT_PKGS[@]}"

# -------- 2. node.js --------
log "Step 2/8: installing Node.js $NODE_MAJOR"
if ! command -v node >/dev/null 2>&1 || \
   [[ "$(node -v | sed 's/^v\([0-9]*\).*/\1/')" -lt "$NODE_MAJOR" ]]; then
  curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | bash -
  apt-get install -y nodejs
else
  log "  node $(node -v) already satisfies >= v${NODE_MAJOR}, skipping"
fi

# -------- 3. npm registry --------
log "Step 3/8: configuring npm registry mirror"
sudo -u "$SERVICE_USER" -H npm config set registry "$NPM_REGISTRY"
sudo -u "$SERVICE_USER" -H npm config set fund false
sudo -u "$SERVICE_USER" -H npm config set audit false

# -------- 4. clone / update repo --------
log "Step 4/8: syncing repo into $REPO_DIR"
mkdir -p "$(dirname "$REPO_DIR")"
if [[ -d "$REPO_DIR/.git" ]]; then
  sudo -u "$SERVICE_USER" -H git -C "$REPO_DIR" fetch --depth=1 origin
  sudo -u "$SERVICE_USER" -H git -C "$REPO_DIR" reset --hard origin/HEAD
else
  sudo -u "$SERVICE_USER" -H git clone --depth=1 "$REPO_URL" "$REPO_DIR"
fi
chown -R "$SERVICE_USER:$SERVICE_GROUP" "$REPO_DIR"
chmod +x "$REPO_DIR/deploy-all.sh"

# Override BASE_PORT in deploy-all.sh if user requested a non-default.
if [[ "$BASE_PORT" != "8000" ]]; then
  log "  overriding BASE_PORT=$BASE_PORT in deploy-all.sh"
  sed -i "s/^BASE_PORT=.*/BASE_PORT=$BASE_PORT/" "$REPO_DIR/deploy-all.sh"
fi

# Make sure helper scripts under deploy/volcano are executable too (in case
# the user dropped them into the cloned tree manually).
if [[ -d "$REPO_DIR/deploy/volcano" ]]; then
  chmod +x "$REPO_DIR/deploy/volcano/"*.sh 2>/dev/null || true
fi

# -------- 5. run deploy-all.sh --------
log "Step 5/8: running deploy-all.sh (this is the slow part)"
DEPLOY_ARGS=(--no-attach)
$SKIP_INSTALL && DEPLOY_ARGS+=(--skip-install)
$SKIP_BUILD   && DEPLOY_ARGS+=(--skip-build)

# Kill any pre-existing tmux session so we start clean.
sudo -u "$SERVICE_USER" -H tmux kill-session -t "$TMUX_SESSION" 2>/dev/null || true

sudo -u "$SERVICE_USER" -H -- bash -lc \
  "cd '$REPO_DIR' && ./deploy-all.sh ${DEPLOY_ARGS[*]}"

# -------- 6. systemd unit --------
if ! $SKIP_SYSTEMD; then
  log "Step 6/8: installing systemd unit"
  UNIT_FILE="/etc/systemd/system/cua-gym-hub.service"
  cat > "$UNIT_FILE" <<EOF
[Unit]
Description=CUA-Gym-Hub all mocks (tmux + vite preview)
After=network.target

[Service]
Type=oneshot
RemainAfterExit=yes
User=$SERVICE_USER
Group=$SERVICE_GROUP
WorkingDirectory=$REPO_DIR
Environment=HOME=/home/$SERVICE_USER
ExecStartPre=-/usr/bin/tmux kill-session -t $TMUX_SESSION
ExecStart=$REPO_DIR/deploy-all.sh --skip-install --skip-build --no-attach
ExecStop=/usr/bin/tmux kill-session -t $TMUX_SESSION
TimeoutStartSec=600

[Install]
WantedBy=multi-user.target
EOF
  systemctl daemon-reload
  systemctl enable cua-gym-hub.service
  # We already started it manually via deploy-all.sh; mark active for systemd.
  systemctl restart cua-gym-hub.service || warn "systemd restart returned non-zero; check 'systemctl status cua-gym-hub'"
else
  log "Step 6/8: --skip-systemd, leaving tmux session standalone"
fi

# -------- 7. cleanup cron --------
if $ENABLE_CLEANUP_CRON; then
  log "Step 7/8: installing daily cleanup cron (retain=${STATE_RETAIN_DAYS}d)"
  CLEANUP_FILE="/etc/cron.daily/cua-gym-hub-cleanup"
  cat > "$CLEANUP_FILE" <<EOF
#!/usr/bin/env bash
# Auto-generated by CUA-Gym-Hub bootstrap.sh
set -euo pipefail
RETAIN_DAYS=$STATE_RETAIN_DAYS
REPO_DIR="$REPO_DIR"
find "\$REPO_DIR"/websites/*/.mock-states -type f -mtime +\$RETAIN_DAYS -delete 2>/dev/null || true
find "\$REPO_DIR"/websites/*/.mock-files  -type f -mtime +\$RETAIN_DAYS -delete 2>/dev/null || true
EOF
  chmod +x "$CLEANUP_FILE"
else
  log "Step 7/8: --no-cleanup-cron, skipping"
fi

# -------- 8. nginx (optional) --------
if $ENABLE_NGINX; then
  log "Step 8/8: generating nginx reverse proxy config"
  [[ -n "$NGINX_DOMAIN" ]] || die "--enable-nginx requires --nginx-domain <wildcard-root>"

  WEB_DIR="$REPO_DIR/websites"
  MAP_BODY=""
  i=0
  for d in $(ls -1 "$WEB_DIR" | sort); do
    [[ -d "$WEB_DIR/$d" ]] || continue
    [[ "$d" == *_mock ]] || continue
    sub="$(echo "${d%_mock}" | tr '[:upper:]_' '[:lower:]-')"
    port=$((BASE_PORT + i))
    MAP_BODY+="    \"${sub}.${NGINX_DOMAIN}\" ${port};\n"
    i=$((i + 1))
  done

  NGINX_CONF="/etc/nginx/sites-available/cua-gym-hub.conf"
  {
    echo "# Auto-generated by CUA-Gym-Hub bootstrap.sh"
    echo "map \$host \$cua_mock_port {"
    echo "    default 0;"
    printf "%b" "$MAP_BODY"
    echo "}"
    echo ""
    echo "server {"
    echo "    listen 80;"
    echo "    server_name *.${NGINX_DOMAIN};"
    echo ""
    echo "    # Reject hosts we don't recognise instead of proxying to port 0."
    echo "    if (\$cua_mock_port = 0) { return 404; }"
    echo ""
    echo "    client_max_body_size 50m;   # /upload"
    echo ""
    echo "    location / {"
    echo "        proxy_pass http://127.0.0.1:\$cua_mock_port;"
    echo "        proxy_http_version 1.1;"
    echo "        proxy_set_header Host \$host;"
    echo "        proxy_set_header X-Real-IP \$remote_addr;"
    echo "        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;"
    echo "        proxy_set_header X-Forwarded-Proto \$scheme;"
    echo "        proxy_read_timeout 120s;"
    echo "    }"
    echo "}"
  } > "$NGINX_CONF"

  ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/cua-gym-hub.conf
  rm -f /etc/nginx/sites-enabled/default
  nginx -t
  systemctl reload nginx
  log "  nginx ready — point *.${NGINX_DOMAIN} at this VM's public IP"
  log "  next: 'sudo certbot --nginx -d *.${NGINX_DOMAIN}' for HTTPS"
else
  log "Step 8/8: nginx disabled, mocks listen directly on ports ${BASE_PORT}-$((BASE_PORT + 97))"
fi

# -------- summary --------
log "Done."
echo ""
echo "=========================================="
echo "CUA-Gym-Hub deployment complete"
echo "=========================================="
echo "Repo:        $REPO_DIR"
echo "Run user:    $SERVICE_USER"
echo "Tmux:        sudo -u $SERVICE_USER tmux attach -t $TMUX_SESSION"
$SKIP_SYSTEMD || echo "Systemd:     systemctl status cua-gym-hub"
echo "Ports:       ${BASE_PORT}-$((BASE_PORT + 97))"
echo ""
echo "Verify:"
echo "  bash $REPO_DIR/deploy/volcano/healthcheck.sh --base-port $BASE_PORT"
echo ""
$ENABLE_NGINX && {
  echo "Nginx reverse proxy serving *.${NGINX_DOMAIN}"
  echo "Map file:  /etc/nginx/sites-available/cua-gym-hub.conf"
  echo ""
}
echo "Port map:"
i=0
for d in $(ls -1 "$REPO_DIR/websites" | sort); do
  [[ -d "$REPO_DIR/websites/$d" ]] || continue
  [[ "$d" == *_mock ]] || continue
  printf "  %5d  %s\n" "$((BASE_PORT + i))" "$d"
  i=$((i + 1))
done
