import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import unzipper from 'unzipper';

dotenv.config();

const { EXPORT_DIR, BASE_URL, KEYS, KEY } = process.env;

if (!EXPORT_DIR || !BASE_URL || !KEYS || !KEY) {
  console.error('Error: Missing required environment variables.');
  process.exit(1);
}

fs.mkdirSync(EXPORT_DIR, { recursive: true });

const authenticate = async () => {
  const authData = JSON.parse(
    fs.readFileSync('./scripts/xray-integration/cloud-auth.json', 'utf8')
  );
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
  const response = await axios.get(
    `${BASE_URL}/api/v2/export/cucumber?keys=${KEYS}`,
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
      console.log(`Renaming ${file} to ${newFileName}`);
      fs.renameSync(
        path.join(EXPORT_DIR, file),
        path.join(EXPORT_DIR, newFileName)
      );
    } else {
      console.error(`Failed to extract key number from ${file}`);
    }
  });
};

const main = async () => {
  try {
    console.log('Authenticating with Xray API...');
    const token = await authenticate();
    console.log('Authentication successful. Token received.');
    console.log('Downloading feature files...');
    const zipFilePath = await downloadFeatures(token);
    console.log('Download successful.');
    console.log('Unzipping feature files...');
    await unzipFiles(zipFilePath);
    console.log('Unzipping successful.');
    console.log('Renaming extracted files to remove numbering...');
    renameFiles();
    console.log('File renaming complete.');
  } catch (error) {
    console.error('An error occurred:', error.message);
    process.exit(1);
  }
};

main();
