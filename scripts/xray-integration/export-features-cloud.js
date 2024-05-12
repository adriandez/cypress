import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import unzipper from 'unzipper';
import { logger } from '../logger.js'; // Import the custom logger

dotenv.config();

const { EXPORT_DIR, BASE_URL, EXPORT_ISSUE_KEYS, KEY } = process.env;

if (!EXPORT_DIR || !BASE_URL || !EXPORT_ISSUE_KEYS || !KEY) {
  logger.error('Error: Missing required environment variables.');
  process.exit(1);
}

fs.mkdirSync(EXPORT_DIR, { recursive: true });

const authenticate = async () => {
  logger.info('authenticate: preparing authData');
  const authData = JSON.parse(
    fs.readFileSync('./scripts/xray-integration/cloud-auth.json', 'utf8')
  );
  logger.info(`${BASE_URL}/api/v2/authenticate`);
  const authResponse = await axios.post(
    `${BASE_URL}/api/v2/authenticate`,
    authData,
    {
      headers: { 'Content-Type': 'application/json' }
    }
  );
  return authResponse.data.replace(/"/g, '');
};

const downloadFeatures = async (token) => {
  logger.info('downloadFeatures');
  logger.info(`${BASE_URL}/api/v2/export/cucumber?keys=${EXPORT_ISSUE_KEYS}`);
  const response = await axios.get(
    `${BASE_URL}/api/v2/export/cucumber?keys=${EXPORT_ISSUE_KEYS}`,
    {
      responseType: 'stream',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    }
  );
  const zipFilePath = path.join(EXPORT_DIR, 'features.zip');
  const writer = fs.createWriteStream(zipFilePath);
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on('finish', () => resolve(zipFilePath));
    writer.on('error', reject);
  });
};

const unzipFiles = async (zipFilePath) => {
  logger.info('unzipFiles');
  logger.info(zipFilePath);
  await fs
    .createReadStream(zipFilePath)
    .pipe(unzipper.Extract({ path: EXPORT_DIR }))
    .promise();
};

const renameFiles = () => {
  const featureFiles = fs
    .readdirSync(EXPORT_DIR)
    .filter((file) => file.endsWith('.feature'));
  featureFiles.forEach((file) => {
    const regex = new RegExp(`^[0-9]+_(${KEY}-[0-9]+).*\\.feature$`);
    const match = file.match(regex);
    if (match) {
      const newFileName = `${match[1]}.feature`;
      logger.info(`Renaming ${file} to ${newFileName}`);
      fs.renameSync(
        path.join(EXPORT_DIR, file),
        path.join(EXPORT_DIR, newFileName)
      );
    } else {
      logger.error(`Failed to extract key number from ${file}`);
    }
  });
};

const main = async () => {
  try {
    logger.start('export-rename-feature-files script');
    logger.attempting('Authenticating with Xray API...');
    const token = await authenticate();
    logger.success('Authentication successful. Token received.');
    logger.attempting('Downloading feature files...');
    const zipFilePath = await downloadFeatures(token);
    logger.success('Download successful.');
    logger.attempting('Unzipping feature files...');
    await unzipFiles(zipFilePath);
    logger.success('Unzipping successful.');
    logger.attempting('Renaming extracted files to remove numbering...');
    renameFiles();
    logger.success('File renaming complete.');
    logger.end('export-rename-feature-files script');
  } catch (error) {
    logger.error(`An error occurred: ${error.message}`);
    process.exit(1);
  }
};

main();
