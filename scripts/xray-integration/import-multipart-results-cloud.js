import fs from 'fs';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';
import FormData from 'form-data';

dotenv.config();

// Logging function with timestamp
const log = (message) => {
  console.log(`${new Date().toISOString()} - ${message}`);
};

// Load environment variables
const { DIRECTORY, BASE_URL } = process.env;

if (!DIRECTORY) {
  log('Error: DIRECTORY not set in .env file.');
  process.exit(1);
}

if (!BASE_URL) {
  log('Error: BASE_URL not set in .env file.');
  process.exit(1);
}

const authenticate = async () => {
  try {
    const authData = fs.readFileSync(
      './scripts/xray-integration/cloud-auth.json',
      'utf-8'
    );
    const response = await axios.post(
      `${BASE_URL}/api/v2/authenticate`,
      JSON.parse(authData),
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
    return response.data;
  } catch (error) {
    log('Error: Failed to authenticate. Check credentials and network.');
    process.exit(1);
  }
};

const uploadFile = async (token, cucumberFilePath, infoFilePath) => {
  try {
    const formData = new FormData();
    formData.append('results', fs.createReadStream(cucumberFilePath));
    formData.append('info', fs.createReadStream(infoFilePath));

    const response = await axios.post(
      `${BASE_URL}/api/v2/import/execution/cucumber/multipart`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          ...formData.getHeaders()
        }
      }
    );
    return response;
  } catch (error) {
    log(
      `Failed to upload files ${cucumberFilePath} and ${infoFilePath}. Error: ${error.message}`
    );
  }
};

const findFiles = (dir, pattern) => {
  let results = [];
  fs.readdirSync(dir).forEach((inner) => {
    const innerPath = path.join(dir, inner);
    const stat = fs.statSync(innerPath);
    if (stat.isDirectory()) {
      results = results.concat(findFiles(innerPath, pattern));
    } else if (stat.isFile() && inner.endsWith(pattern)) {
      results.push(innerPath);
    }
  });
  return results;
};

const main = async () => {
  log('Starting script to upload JSON files to Xray.');

  // Authenticate
  log('Authenticating to retrieve token...');
  const token = await authenticate();

  const cucumberFiles = findFiles(DIRECTORY, '.cucumber.json');

  if (cucumberFiles.length === 0) {
    log('No cucumber JSON files found in the directory.');
    return;
  }

  for (const cucumberFile of cucumberFiles) {
    const infoFile = cucumberFile.replace('.cucumber.json', '-info.json');
    if (!fs.existsSync(infoFile)) {
      log(`Info file missing for ${cucumberFile}`);
      continue;
    }
    log(`Uploading ${cucumberFile} and ${infoFile} to Xray...`);
    const response = await uploadFile(token, cucumberFile, infoFile);

    if (response && response.status === 200) {
      log(`Files ${cucumberFile} and ${infoFile} uploaded successfully.`);
    } else {
      log(
        `Failed to upload files. HTTP status: ${response ? response.status : 'unknown'}`
      );
    }
  }

  log('Script completed.');
};

main().catch((error) => {
  log(`Unexpected error: ${error.message}`);
  process.exit(1);
});
