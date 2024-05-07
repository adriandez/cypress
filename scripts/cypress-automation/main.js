import path from 'path';
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

const baseDir = 'cypress/e2e/cucumber';
const featureDir = path.join(baseDir, 'feature');
const stepDefDir = path.join(baseDir, 'step-definitions');
const actionsDir = 'cypress/support/actions';
const pageObjectsDir = path.join('cypress/support/page-objects');

logger.info(`Starting script. Feature directory: ${featureDir}`);
logger.info(`Step definitions directory: ${stepDefDir}`);
logger.info(`Actions directory: ${actionsDir}`);
logger.info(`Page Objects directory: ${pageObjectsDir}`);

// Process feature files
const featureKeyNums = new Map();
processDirectory(featureDir, (file, filePath, fileRelativePath) => {
  handleFeatureFile(file, filePath, fileRelativePath, featureKeyNums);
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
});

handlePageObjects(featureKeyNums, pageObjectsDir);

logger.info('Script execution completed.');
