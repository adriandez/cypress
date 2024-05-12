import fs from 'fs/promises';
import path from 'path';
import { extractKeyNumFromFileName, createFolderAndFile } from './utilities.js';
import { logger } from '../logger.js';

// Handles processing of all action files in a specified directory
export const handleActionFiles = async (
  actionsDir,
  featureKeyNums,
  matchedActionsKeyNums
) => {
  await processDirectory(
    actionsDir,
    async (file, filePath, fileRelativePath) => {
      await handleFileType(
        file,
        filePath,
        fileRelativePath,
        '-page-actions.js',
        featureKeyNums,
        matchedActionsKeyNums,
        handleActionFile
      );
    }
  );

  featureKeyNums.forEach(async (featureFileDetails, keyNum) => {
    if (!matchedActionsKeyNums.has(keyNum)) {
      logger.warn(
        `No matching page-actions.js file found for KEY-NUM: ${keyNum}`
      );
      logger.info(`Creating folder structure and file for KEY-NUM: ${keyNum}`);
      await createFolderAndFile(
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
};

// Handles processing of a single action file and matches it with a feature key number.
const handleActionFile = async (
  file,
  filePath,
  fileRelativePath,
  fileType,
  keyNums,
  matchedKeyNums
) => {
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
};

// Generic function to handle different file types using specific file handlers.
export const handleFileType = async (
  file,
  filePath,
  fileRelativePath,
  fileType,
  keyNums,
  matchedKeyNums,
  fileHandler
) => {
  await fileHandler(
    file,
    filePath,
    fileRelativePath,
    fileType,
    keyNums,
    matchedKeyNums
  );
};

// Processes all files in the given directory and applies a handler function to each.
const processDirectory = async (dir, fileHandler, relativePath = '') => {
  try {
    logger.info(`Processing directory: ${dir}`);
    const files = await fs.readdir(dir);
    logger.info(`Found files: ${files}`);

    await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(dir, file);
        const fileRelativePath = path.join(relativePath, file);
        const stat = await fs.stat(filePath);

        if (stat.isDirectory()) {
          logger.info(`Entering directory: ${filePath}`);
          await processDirectory(filePath, fileHandler, fileRelativePath);
        } else {
          await fileHandler(file, filePath, fileRelativePath);
        }
      })
    );
  } catch (error) {
    logger.error(`Error processing directory: ${dir}. Error: ${error}`);
  }
};
