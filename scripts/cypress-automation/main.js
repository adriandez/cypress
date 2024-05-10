import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import dotenv from 'dotenv';
import { logger } from './logger.js';
import { processDirectory } from './utilities.js';
import { handleFeatureFile } from './featureHandler.js';
import { handleStepDefinitions, handleStepDefFile } from './stepDefHandler.js';
import { handleActionFiles, handleFileType } from './actionHandler.js';
import {
  handlePageObjects,
  handlePageObjectFile
} from './pageObjectHandler.js';

dotenv.config();

// Setting up __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Logging initial environment and configurations
logger.debug('Environment variables loaded:', JSON.stringify(process.env));

const baseDir = 'cypress/e2e/cucumber';
const featureDir = path.join(baseDir, 'feature');
const stepDefDir = path.join(baseDir, 'step-definitions');
const actionsDir = 'cypress/support/actions';
const pageObjectsDir = path.join('cypress/support/page-objects');

// Log the initial paths set up for the script
logger.info(`Initial setup: Base directory set to ${baseDir}`);
logger.info(`Feature directory set to ${featureDir}`);
logger.info(`Step definitions directory set to ${stepDefDir}`);
logger.info(`Actions directory set to ${actionsDir}`);
logger.info(`Page Objects directory set to ${pageObjectsDir}`);

// Execute external scripts synchronously
const scripts = [
  '../jira-integration/export-rename-feature-files.js',
  '../jira-integration/jira-feature-organizer.js'
];

scripts.forEach((script) => {
  try {
    const scriptPath = path.join(__dirname, script);
    logger.info(`Executing ${scriptPath}`);
    execSync(`node ${scriptPath}`, { stdio: 'inherit' });
    logger.info(`${scriptPath} script executed successfully.`);
  } catch (error) {
    logger.error(
      `Failed to execute ${scriptPath} script. Error: ${error.message}`
    );
    process.exit(1); // Optionally exit if the script cannot be executed
  }
});

// Process feature files
const featureKeyNums = new Map();
processDirectory(featureDir, (file, filePath, fileRelativePath) => {
  handleFeatureFile(file, filePath, fileRelativePath, featureKeyNums);
  logger.debug(`Processing feature file: ${file} at ${filePath}`);
});

// Process step definitions
const matchedStepDefKeyNums = new Set();
processDirectory(stepDefDir, (file, filePath, fileRelativePath) => {
  handleFileType(
    file,
    filePath,
    fileRelativePath,
    '-step-def.js',
    featureKeyNums,
    matchedStepDefKeyNums,
    handleStepDefFile
  );
  logger.debug(`Processing step definition file: ${file} at ${filePath}`);
});

handleStepDefinitions(featureKeyNums, matchedStepDefKeyNums, stepDefDir);

// Process actions
const matchedActionsKeyNums = new Set();
handleActionFiles(actionsDir, featureKeyNums, matchedActionsKeyNums);

// Process page objects
const matchedPageObjectsKeyNums = new Set();
processDirectory(pageObjectsDir, (file, filePath, fileRelativePath) => {
  handlePageObjectFile(
    file,
    filePath,
    fileRelativePath,
    '-page-objects.js',
    featureKeyNums,
    matchedPageObjectsKeyNums
  );
  logger.debug(`Processing page object file: ${file} at ${filePath}`);
});

handlePageObjects(featureKeyNums, pageObjectsDir);

logger.info('Script execution completed. All directories and files processed.');
