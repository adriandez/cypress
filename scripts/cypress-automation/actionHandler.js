import fs from 'fs';
import path from 'path';
import { extractKeyNumFromFileName, createFolderAndFile } from './utilities.js';
import { logger } from './logger.js';

export function handleActionFiles(
  actionsDir,
  featureKeyNums,
  matchedActionsKeyNums
) {
  processDirectory(actionsDir, (file, filePath, fileRelativePath) => {
    handleFileType(
      file,
      filePath,
      fileRelativePath,
      '-page-actions.js',
      featureKeyNums,
      matchedActionsKeyNums,
      handleActionFile
    );
  });

  featureKeyNums.forEach((featureFileDetails, keyNum) => {
    if (!matchedActionsKeyNums.has(keyNum)) {
      logger.warn(
        `No matching page-actions.js file found for KEY-NUM: ${keyNum}`
      );
      logger.info(`Creating folder structure and file for KEY-NUM: ${keyNum}`);
      createFolderAndFile(
        actionsDir,
        featureFileDetails,
        '-page-actions.js',
        `
import { wrapPageActions } from '../../utilities/action-wrapper.js';
import {} from '../../page-objects';

const pageActions = {
    function1: () => {
        // code here
    },
    function2: () => {
        // code here
    }
};

const wrappedPageActions = wrapPageActions(pageActions, 'ActionsPage');

export default wrappedPageActions;

`,
        false
      );
    }
  });
}

// Processes a single action file and matches it with a feature key number.
function handleActionFile(
  file,
  filePath,
  fileRelativePath,
  fileType,
  keyNums,
  matchedKeyNums
) {
  if (file.endsWith(fileType)) {
    logger.info(`Found action file: ${file}`);
    const keyNum = extractKeyNumFromFileName(file);
    if (keyNum && keyNums.has(keyNum)) {
      matchedKeyNums.add(keyNum);
      logger.info(`Match found - Path: ${fileRelativePath} - File: ${file}`);
    } else {
      logger.warn(`No match found - Path: ${fileRelativePath} - File: ${file}`);
    }
  }
}

// Generic function to handle different file types using specific file handlers.
export function handleFileType(
  file,
  filePath,
  fileRelativePath,
  fileType,
  keyNums,
  matchedKeyNums,
  fileHandler
) {
  fileHandler(
    file,
    filePath,
    fileRelativePath,
    fileType,
    keyNums,
    matchedKeyNums
  );
}

// Processes all files in the given directory and applies a handler function to each.
function processDirectory(dir, fileHandler, relativePath = '') {
  try {
    logger.info(`Processing directory: ${dir}`);
    const files = fs.readdirSync(dir);
    logger.debug(`Found files: ${files}`);

    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const fileRelativePath = path.join(relativePath, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        logger.info(`Entering directory: ${filePath}`);
        processDirectory(filePath, fileHandler, fileRelativePath);
      } else {
        fileHandler(file, filePath, fileRelativePath);
      }
    });
  } catch (error) {
    logger.error(`Error processing directory: ${dir}. Error: ${error}`);
  }
}
