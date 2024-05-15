import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';
import { logger } from '../logger.js';

dotenv.config();

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const createDirIfNotExist = async (dir) => {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
    logger.info(`Directory created: ${dir}`);
  }
};

const getJiraLabels = async (issueKey) => {
  try {
    const authData = await fs.readFile('./jira-auth.json', 'utf8');
    const { API_TOKEN, EMAIL } = JSON.parse(authData);
    const credentials = `${EMAIL}:${API_TOKEN}`;
    const url = `${process.env.JIRA_BASE_URL}/rest/api/3/issue/${issueKey}`;
    const token = Buffer.from(credentials).toString('base64');
    const headers = {
      Authorization: `Basic ${token}`,
      Accept: 'application/json'
    };
    const response = await axios.get(url, { headers });
    logger.info(`Labels fetched for issue ${issueKey}`);
    return response.data.fields.labels;
  } catch (error) {
    logger.error(`Error fetching Jira issue ${issueKey}: ${error.message}`);
    throw new Error('Failed to fetch Jira labels');
  }
};

const getFeatureFiles = async (dirPath) => {
  let filesToReturn = [];
  const files = await fs.readdir(dirPath, { withFileTypes: true });
  for (const file of files) {
    const filePath = path.join(dirPath, file.name);
    if (file.isDirectory()) {
      filesToReturn = filesToReturn.concat(await getFeatureFiles(filePath));
    } else if (file.name.endsWith('.feature')) {
      filesToReturn.push(filePath);
    }
  }
  logger.info(`Files listed from directory: ${dirPath}`);
  return filesToReturn;
};

const processFeatureFiles = async () => {
  const exportDir = path.join(
    process.cwd(),
    process.env.EXPORT_DIR || 'cypress/cloud-export'
  );
  const targetDir = path.join(
    process.cwd(),
    process.env.TARGET_DIR || 'cypress/e2e/cucumber/feature'
  );
  const exportFiles = await getFeatureFiles(exportDir);
  const targetFiles = await getFeatureFiles(targetDir);
  let processedCount = 0;

  for (const file of exportFiles) {
    const fileName = path.basename(file);
    const split = fileName.split('-');
    const keyNum = split[0] + '-' + split[1];
    const targetFilePath = targetFiles.find((f) =>
      path.basename(f).startsWith(keyNum)
    );

    try {
      if (targetFilePath) {
        if (await fs.stat(targetFilePath)) {
          logger.info(`Match: Updating ${fileName} at ${targetFilePath}`);
          await fs.rm(targetFilePath);
          await fs.rename(file, targetFilePath);
          processedCount++;
        }
      } else {
        logger.info(`No match: Moving ${fileName}`);
        const labels = await getJiraLabels(keyNum);
        const L1Dirs = labels
          .filter((label) => label.startsWith('L1_Dir_'))
          .map((label) => label.split('_')[2]);
        const L2Dirs = labels
          .filter((label) => label.startsWith('L2_Dir_'))
          .map((label) => label.split('_')[2]);

        for (const L1Dir of L1Dirs) {
          const L1Path = path.join(targetDir, L1Dir);
          await createDirIfNotExist(L1Path);

          for (const L2Dir of L2Dirs) {
            const L2Path = path.join(L1Path, L2Dir);
            await createDirIfNotExist(L2Path);
            const newPath = path.join(L2Path, fileName);
            if (await fs.stat(newPath).catch(() => false)) {
              logger.warn(
                `File already exists and will not be overwritten: ${newPath}`
              );
            } else {
              await fs.rename(file, newPath);
              logger.info(`Moved ${fileName} to ${L2Path}`);
              processedCount++;
            }
          }
        }
      }
    } catch (error) {
      logger.error(`Error processing ${fileName}: ${error.message}`);
    }
  }

  logger.info(`Total files processed: ${processedCount}`);
};

export const organizeFeatures = processFeatureFiles;
