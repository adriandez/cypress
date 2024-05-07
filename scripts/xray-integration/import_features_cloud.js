import 'dotenv/config';
import fs from 'fs/promises';
import archiver from 'archiver';
import axios from 'axios';
import FormData from 'form-data';

const EXPORT_DIR = process.env.EXPORT_DIR;
const BASE_URL = process.env.BASE_URL;
const PROJECT = process.env.PROJECT;

const createDirectoryIfNotExists = async (dir) => {
  try {
    await fs.mkdir(dir, { recursive: true });
    console.log(`Directory created or already exists: ${dir}`);
  } catch (err) {
    console.error(`Error: Failed to create directory ${dir}`, err);
    process.exit(1);
  }
};

const zipFeatureFiles = () => {
  const archive = archiver('zip', { zlib: { level: 9 } });
  const outputBuffer = [];

  return new Promise((resolve, reject) => {
    archive.on('data', (data) => outputBuffer.push(data));
    archive.on('finish', () => resolve(Buffer.concat(outputBuffer)));
    archive.on('error', reject);

    archive.glob('*.feature', {
      cwd: 'cypress/e2e/cucumber/feature'
    });
    archive.finalize();
  });
};

const authenticateWithXray = async () => {
  try {
    const authData = JSON.parse(
      await fs.readFile('./scripts/xray-integration/cloud-auth.json', 'utf-8')
    );
    const response = await axios.post(
      `${BASE_URL}/api/v2/authenticate`,
      authData,
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
    const token = response.data.replace(/"/g, '');
    console.log('Authentication successful. Token received.');
    return token;
  } catch (err) {
    console.error('Failed to retrieve authentication token.', err);
    process.exit(1);
  }
};

const uploadFeatureFilesToXray = async (token, fileBuffer) => {
  try {
    const formData = new FormData();
    formData.append('file', fileBuffer, {
      filename: 'features.zip',
      contentType: 'application/zip'
    });

    const response = await axios.post(
      `${BASE_URL}/api/v2/import/feature`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${token}`
        },
        params: { projectKey: PROJECT }
      }
    );

    if (response.data.error) {
      throw new Error(
        `Failed to upload feature files. Error: ${JSON.stringify(response.data)}`
      );
    } else {
      console.log(
        'Feature files successfully uploaded. Response:',
        JSON.stringify(response.data)
      );
    }
  } catch (err) {
    console.error('An error occurred during file upload:', err.message);
    process.exit(1);
  }
};

const main = async () => {
  await createDirectoryIfNotExists(EXPORT_DIR);
  const fileBuffer = await zipFeatureFiles();
  const token = await authenticateWithXray();
  await uploadFeatureFilesToXray(token, fileBuffer);
};

main();
