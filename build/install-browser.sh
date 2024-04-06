#!/bin/bash

set -e

case "$INSTALL_BROWSER" in
    chrome)
        echo "Preparing to install Google Chrome..."
        wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
        echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list
        apt-get update && apt-get install -y google-chrome-stable
        echo "Google Chrome installed successfully."
        ;;
    firefox)
        echo "Preparing to install Firefox..."
        apt-get update && apt-get install -y firefox-esr
        echo "Firefox installed successfully."
        ;;
    edge)
        echo "Preparing to install Microsoft Edge..."
        wget -q https://packages.microsoft.com/keys/microsoft.asc -O- | apt-key add -
        echo "deb [arch=amd64] https://packages.microsoft.com/repos/edge stable main" > /etc/apt/sources.list.d/microsoft-edge.list
        apt-get update && apt-get install -y microsoft-edge-stable
        echo "Microsoft Edge installed successfully."
        ;;
    *)
        echo "Unsupported browser: $INSTALL_BROWSER. Exiting."
        exit 1
        ;;
esac
