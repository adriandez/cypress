#!/bin/bash
set -e

# Echo environment variables for logging purposes (optional)
echo "[TEST_ENV]: $TEST_ENV"
echo "[VIEWPORT_WIDTH]: $VIEWPORT_WIDTH"
echo "[VIEWPORT_HEIGHT]: $VIEWPORT_HEIGHT"
echo "[TEST_BROWSER]: $TEST_BROWSER"
echo "[ENABLE_VIDEO]: $ENABLE_VIDEO \n"

# Ensure bash is available (optional)
echo "[BASH] Checking if bash is available \n"
which bash

# Ensure correct permissions for /tmp
echo "[Permissions] Setting permissions for /tmp \n"
chmod 1777 /tmp

# Unset XDG_RUNTIME_DIR to avoid dbus-launch issues
echo "[XDG] Unsetting XDG_RUNTIME_DIR \n"
unset XDG_RUNTIME_DIR

# Start a new DBus session
echo "[DBUS] Starting new DBus session"
eval `dbus-launch --sh-syntax`
echo "[DBUS] DBus session started with address $DBUS_SESSION_BUS_ADDRESS \n"

# Kill any existing Xvfb processes (use pkill as an alternative)
echo "[XVFB] Killing existing Xvfb processes (if any)"
pkill -f Xvfb || true

# Check if DISPLAY variable is set, otherwise default to :99
if [ -z "$DISPLAY" ]; then
  export DISPLAY=:99
fi

# Start Xvfb on the specified DISPLAY
echo "[XVFB] Starting Xvfb on display $DISPLAY"
Xvfb $DISPLAY -screen 0 1920x1080x24 &
echo "[XVFB] Xvfb started on $DISPLAY \n"

# Wait for Xvfb to start
sleep 5

# Run the tests
echo "[CYPRESS] Running Cypress tests with browser $TEST_BROWSER \n"

# Execute the command passed to the docker run command
echo "[CMD] Executing command: $@"
exec "$@"
