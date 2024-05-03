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

echo "Authenticating with Xray API..."
# Authenticate and retrieve a token
token=$(curl -s -H "Content-Type: application/json" -X POST --data @"cloud_auth.json" "$BASE_URL/api/v2/authenticate" | tr -d '"')
if [ -z "$token" ]; then
    echo "Failed to retrieve authentication token. Check cloud_auth.json and API connectivity." >&2
    exit 1
fi
echo "Authentication successful. Token received."

echo "Downloading feature files..."
# Download the zip file containing the feature files
if ! curl -s -H "Content-Type: application/json" -H "Authorization: Bearer $token" -X GET "$BASE_URL/api/v2/export/cucumber?keys=$KEYS" -o "$EXPORT_DIR/features.zip"; then
    echo "Failed to download feature files. Check API settings and network connection." >&2
    exit 1
fi
echo "Download successful."

echo "Unzipping feature files..."
# Unzip the features.zip into the specified directory
if ! unzip -o "$EXPORT_DIR/features.zip" -d "$EXPORT_DIR/"; then
    echo "Failed to unzip feature files. Check the integrity of features.zip." >&2
    exit 1
fi
echo "Unzipping successful."

echo "Renaming extracted files to remove numbering..."
# Remove numerical prefixes and unnecessary key-number pairs from the filenames
cd "$EXPORT_DIR"
for f in *.feature; do
    mv "$f" "$(echo $f | sed -E "s/^[0-9]+_($KEY-[0-9]+).*\.feature$/\1.feature/")"
done
cd ..

echo "Processing feature files..."
# Loop through each feature file in the export directory
for export_file in "$EXPORT_DIR"/*.feature; do
    # Extract just the filename from the path
    export_filename=$(basename "$export_file")
    # Extract the KEY-NUM prefix (e.g., DEMO-18) from the filename
    key_num=$(echo "$export_filename" | grep -oE "^$KEY-[0-9]+")

    echo "Searching for matches for $key_num in $PROJECT_FEATURE_DIR..."
    # Find matching feature files in the project feature directory that start with the same KEY-NUM prefix
    if find "$PROJECT_FEATURE_DIR" -type f -name "$key_num*.feature" -print0 | xargs -0 -I {} sh -c 'mv "$1" "$2" && echo "Moved $1 to $2" || echo "Failed to move $1 to $2"' _ "$export_file" {}; then
        echo "Processing of $export_file completed."
    else
        echo "Failed to process $export_file or no matches found." >&2
    fi
done

echo "Feature file processing complete."
