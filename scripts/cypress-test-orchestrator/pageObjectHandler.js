import { logger } from '../logger.js';
import fs from 'fs';
import path from 'path';
import { createFolderAndFile, extractKeyNumFromFileName } from './utilities.js';

/**
 * Handles the creation of page object files if they do not exist.
 *
 * @param {Map} featureKeyNums - A map containing feature file details keyed by key numbers.
 * @param {string} pageObjectsDir - The directory path for page objects.
 */
export const handlePageObjects = (featureKeyNums, pageObjectsDir) => {
  featureKeyNums.forEach((featureFileDetails, keyNum) => {
    const featurePath = featureFileDetails.path;
    const featureFileName = featureFileDetails.file;
    const pageObjectFileName = `${featureFileName.replace(/^[^-]+-\d+-/, '').replace('.feature', '')}-page-objects.js`;
    const pageObjectFilePath = path.join(
      pageObjectsDir,
      path.dirname(featurePath),
      pageObjectFileName
    );

    if (!fs.existsSync(pageObjectFilePath)) {
      logger.warn(
        `No matching page-objects.js file found for KEY-NUM: ${keyNum}`
      );
      logger.info(`Creating folder structure and file for KEY-NUM: ${keyNum}`);
      try {
        createFolderAndFile(
          pageObjectsDir,
          featureFileDetails,
          '-page-objects.js',
          `
/*
* Page Elements
**/

export const nameVariable = 'string';

`,
          false
        );
      } catch (error) {
        logger.error(
          `Failed to create page objects file for KEY-NUM: ${keyNum}: ${error}`
        );
      }
    }
  });
};

/**
 * Processes a single page object file and matches it with a feature key number.
 *
 * @param {string} file - The name of the file.
 * @param {string} filePath - The path of the file.
 * @param {string} fileRelativePath - The relative path of the file.
 * @param {string} fileType - The type of file (e.g., "-page-objects.js").
 * @param {Map} keyNums - A map containing key numbers to feature file details.
 * @param {Set} matchedKeyNums - A set of matched key numbers.
 */
export const handlePageObjectFile = (
  file,
  filePath,
  fileRelativePath,
  fileType,
  keyNums,
  matchedKeyNums
) => {
  if (file.endsWith(fileType)) {
    logger.info(`Found page object file: ${file}`);
    const keyNum = extractKeyNumFromFileName(file);
    if (keyNum && keyNums.has(keyNum)) {
      matchedKeyNums.add(keyNum);
      logger.info(`Match found - Path: ${fileRelativePath} - File: ${file}`);
    } else {
      logger.warn(`No match found - Path: ${fileRelativePath} - File: ${file}`);
    }
  }
};
