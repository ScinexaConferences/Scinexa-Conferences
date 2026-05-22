#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DB_DIR="$ROOT_DIR/.data/mongo"
LOG_FILE="$DB_DIR/mongod.log"
PID_FILE="$DB_DIR/mongod.pid"
SOCKET_DIR="$DB_DIR/socket"

mkdir -p "$DB_DIR" "$SOCKET_DIR"

if [[ -f "$PID_FILE" ]] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
  echo "Local MongoDB is already running with PID $(cat "$PID_FILE")."
  exit 0
fi

mongod \
  --dbpath "$DB_DIR" \
  --bind_ip 127.0.0.1 \
  --port 27017 \
  --pidfilepath "$PID_FILE" \
  --logpath "$LOG_FILE" \
  --unixSocketPrefix "$SOCKET_DIR" \
  --fork

echo "Local MongoDB started on mongodb://localhost:27017/scinexa_conferences"
