#!/bin/bash
set -e

# Echo environment variables for logging purposes (optional)
echo "TEST_ENV: $TEST_ENV"
echo "VIEWPORT_WIDTH: $VIEWPORT_WIDTH"
echo "VIEWPORT_HEIGHT: $VIEWPORT_HEIGHT"
echo "TEST_BROWSER: $TEST_BROWSER"
echo "ENABLE_VIDEO: $ENABLE_VIDEO"

# Ensure bash is available (optional)
echo "Checking if bash is available..."
which bash

# Execute the command passed to the docker run command
echo "Executing command: $@"
exec "$@"
