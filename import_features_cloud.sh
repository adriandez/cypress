#!/bin/bash

BASE_URL=https://xray.cloud.getxray.app
PROJECT=DEMO

zip -r features.zip cypress/e2e/cucumber/feature/ -i \*.feature

token=$(curl -H "Content-Type: application/json" -X POST --data @"cloud_auth.json" "$BASE_URL/api/v1/authenticate" | tr -d '"')
curl -H "Content-Type: multipart/form-data" -H "Authorization: Bearer $token"  -F "file=@features.zip" "$BASE_URL/api/v1/import/feature?projectKey=$PROJECT"
