#!/bin/bash

# Load environment variables from .env file
set -a
if ! source .env; then
    echo "Error: Failed to load environment variables from .env file." >&2
    exit 1
fi
set +a

# Function to log messages with timestamp
log() {
  echo "$(date '+%Y-%m-%d %H:%M:%S') - $1"
}

# Start script
log "Starting script to upload files to Xray."

# Check if any files are provided as arguments
if [ -z "$FILES" ]; then
    log "Error: No files provided for upload."
    exit 1
fi

# Authenticate and retrieve token
log "Authenticating to retrieve token..."
token=$(curl -H "Content-Type: application/json" -X POST --data @"cloud_auth.json" "$BASE_URL/api/v2/authenticate" | tr -d '"' | tr -d '\n')

# Check for an empty token
if [ -z "$token" ]; then
    log "Failed to retrieve token. Check credentials and network."
    exit 1
fi

# Iterate over each file and upload
for FILE in $FILES; do
    # Check if the report file exists
    if [ ! -f "$FILE" ]; then
        log "Error: File not found - $FILE"
        continue
    fi

    # Upload the file
    log "Uploading $FILE to Xray..."
    response=$(curl -w "%{http_code}" -o response.txt -H "Content-Type: application/json" -X POST -H "Authorization: Bearer $token" --data @"$FILE" "$BASE_URL/api/v2/import/execution/cucumber")

    # Output response details whether success or failure
    log "Response details for $FILE:"
    if [ -f "response.txt" ]; then
        while IFS= read -r line; do
            echo "$line"
        done < "response.txt"
    else
        log "Failed to retrieve response details."
    fi

    # Check response status
    if [ "$response" -ne 200 ]; then
        log "Failed to upload file $FILE. HTTP status: $response"
    else
        log "File $FILE uploaded successfully."
    fi

    # Clean up response file
    rm response.txt
done

# End script
log "Script completed."
