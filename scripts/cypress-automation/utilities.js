import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { logger } from './logger.js';

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

export const extractKeyNumFromFileName = (fileName) => {
  try {
    const match = fileName.match(/^([^-]+-\d+)/);
    const keyNum = match ? match[1] : 'None';
    logger.debug(
      `Extracting key from file name: ${fileName}. Found: ${keyNum}`
    );
    return keyNum !== 'None' ? keyNum : null;
  } catch (error) {
    logger.error(
      `Error extracting key from file name: ${fileName}. Error: ${error}`
    );
    return null;
  }
};

export const processDirectory = (dir, fileHandler, relativePath = '') => {
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
};

export const createFolderAndFile = (
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
    logger.debug(`New folder path: ${newFolderPath}`);

    fs.mkdirSync(newFolderPath, { recursive: true });
    logger.info(`Created directories up to: ${newFolderPath}`);

    const newFileName = featureFileName
      .replace(/^[^-]+-\d+-/, '')
      .replace('.feature', fileType);
    const newFilePath = path.join(newFolderPath, newFileName);
    logger.debug(`New file path: ${newFilePath}`);

    fs.writeFileSync(newFilePath, templateCode);
    logger.info(`Created file: ${newFilePath} with template code`);
  } catch (error) {
    logger.error(
      `Failed to create folder or file for feature: ${featureFileName}. Error: ${error}`
    );
  }
};
