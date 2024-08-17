#!/bin/bash
set -e

# Ensure correct permissions for /tmp
echo "Setting permissions for /tmp..."
chmod 1777 /tmp

# Unset XDG_RUNTIME_DIR to avoid dbus-launch issues
echo "Unsetting XDG_RUNTIME_DIR..."
unset XDG_RUNTIME_DIR

# Start a new DBus session
echo "Starting new DBus session..."
eval `dbus-launch --sh-syntax`
echo "DBus session started with address $DBUS_SESSION_BUS_ADDRESS."

# Kill any existing Xvfb processes (use pkill as an alternative)
echo "Killing existing Xvfb processes (if any)..."
pkill -f Xvfb || true

# Check if DISPLAY variable is set, otherwise default to :99
if [ -z "$DISPLAY" ]; then
  export DISPLAY=:99
fi

# Start Xvfb on the specified DISPLAY
echo "Starting Xvfb on display $DISPLAY..."
Xvfb $DISPLAY -screen 0 1920x1080x24 &
echo "Xvfb started on $DISPLAY."

# Wait for Xvfb to start
sleep 5

# Run the tests
echo "Running Cypress tests with browser $TEST_BROWSER..."
npm run test
