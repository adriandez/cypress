#!/bin/bash

# Define the base URL and authentication keys
BASE_URL="https://xray.cloud.getxray.app"
KEYS="DEMO-15;DEMO-16;DEMO-17;DEMO-18"

# Directory to store the downloaded zip and extracted files
EXPORT_DIR="cloud-export"
PROJECT_FEATURE_DIR="cypress/e2e/cucumber/feature"

# Create the directory if it does not exist
mkdir -p "$EXPORT_DIR"

echo "Authenticating with Xray API..."
# Authenticate and retrieve a token
token=$(curl -H "Content-Type: application/json" -X POST --data @"cloud_auth.json" $BASE_URL/api/v2/authenticate | tr -d '"')

if [ -z "$token" ]; then
    echo "Failed to retrieve authentication token. Check cloud_auth.json and API connectivity."
    exit 1
fi
echo "Authentication successful. Token received."

echo "Downloading feature files..."
# Download the zip file containing the feature files
curl -H "Content-Type: application/json" -X GET -H "Authorization: Bearer $token" "$BASE_URL/api/v2/export/cucumber?keys=$KEYS" -o "$EXPORT_DIR/features.zip"

if [ $? -ne 0 ]; then
    echo "Failed to download feature files. Check API settings and network connection."
    exit 1
fi
echo "Download successful."

echo "Unzipping feature files..."
# Unzip the features.zip into the specified directory
unzip -o "$EXPORT_DIR/features.zip" -d "$EXPORT_DIR/"

if [ $? -ne 0 ]; then
    echo "Failed to unzip feature files. Check the integrity of features.zip."
    exit 1
fi
echo "Unzipping successful."

echo "Renaming extracted files to remove numbering..."
# Remove numerical prefixes from the filenames
cd "$EXPORT_DIR"
for f in *.feature; do
    mv "$f" "$(echo $f | sed -E 's/^[0-9]+_(DEMO-[0-9]+\.feature)$/\1/')"
done
cd ..

echo "Searching for matching feature files in the project directory based on KEY-NUM prefix..."
# Loop through each feature file in the export directory
for export_file in "$EXPORT_DIR"/*.feature; do
    # Extract just the filename from the path
    export_filename=$(basename "$export_file")
    # Extract the KEY-NUM prefix (e.g., DEMO-18) from the filename
    key_num=$(echo "$export_filename" | grep -oE '^DEMO-[0-9]+')

    echo "Searching for matches for $key_num in $PROJECT_FEATURE_DIR..."

    # Find matching feature files in the project feature directory that start with the same KEY-NUM prefix
    find "$PROJECT_FEATURE_DIR" -type f -name "$key_num*.feature" | while read matching_file; do
        if [ -n "$matching_file" ]; then
            echo "Match found: $matching_file"
            # Move the file from cloud-export to the matching file's location
            mv "$export_file" "$matching_file"
            echo "Moved $export_file to $matching_file"
        else
            echo "No match found for files starting with $key_num"
        fi
    done
done

echo "Feature file processing complete."
