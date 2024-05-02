import dotenv from 'dotenv';
import report from 'multiple-cucumber-html-reporter';
import fs from 'fs';
import path from 'path';
import moment from 'moment';

dotenv.config();

try {
  const date = moment().format('YYYYMMDD-HHmmss');
  const currentDir = path.dirname(
    decodeURI(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1')
  );
  const reportDirectory = path.join(currentDir, 'cypress', 'reports', date);

  // Ensure the report directory exists
  if (!fs.existsSync(reportDirectory)) {
    fs.mkdirSync(reportDirectory, { recursive: true });
  }

  // Generate the report
  report.generate({
    jsonDir: './cypress/cucumber-json',
    reportPath: reportDirectory,
    metadata: {
      browser: {
        name: process.env.TEST_BROWSER || 'unknown',
        version: ''
      },
      device: 'Local test machine',
      platform: {
        name: process.platform,
        version: ''
      }
    }
  });
} catch (error) {
  console.error('Failed to generate report:', error);
  // Optionally, you can perform additional actions here, like sending notification about the failure.
  process.exit(1); // Exit the process with an error code
}
