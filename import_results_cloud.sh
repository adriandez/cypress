#!/bin/bash

# Define base URL and file path
BASE_URL="https://xray.cloud.getxray.app"
FILE="cloud-import-results/cucumber-report.json"

# Function to log messages with timestamp
log() {
  echo "$(date '+%Y-%m-%d %H:%M:%S') - $1"
}

# Start script
log "Starting script to upload cucumber-report.json to Xray."

# Check if the report file exists
if [ ! -f "$FILE" ]; then
    log "Error: File not found - $FILE"
    exit 1
fi

# Authenticate and retrieve token
log "Authenticating to retrieve token..."
token=$(curl -H "Content-Type: application/json" -X POST --data @"cloud_auth.json" "$BASE_URL/api/v1/authenticate" | tr -d '"' | tr -d '\n')

# Check for an empty token
if [ -z "$token" ]; then
    log "Failed to retrieve token. Check credentials and network."
    exit 1
fi

# Upload the cucumber report
log "Uploading $FILE to Xray..."
response=$(curl -w "%{http_code}" -o response.txt -H "Content-Type: application/json" -X POST -H "Authorization: Bearer $token" --data @"$FILE" "$BASE_URL/api/v1/import/execution/cucumber")

# Output response details whether success or failure
log "Response details:"
cat response.txt

# Check response status
if [ "$response" -ne 200 ]; then
    log "Failed to upload file. HTTP status: $response"
    exit 1
else
    log "File uploaded successfully."
fi

# Clean up response file
rm response.txt

# End script
log "Script completed."
