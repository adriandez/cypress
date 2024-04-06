#!/bin/bash
set -e

# Update package lists
apt-get update

# Install necessary dependencies for running browsers headlessly
# Note: This list should be kept in sync with your Dockerfile requirements
apt-get install -y --no-install-recommends \
    xvfb \
    dbus-x11 \
    libgtk2.0-0 \
    libgtk-3-0 \
    libgbm-dev \
    libnotify-dev \
    libgconf-2-4 \
    libnss3 \
    libxss1 \
    libasound2 \
    libxtst6 \
    xauth \
    wget \
    fonts-liberation \
    libappindicator3-1 \
    libatk-bridge2.0-0 \
    libatspi2.0-0 \
    libcups2 \
    libdbus-1-3 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils

# Generate the machine-id
dbus-uuidgen > /var/lib/dbus/machine-id

# Clean up cache and temporary files to keep the image size down
apt-get clean
rm -rf /var/lib/apt/lists/*