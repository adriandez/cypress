import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { logger } from '../logger.js';
import { organizeFeatures } from '../jira-integration/jira-feature-organizer.js';
import { renameFeatureFiles } from '../jira-integration/export-rename-feature-files.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseDir = 'cypress/e2e/cucumber';
const featureDir = path.join(baseDir, 'feature');
const stepDefDir = path.join(baseDir, 'step-definitions');
const actionsDir = 'cypress/support/actions';
const pageObjectsDir = path.join('cypress/support/page-objects');

logger.info(`Initial setup: Base directory set to ${baseDir}`);
logger.info(`Feature directory set to ${featureDir}`);
logger.info(`Step definitions directory set to ${stepDefDir}`);
logger.info(`Actions directory set to ${actionsDir}`);
logger.info(`Page Objects directory set to ${pageObjectsDir}`);

const main = async () => {
  try {
    logger.attempting('Renaming feature files');
    await renameFeatureFiles();
    logger.success('Feature files renamed successfully.');

    logger.attempting('JIRA feature organization');
    await organizeFeatures();
    logger.success('JIRA feature organization completed successfully.');
  } catch (error) {
    logger.error(`An error occurred: ${error.message}`);
    process.exit(1);
  }
};

main();
