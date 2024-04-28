#!/bin/bash

BASE_URL="https://xray.cloud.getxray.app"
KEYS="DEMO-15;DEMO-16;DEMO-17;DEMO-18"
echo "Authenticating with Xray API..."
token=$(curl -H "Content-Type: application/json" -X POST --data @"cloud_auth.json" $BASE_URL/api/v2/authenticate | tr -d '"')

if [ -z "$token" ]; then
    echo "Failed to retrieve authentication token. Check cloud_auth.json and API connectivity."
    exit 1
fi
echo "Authentication successful. Token received."

echo "Downloading feature files..."
curl -H "Content-Type: application/json" -X GET -H "Authorization: Bearer $token" "$BASE_URL/api/v2/export/cucumber?keys=$KEYS" -o features.zip

if [ $? -ne 0 ]; then
    echo "Failed to download feature files. Check API settings and network connection."
    exit 1
fi
echo "Download successful."

echo "Unzipping new feature files..."
unzip -o features.zip -d cypress/e2e/cucumber/feature/
if [ $? -ne 0 ]; then
    echo "Failed to unzip feature files. Check the integrity of features.zip."
    exit 1
fi
echo "Unzipping successful."

echo "Processing and moving feature files..."
find cypress/e2e/cucumber/feature/ -name "*.feature" | while read file; do
    # Remove path and extension, and extract the base part of the file name
    basefile=$(basename "$file" .feature)
    # Use sed to remove numeric prefixes followed by an underscore (e.g., "1_")
    clean_name=$(echo "$basefile" | sed -E 's/^[0-9]+_(DEMO-[0-9]+.*)/\1/')
    # Attempt to move the file to its corresponding directory based on a naming convention
    # This assumes you have a directory structure and naming convention to follow
    target="cypress/e2e/cucumber/feature/$clean_name.feature"
    if [ "$file" != "$target" ]; then
        mv "$file" "$target"
        echo "Moved $file to $target"
    else
        echo "File is already in the correct location: $file"
    fi
done
echo "Feature file processing complete."
