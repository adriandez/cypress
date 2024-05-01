#!/bin/bash

# Load environment variables from .env file
set -a
if ! source .env; then
    echo "Error: Failed to load environment variables from .env file." >&2
    exit 1
fi
set +a

# Create the directory if it does not exist
mkdir -p "$EXPORT_DIR" || { echo "Error: Failed to create directory $EXPORT_DIR"; exit 1; }

echo "Zipping feature files from cypress/e2e/cucumber/feature..."
if zip -r "$EXPORT_DIR/features.zip" cypress/e2e/cucumber/feature/ -i \*.feature; then
    echo "Feature files are successfully zipped and saved to $EXPORT_DIR/features.zip"
    echo "Review the zip file before uploading to ensure it contains the correct files."
else
    echo "Error zipping feature files."
    exit 1
fi

echo "Authenticating with Xray API..."
token=$(curl -H "Content-Type: application/json" -X POST --data @"cloud_auth.json" "$BASE_URL/api/v2/authenticate" | tr -d '"')

if [ -z "$token" ]; then
    echo "Failed to retrieve authentication token. Check cloud_auth.json and API connectivity."
    exit 1
fi
echo "Authentication successful. Token received."

echo "Uploading feature files to Xray..."
response=$(curl -s -H "Content-Type: multipart/form-data" -H "Authorization: Bearer $token" -F "file=@$EXPORT_DIR/features.zip" "$BASE_URL/api/v2/import/feature?projectKey=$PROJECT")

# Error checking based on the presence of "error" key in the response
if echo "$response" | grep -q '"error"'; then
    echo "Failed to upload feature files. Error: $response"
    exit 1
else
    echo "Feature files successfully uploaded. Response: $response"
fi
