import fs from 'fs';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';
import FormData from 'form-data';
import { logger } from '../logger.js'; // Adjusted import path to match your folder structure

dotenv.config();

const { DIRECTORY, BASE_URL } = process.env;

if (!DIRECTORY) {
  logger.error('DIRECTORY not set in .env file.');
  process.exit(1);
}

if (!BASE_URL) {
  logger.error('BASE_URL not set in .env file.');
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
    logger.error('Failed to authenticate. Check credentials and network.');
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
    logger.error(
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
  logger.start('Upload JSON files to Xray.');

  // Authenticate
  logger.attempting('Authenticating to retrieve token...');
  const token = await authenticate();

  const cucumberFiles = findFiles(DIRECTORY, '.cucumber.json');

  if (cucumberFiles.length === 0) {
    logger.warn('No cucumber JSON files found in the directory.');
    return;
  }

  for (const cucumberFile of cucumberFiles) {
    const infoFile = cucumberFile.replace('.cucumber.json', '-info.json');
    if (!fs.existsSync(infoFile)) {
      logger.error(`Info file missing for ${cucumberFile}`);
      continue;
    }
    logger.attempting(`Uploading ${cucumberFile} and ${infoFile} to Xray...`);
    const response = await uploadFile(token, cucumberFile, infoFile);

    if (response && response.status === 200) {
      logger.success(
        `Files ${cucumberFile} and ${infoFile} uploaded successfully.`
      );
      logger.success(`${infoFile} uploaded successfully.`);
    } else {
      logger.error(
        `Failed to upload files. HTTP status: ${response ? response.status : 'unknown'}`
      );
    }
  }

  logger.end('Upload JSON files to Xray completed.');
};

main().catch((error) => {
  logger.error(`Unexpected error: ${error.message}`);
  process.exit(1);
});
