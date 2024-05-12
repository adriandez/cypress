import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { logger } from '../logger.js'; // Added import for custom logger

dotenv.config();

const JIRA_PROJECT_ID = process.env.JIRA_PROJECT_ID || 'default_project_id';
const TEST_BROWSER = process.env.TEST_BROWSER || 'chrome';
const JIRA_TEST_EXECUTION_ID =
  process.env.JIRA_TEST_EXECUTION_ID || 'default_issuetype_id';

logger.start('import-prepare-info-result-cloud');
logger.info('JIRA_PROJECT_ID: ' + process.env.JIRA_PROJECT_ID);
logger.info('JIRA_TEST_EXECUTION_ID: ' + process.env.JIRA_TEST_EXECUTION_ID);

const getOS = () => {
  const platform = os.platform();
  switch (platform) {
    case 'win32':
      return 'windows';
    case 'linux':
      return 'linux';
    default:
      return 'unsupported';
  }
};

const createJsonObject = (osType, browser, fileName) => ({
  fields: {
    project: {
      id: JIRA_PROJECT_ID
    },
    summary: `${fileName} ${osType}-${browser} Test execution`,
    issuetype: {
      id: JIRA_TEST_EXECUTION_ID
    },
    components: []
  },
  xrayFields: {
    testPlanKey: 'DEMO-198',
    environments: [`${osType}-${browser}`]
  }
});

const osType = getOS();
const browser = TEST_BROWSER;

if (osType === 'unsupported') {
  logger.error('Unsupported OS detected');
} else {
  logger.attempting('Process files...');
}

const readDirectories = (dir, callback) => {
  fs.readdir(dir, { withFileTypes: true }, (err, entries) => {
    if (err) {
      logger.error('Failed to read directory: ' + err);
      return;
    }
    entries.forEach((entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        readDirectories(fullPath, callback);
      } else if (entry.isFile() && entry.name.endsWith('.cucumber.json')) {
        callback(fullPath, entry.name);
      }
    });
  });
};

const processFile = (filePath, fileName) => {
  const dirname = path.dirname(filePath);
  const baseName = path.basename(fileName, '.cucumber.json');
  const newFileName = `${baseName}-info.json`;
  const newFilePath = path.join(dirname, newFileName);

  // Create the jsonObject using the baseName of the file
  const localJsonObject = createJsonObject(osType, browser, baseName);

  fs.writeFile(newFilePath, JSON.stringify(localJsonObject, null, 2), (err) => {
    if (err) {
      logger.error(`Failed to write file ${newFileName}: ` + err);
    } else {
      logger.success(`File written ${newFilePath}`);
    }
  });
};

readDirectories('cypress/cloud-import-results', processFile);
