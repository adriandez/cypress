#!/bin/bash
# Start D-Bus
dbus-daemon --session --fork
# Start Xvfb
Xvfb :99 -screen 0 1280x720x24 > /dev/null 2>&1 &
# Wait a bit for Xvfb to start
sleep 3
# Echo
echo "TEST_ENV: $TEST_ENV"
echo "TEST_BROWSER: $TEST_BROWSER"
# Execute the command passed to the docker run command
exec "$@"