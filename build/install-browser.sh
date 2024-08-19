#!/bin/bash
set -e

if [ -z "$INSTALL_BROWSER" ]; then
    echo "[INSTALL-BROWSER] No browser specified. Skipping browser installation."
    exit 0
fi

case "$INSTALL_BROWSER" in
    chrome)
        echo "[INSTALL-BROWSER] Preparing to install Google Chrome"
        wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
        echo "[INSTALL-BROWSER] deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list
        apt-get update && apt-get install -y google-chrome-stable
        ;;
    firefox)
        echo "[INSTALL-BROWSER] Preparing to install Firefox"
        apt-get update && apt-get install -y firefox-esr
        ;;
    edge)
        echo "[INSTALL-BROWSER] Preparing to install Microsoft Edge"
        wget -q https://packages.microsoft.com/keys/microsoft.asc -O- | apt-key add -
        echo "deb [arch=amd64] https://packages.microsoft.com/repos/edge stable main" > /etc/apt/sources.list.d/microsoft-edge.list
        apt-get update && apt-get install -y microsoft-edge-stable
        ;;
    *)
        echo "[INSTALL-BROWSER] Unsupported browser: $INSTALL_BROWSER. Exiting."
        exit 1
        ;;
esac

# Verify installation
case "$INSTALL_BROWSER" in
    chrome)
        if ! command -v google-chrome &> /dev/null; then
            echo "[INSTALL-BROWSER] Google Chrome installation failed"
            exit 1
        else
            echo "[INSTALL-BROWSER] Google Chrome installed successfully"
        fi
        ;;
    firefox)
        if ! command -v firefox &> /dev/null; then
            echo "[INSTALL-BROWSER] Firefox installation failed"
            exit 1
        else
            echo "[INSTALL-BROWSER] Firefox installed successfully"
        fi
        ;;
    edge)
        if ! command -v microsoft-edge &> /dev/null; then
            echo "[INSTALL-BROWSER] Microsoft Edge installation failed"
            exit 1
        else
            echo "[INSTALL-BROWSER] Microsoft Edge installed successfully"
        fi
        ;;
esac

# Output browser version
case "$INSTALL_BROWSER" in
    chrome)
        google-chrome --version
        ;;
    firefox)
        firefox --version
        ;;
    edge)
        microsoft-edge --version
        ;;
esac
