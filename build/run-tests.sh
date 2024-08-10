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

# Start Xvfb
echo "Starting Xvfb..."
Xvfb :99 -screen 0 1920x1080x24 &
echo "Xvfb started."

# Run the tests
echo "Running Cypress tests..."
npm run test

