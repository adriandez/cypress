#!/bin/bash
set -e

# Echo environment variables for logging purposes (optional)
echo -e "[JQL_QUERY]: $JQL_QUERY\n"
echo -e "[TEST_ENV]: $TEST_ENV\n"
echo -e "[VIEWPORT_WIDTH]: $VIEWPORT_WIDTH\n"
echo -e "[VIEWPORT_HEIGHT]: $VIEWPORT_HEIGHT\n"
echo -e "[TEST_BROWSER]: $TEST_BROWSER\n"
echo -e "[ENABLE_VIDEO]: $ENABLE_VIDEO\n"
echo -e "[CHECK_ALL_CONTAINERS_COMPLETE]: $CHECK_ALL_CONTAINERS_COMPLETE\n"

# Ensure bash is available (optional)
echo -e "[BASH] Checking if bash is available"
which bash

# Ensure correct permissions for /tmp
echo -e "[Permissions] Setting permissions for /tmp\n"
chmod 1777 /tmp

# Unset XDG_RUNTIME_DIR to avoid dbus-launch issues
echo -e "[XDG] Unsetting XDG_RUNTIME_DIR\n"
unset XDG_RUNTIME_DIR

# Start a new DBus session
echo -e "[DBUS] Starting new DBus session"
eval `dbus-launch --sh-syntax`
echo -e "[DBUS] DBus session started with address $DBUS_SESSION_BUS_ADDRESS\n"

# Kill any existing Xvfb processes (use pkill as an alternative)
echo -e "[XVFB] Killing existing Xvfb processes (if any)"
pkill -f Xvfb || true

# Check if DISPLAY variable is set, otherwise default to :99
if [ -z "$DISPLAY" ]; then
  export DISPLAY=:99
fi

# Start Xvfb on the specified DISPLAY
echo -e "[XVFB] Starting Xvfb on display $DISPLAY"
Xvfb $DISPLAY -screen 0 1920x1080x24 &
echo -e "[XVFB] Xvfb started on $DISPLAY\n"

# Wait for Xvfb to start
sleep 5

# Run the tests
echo -e "[CYPRESS] Running Cypress tests with browser $TEST_BROWSER\n"

# Execute the command passed to the docker run command
echo -e "[CMD] Executing command: $@\n"
exec "$@"
