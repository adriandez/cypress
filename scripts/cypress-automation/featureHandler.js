import { extractKeyNumFromFileName } from './utilities.js';
import { logger } from './logger.js';

export const handleFeatureFile = (
  file,
  filePath,
  fileRelativePath,
  keyNums
) => {
  if (file.endsWith('.feature')) {
    logger.info(`Found feature file: ${file}`);
    const keyNum = extractKeyNumFromFileName(file);
    if (keyNum) {
      keyNums.set(keyNum, { file, path: fileRelativePath });
      logger.debug(
        `File: ${file} - Path: ${fileRelativePath} - KEY-NUM: ${keyNum}`
      );
    } else {
      logger.warn(`Could not extract key number from file: ${file}`);
    }
  }
};
