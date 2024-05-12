import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import { logger } from '../logger.js';

// Load environment settings
dotenv.config();

// Define base directories for Cypress tests and supporting files
const baseDir = 'cypress/e2e/cucumber';
const featureDir = path.join(baseDir, 'feature');
const stepDefDir = path.join(baseDir, 'step-definitions');
const actionsDir = 'cypress/support/actions';
const pageObjectsDir = path.join('cypress/support/page-objects');

// Log the initial setup information for directories
logger.info(`Starting script. Feature directory: ${featureDir}`);
logger.info(`Step definitions directory: ${stepDefDir}`);
logger.info(`Actions directory: ${actionsDir}`);
logger.info(`Page Objects directory: ${pageObjectsDir}`);

// Extracts a key number from a filename typically formatted with a key at the start
export const extractKeyNumFromFileName = (fileName) => {
  try {
    const match = fileName.match(/^([^-]+-\d+)/);
    const keyNum = match ? match[1] : 'None';
    logger.info(`Extracting key from file name: ${fileName}. Found: ${keyNum}`);
    return keyNum !== 'None' ? keyNum : null;
  } catch (error) {
    logger.error(
      `Error extracting key from file name: ${fileName}. Error: ${error}`
    );
    return null;
  }
};

// Process directories recursively, applying an async handler function to each file
export const processDirectory = async (dir, fileHandler, relativePath = '') => {
  try {
    logger.info(`Processing directory: ${dir}`);
    const files = await fs.readdir(dir);
    logger.info(`Found files: ${files}`);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const fileRelativePath = path.join(relativePath, file);
      const stat = await fs.stat(filePath);

      if (stat.isDirectory()) {
        logger.info(`Entering directory: ${filePath}`);
        await processDirectory(filePath, fileHandler, fileRelativePath); // Ensure recursive calls are awaited
      } else {
        await fileHandler(file, filePath, fileRelativePath); // Await handler to complete processing each file
      }
    }
  } catch (error) {
    logger.error(`Error processing directory: ${dir}. Error: ${error}`);
  }
};

// Create folders and files for features, handling templates for standard file content
export const createFolderAndFile = async (
  baseDir,
  featureFileDetails,
  fileType,
  templateCode,
  createExtraFolder = true
) => {
  const featurePath = featureFileDetails.path;
  const featureFileName = featureFileDetails.file;
  logger.info(`Creating folder and file for feature: ${featureFileName}`);

  try {
    const featureFolderPath = path.dirname(featurePath);
    const newFolderPath = createExtraFolder
      ? path.join(
          baseDir,
          featureFolderPath,
          featureFileName.replace('.feature', '')
        )
      : path.join(baseDir, featureFolderPath);
    logger.info(`New folder path: ${newFolderPath}`);

    await fs.mkdir(newFolderPath, { recursive: true });
    logger.info(`Created directories up to: ${newFolderPath}`);

    const newFileName = featureFileName
      .replace(/^[^-]+-\d+-/, '')
      .replace('.feature', fileType);
    const newFilePath = path.join(newFolderPath, newFileName);
    logger.info(`New file path: ${newFilePath}`);

    await fs.writeFile(newFilePath, templateCode);
    logger.info(`Created file: ${newFilePath} with template code`);
  } catch (error) {
    logger.error(
      `Failed to create folder or file for feature: ${featureFileName}. Error: ${error}`
    );
  }
};

// Main function to run the script
const main = async () => {
  try {
    // Simulate processing of directories and file operations
    await processDirectory(featureDir, async (file, filePath) => {
      // Placeholder for what might happen in fileHandler
      logger.info(`Handling file: ${file} at ${filePath}`);
    });
  } catch (error) {
    logger.error(
      `An error occurred during ${featureDir} execution: ${error.message}`
    );
    process.exit(1);
  }
};

main();
