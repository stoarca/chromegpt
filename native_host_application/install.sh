#!/usr/bin/env bash

set -e

HOST_NAME="dev.chromegpt.nativehost"
INSTALL_DIR="/opt/chromegpt"
HOST_MANIFEST_DIR="/etc/opt/chrome/native-messaging-hosts"
HOST_MANIFEST="$HOST_MANIFEST_DIR/$HOST_NAME.json"

# Create the installation directories
sudo mkdir -p "$INSTALL_DIR"
sudo mkdir -p "$HOST_MANIFEST_DIR"

# Copy the Python native host script
sudo cp chromegpt.py "$INSTALL_DIR/"
sudo chmod +x "$INSTALL_DIR/chromegpt.py"

# Copy the native messaging host manifest
sudo cp dev.chromegpt.nativehost.json "$HOST_MANIFEST"
sudo chmod 644 "$HOST_MANIFEST"