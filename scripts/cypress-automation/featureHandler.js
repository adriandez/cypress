// Importing the utility function to extract key numbers from file names.
import { extractKeyNumFromFileName } from './utilities.js';

// Importing the logger module for logging messages.
import { logger } from './logger.js';

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
  // Check if the file extension is '.feature'.
  if (file.endsWith('.feature')) {
    // Log the discovery of a feature file.
    logger.info(`Found feature file: ${file}`);

    // Extract the key number from the file name.
    const keyNum = extractKeyNumFromFileName(file);

    if (keyNum) {
      // If a key number is successfully extracted, store it in the Map along with file details.
      keyNums.set(keyNum, { file, path: fileRelativePath });

      // Log detailed information about the file and the extracted key number.
      logger.debug(
        `File: ${file} - Path: ${fileRelativePath} - KEY-NUM: ${keyNum}`
      );
    } else {
      // Log a warning if no key number could be extracted from the file name.
      logger.warn(`Could not extract key number from file: ${file}`);
    }
  }
};
