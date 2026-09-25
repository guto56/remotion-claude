#!/bin/bash
set -euo pipefail

# Only needed in Claude Code on the web sessions.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

npm install

# Remotion downloads Chrome Headless Shell from remotion.media, which the
# cloud network allowlist blocks. Use the pre-installed one instead.
BROWSER=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
if [ -x "$BROWSER" ] && [ -n "${CLAUDE_ENV_FILE:-}" ]; then
  echo "export REMOTION_BROWSER_EXECUTABLE=\"$BROWSER\"" >> "$CLAUDE_ENV_FILE"
fi

# Remotion launches Chrome with --no-proxy-server, so its HTTPS traffic (Google
# Fonts) goes through the sandbox egress gateway. Chrome only trusts certs in
# its NSS store, so import the environment's CA bundle there.
CA_BUNDLE=/root/.ccr/ca-bundle.crt
if [ -f "$CA_BUNDLE" ]; then
  if ! command -v certutil >/dev/null 2>&1; then
    apt-get install -y -q libnss3-tools >/dev/null 2>&1 ||
      { apt-get update -q >/dev/null 2>&1 && apt-get install -y -q libnss3-tools >/dev/null 2>&1; } ||
      true
  fi
  if command -v certutil >/dev/null 2>&1; then
    NSSDB="$HOME/.pki/nssdb"
    mkdir -p "$NSSDB"
    [ -f "$NSSDB/cert9.db" ] || certutil -N -d "sql:$NSSDB" --empty-password
    TMP=$(mktemp -d)
    awk -v dir="$TMP" '/BEGIN CERT/{n++} n{print > (dir "/ca" n ".pem")}' "$CA_BUNDLE"
    for f in "$TMP"/*.pem; do
      name=$(openssl x509 -in "$f" -noout -subject 2>/dev/null | sed 's/.*CN *= *//; s/,.*//') || continue
      certutil -A -d "sql:$NSSDB" -t "C,," -n "${name:-$(basename "$f")}" -i "$f" 2>/dev/null || true
    done
    rm -rf "$TMP"
  fi
fi
