import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { logger } from '../logger.js';
import { processDirectory } from './utilities.js';
import { handleFeatureFile } from './featureHandler.js';
import { handleStepDefinitions, handleStepDefFile } from './stepDefHandler.js';
import { handleActionFiles, handleFileType } from './actionHandler.js';
import {
  handlePageObjects,
  handlePageObjectFile
} from './pageObjectHandler.js';
import { organizeFeatures } from '../jira-integration/jira-feature-organizer.js';
import { renameFeatureFiles } from '../jira-integration/export-rename-feature-files.js';

dotenv.config();

// Setting up __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Main async function to control flow
const main = async () => {
  try {
    // Execute async operations
    logger.attempting('Renaming feature files');
    await renameFeatureFiles(); // Ensure this completes before proceeding
    logger.success('Feature files renamed successfully.');

    // Proceed with the rest of the operations after renaming feature files
    logger.attempting('JIRA feature organization');
    await organizeFeatures();
    logger.success('JIRA feature organization completed successfully.');

    // Process feature files
    const featureKeyNums = new Map();
    await processDirectory(featureDir, (file, filePath, fileRelativePath) => {
      logger.attempting('Process feature files');
      handleFeatureFile(file, filePath, fileRelativePath, featureKeyNums);
      logger.info(`Processing feature file: ${file} at ${filePath}`);
      logger.success('Process feature files completed successfully.');
    });

    // Process step definitions
    const matchedStepDefKeyNums = new Set();
    await processDirectory(stepDefDir, (file, filePath, fileRelativePath) => {
      handleFileType(
        file,
        filePath,
        fileRelativePath,
        '-step-def.js',
        featureKeyNums,
        matchedStepDefKeyNums,
        handleStepDefFile
      );
      logger.info(`Processing step definition file: ${file} at ${filePath}`);
    });

    logger.attempting('Process step definitions files');
    handleStepDefinitions(featureKeyNums, matchedStepDefKeyNums, stepDefDir);
    logger.success('Process step definitions files completed successfully.');

    // Process actions
    const matchedActionsKeyNums = new Set();
    logger.attempting('Process actions files');
    handleActionFiles(actionsDir, featureKeyNums, matchedActionsKeyNums);
    logger.success('Process actions files completed successfully.');

    // Process page objects
    const matchedPageObjectsKeyNums = new Set();
    await processDirectory(
      pageObjectsDir,
      (file, filePath, fileRelativePath) => {
        handlePageObjectFile(
          file,
          filePath,
          fileRelativePath,
          '-page-objects.js',
          featureKeyNums,
          matchedPageObjectsKeyNums
        );
        logger.info(`Processing page object file: ${file} at ${filePath}`);
      }
    );
    logger.attempting('Process page objects files');
    handlePageObjects(featureKeyNums, pageObjectsDir);
    logger.success('Process page objects files completed successfully.');
  } catch (error) {
    logger.error(`An error occurred: ${error.message}`);
    process.exit(1);
  }
};

main();
