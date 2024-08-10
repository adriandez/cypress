#!/bin/bash
set -e

# Start D-Bus
echo "Starting D-Bus..."
mkdir -p /run/dbus
chown root:messagebus /run/dbus
chmod 755 /run/dbus
dbus-daemon --system --fork

# Start Xvfb
echo "Starting Xvfb..."
Xvfb :99 -screen 0 1920x1080x24 > /dev/null 2>&1 &

# Wait a bit for Xvfb to start
echo "Waiting for Xvfb to start..."
sleep 5

# Echo environment variables for logging purposes
echo "TEST_ENV: $TEST_ENV"
echo "VIEWPORT_WIDTH: $VIEWPORT_WIDTH"
echo "VIEWPORT_HEIGHT: $VIEWPORT_HEIGHT"
echo "TEST_BROWSER: $TEST_BROWSER"
echo "ENABLE_VIDEO: $ENABLE_VIDEO"

# Verify Cypress before proceeding
echo "Verifying Cypress installation..."
/usr/local/bin/verify-cypress.sh

# Ensure bash is available
echo "Checking if bash is available..."
which bash

# Print information about the display environment
echo "Display environment info:"
xdpyinfo -display :99 || { echo "Failed to start Xvfb"; exit 1; }

# Execute the command passed to the docker run command
echo "Executing command: $@"
exec "$@"
