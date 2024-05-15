import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import { logger } from '../logger.js';
import { fillTemplateWithData } from './stepDefTemplate.js';

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
    logger.info(`Extracting key from file name: ${fileName}. Found: ${keyNum}`);
    return keyNum !== 'None' ? keyNum : null;
  } catch (error) {
    logger.error(
      `Error extracting key from file name: ${fileName}. Error: ${error}`
    );
    return null;
  }
};

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
        await processDirectory(filePath, fileHandler, fileRelativePath);
      } else {
        await fileHandler(file, filePath, fileRelativePath);
      }
    }
  } catch (error) {
    logger.error(`Error processing directory: ${dir}. Error: ${error}`);
  }
};

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
    // Conditional handling for step definition templates
    if (fileType === '-step-def.js' && templateCode === 'utilities-import') {
      templateCode = await fillTemplateWithData(featurePath, featureFileName);
      if (!templateCode) {
        throw new Error('Template code is null or undefined.');
      }
    }

    const featureFolderPath = path.dirname(featurePath);

    const newFolderPath = createExtraFolder
      ? path.join(
          baseDir,
          featureFolderPath,
          featureFileName.replace('.feature', '')
        )
      : path.join(baseDir, featureFolderPath);
    logger.info(`New folder path: ${newFolderPath}`);

    try {
      await fs.mkdir(newFolderPath, { recursive: true });
      logger.info(`Created directories up to: ${newFolderPath}`);
    } catch (error) {
      logger.error(`fs.mkdire: ${error.message}. Error: ${error}`);
    }

    const newFileName = featureFileName
      .replace(/^[^-]+-\d+-/, '')
      .replace('.feature', fileType);
    const newFilePath = path.join(newFolderPath, newFileName);
    logger.info(`New file path: ${newFilePath}`);

    await fs.writeFile(newFilePath, templateCode);
    logger.info(`Created file: ${newFilePath} with template code`);
  } catch (error) {
    if (error.code === 'ENOENT') {
      logger.error(`Feature file not found: ${featurePath}`);
    } else {
      logger.error(
        `Failed to create folder or file for feature: ${featureFileName}. Error: ${error}`
      );
    }
  }
};

const main = async () => {
  try {
    await processDirectory(featureDir, async (file, filePath) => {
      await createFolderAndFile(
        stepDefDir,
        { path: filePath, file },
        '-step-def.js',
        fillTemplateWithData
      );
      logger.info(`Handled feature file: ${filePath}`);
    });
  } catch (error) {
    logger.error(
      `An error occurred during ${featureDir} execution: ${error.message}`
    );
    process.exit(1);
  }
};

main();
