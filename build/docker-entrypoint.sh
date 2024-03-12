#!/bin/bash
# Start D-Bus
dbus-daemon --session --fork

# Start Xvfb
Xvfb :99 -screen 0 1280x720x24 > /dev/null 2>&1 &

# Wait a bit for Xvfb to start
sleep 3

# Echo environment variables for logging purposes
echo "TEST_ENV: $TEST_ENV"
echo "VIEWPORT_WIDTH: $VIEWPORT_WIDTH"
echo "VIEWPORT_HEIGHT: $VIEWPORT_HEIGHT"
echo "TEST_BROWSER: $TEST_BROWSER"
echo "ENABLE_VIDEO: $ENABLE_VIDEO"

# Verify Cypress before proceeding
echo "Verifying Cypress installation..."
/usr/local/bin/verify-cypress.sh

# Execute the command passed to the docker run command
exec "$@"
