import fs from 'fs';
import https from 'https';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Create the directory if it does not exist
const EXPORT_DIR = process.env.EXPORT_DIR;
if (!fs.existsSync(EXPORT_DIR)) {
  fs.mkdirSync(EXPORT_DIR, { recursive: true });
}

console.log('Authenticating with Xray API...');

// Read cloud_auth.json file
const authData = fs.readFileSync('./scripts/xray-integration/cloud-auth.json');
const authJson = JSON.parse(authData);

// Authenticate and retrieve a token
const options = {
  hostname: new URL(process.env.BASE_URL).hostname,
  port: 443,
  path: '/api/v1/authenticate',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    const token = JSON.parse(data);
    if (!token) {
      console.error(
        'Failed to retrieve authentication token. Check cloud_auth.json and API connectivity.'
      );
      process.exit(1);
    }
    console.log('Authentication successful. Token received.');

    console.log('Downloading feature files...');

    // Download the zip file containing the feature files using API v2 endpoint
    const downloadOptions = {
      hostname: new URL(process.env.BASE_URL).hostname,
      port: 443,
      path: `/api/v2/export/cucumber?keys=${process.env.XRAY_EXP_KEYS}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    };

    const file = fs.createWriteStream(`${EXPORT_DIR}/features.zip`);

    const downloadReq = https.request(downloadOptions, (downloadRes) => {
      downloadRes.pipe(file);

      downloadRes.on('end', () => {
        console.log('Download successful.');
      });
    });

    downloadReq.on('error', (err) => {
      console.error(
        'Failed to download feature files. Check API settings and network connection.',
        err
      );
      process.exit(1);
    });

    downloadReq.end();
  });
});

req.on('error', (error) => {
  console.error('Failed to authenticate with Xray API.', error);
  process.exit(1);
});

req.write(JSON.stringify(authJson));
req.end();
