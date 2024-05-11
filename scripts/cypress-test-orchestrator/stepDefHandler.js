import { createFolderAndFile, extractKeyNumFromFileName } from './utilities.js';
import { logger } from '../logger.js';

/**
 * Handles the creation of step definition files if they do not exist.
 * Iterates through feature files and creates corresponding step definition files if they are not already matched.
 *
 * @param {Map} featureKeyNums - A map containing feature file details keyed by key numbers.
 * @param {Set} matchedStepDefKeyNums - A set containing matched key numbers for step definitions.
 * @param {string} stepDefDir - The directory path for step definitions.
 */
export const handleStepDefinitions = (
  featureKeyNums,
  matchedStepDefKeyNums,
  stepDefDir
) => {
  featureKeyNums.forEach((featureFileDetails, keyNum) => {
    if (!matchedStepDefKeyNums.has(keyNum)) {
      logger.warn(`No matching step-def.js file found for KEY-NUM: ${keyNum}`);
      logger.info(`Creating folder structure and file for KEY-NUM: ${keyNum}`);
      createFolderAndFile(
        stepDefDir,
        featureFileDetails,
        '-step-def.js',
        `
import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { template } from '../../../../support/actions/';

Given('template', () => {});

When('template', () => {});

Then('template', () => {});
        `,
        true
      );
    }
  });
};

/**
 * Processes a single step definition file and checks if it corresponds to any known feature key numbers.
 * Logs information about each step definition file processed.
 *
 * @param {string} file - The name of the file.
 * @param {string} filePath - The path of the file.
 * @param {string} fileRelativePath - The relative path of the file.
 * @param {string} fileType - The type of file (e.g., "-step-def.js").
 * @param {Map} keyNums - A map containing key numbers to feature file details.
 * @param {Set} matchedKeyNums - A set of matched key numbers.
 */
export const handleStepDefFile = (
  file,
  fileRelativePath,
  fileType,
  keyNums,
  matchedKeyNums
) => {
  if (file.endsWith(fileType)) {
    logger.info(`Found step definition file: ${file}`);
    const keyNum = extractKeyNumFromFileName(file);
    if (keyNum && keyNums.has(keyNum)) {
      matchedKeyNums.add(keyNum);
      logger.info(`Match found - Path: ${fileRelativePath} - File: ${file}`);
    } else {
      logger.warn(`No match found - Path: ${fileRelativePath} - File: ${file}`);
    }
  }
};
