#!/bin/sh

CERT_DIR="/etc/nginx/ssl"
mkdir -p "$CERT_DIR"

# Generate a temporary self-signed certificate if none exists
# This allows Nginx to start before Certbot runs
if [ ! -f "$CERT_DIR/server.crt" ]; then
  echo "[ssl-setup] No certificate found. Generating temporary self-signed certificate..."
  openssl req -x509 -nodes -days 1 \
    -newkey rsa:2048 \
    -keyout "$CERT_DIR/server.key" \
    -out "$CERT_DIR/server.crt" \
    -subj "/CN=temporary"
fi
