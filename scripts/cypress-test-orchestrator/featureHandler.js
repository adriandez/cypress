import { extractKeyNumFromFileName } from './utilities.js';
import { logger } from '../logger.js';

/**
 * Handles processing of a single feature file by checking its extension,
 * extracting and logging relevant information.
 *
 * @param {string} file - The name of the file.
 * @param {string} filePath - The absolute path to the file.
 * @param {string} fileRelativePath - The relative path from the current directory to the file.
 * @param {Map} keyNums - A Map object to store key numbers associated with files.
 */
export const handleFeatureFile = (
  file,
  filePath,
  fileRelativePath,
  keyNums
) => {
  if (!file) {
    logger.error('No file name provided.');
    return;
  }

  // Check if the file extension is '.feature'.
  if (file.endsWith('.feature')) {
    logger.info(`Found feature file: ${file} - file path: ${filePath}`);
    try {
      const keyNum = extractKeyNumFromFileName(file);
      if (keyNum) {
        keyNums.set(keyNum, { file, path: fileRelativePath });
        logger.info(
          `File: ${file} - Path: ${fileRelativePath} - KEY-NUM: ${keyNum}`
        );
      } else {
        logger.warn(
          `No key number found in file name: ${file}. Ensure the file is correctly named.`
        );
      }
    } catch (error) {
      logger.error(
        `Error extracting key number from file: ${file}. Error: ${error.message}`
      );
    }
  } else {
    logger.warn(`Skipped non-feature file: ${file}`);
  }
};
