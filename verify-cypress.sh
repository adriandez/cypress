#!/bin/bash
# Check if Cypress can be started and verify its installation only if necessary.
if ! npx cypress verify; then
  echo "Cypress verification failed. Attempting to verify again..."
  npx cypress verify
else
  echo "Cypress is verified successfully."
fi
