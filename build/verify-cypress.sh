#!/bin/bash
echo "[VERIFY-CYPRESS] Verifying Cypress installation"
# Check if Cypress can be started and verify its installation only if necessary.
if ! npx cypress verify; then
  echo "[VERIFY-CYPRESS] Cypress verification failed. Attempting to verify again"
  npx cypress verify || { echo "Cypress verification failed after retry."; exit 1; }
else
  echo "[VERIFY-CYPRESS] Cypress is verified successfully"
fi
