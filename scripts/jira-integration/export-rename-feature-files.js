import dotenv from 'dotenv';
import axios from 'axios';
import fs from 'fs/promises';
import { Buffer } from 'buffer';
import path from 'path';
import { logger } from '../logger.js';

dotenv.config();

const EXPORT_DIR = process.env.EXPORT_DIR || 'cypress/cloud-export';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const getJiraIssueSummary = async (issueKey) => {
  try {
    const authData = await fs.readFile('./jira-auth.json', 'utf8');
    const { API_TOKEN, EMAIL } = JSON.parse(authData);
    const credentials = `${EMAIL}:${API_TOKEN}`;
    const token = Buffer.from(credentials).toString('base64');
    const url = `${process.env.JIRA_BASE_URL}/rest/api/3/issue/${issueKey}`;
    const headers = {
      Authorization: `Basic ${token}`,
      Accept: 'application/json'
    };

    const response = await axios.get(url, { headers });
    return response.data.fields.summary;
  } catch (error) {
    logger.error(
      `Error fetching Jira issue for key ${issueKey}: ${error.message}`
    );
    return null;
  }
};

const renameFeatureFiles = async () => {
  try {
    const files = await fs.readdir(EXPORT_DIR);
    const featureFiles = files.filter((file) => file.endsWith('.feature'));

    for (const file of featureFiles) {
      const issueKey = file.split('.')[0];
      const summary = await getJiraIssueSummary(issueKey);
      if (summary) {
        const cleanSummary = summary.replace(`${issueKey} `, '');
        logger.debug(`------>>cleanSummary:${cleanSummary}`);

        const lowerCaseCleanSummary = cleanSummary.toLocaleLowerCase();
        logger.debug(`------>>lowerCaseCleanSummary:${lowerCaseCleanSummary}`);

        const kebabCaseCleanSummary = lowerCaseCleanSummary.replace(/ /g, '-');
        logger.debug(`------>>kebabCaseCleanSummary:${kebabCaseCleanSummary}`);

        const newFilename = `${issueKey}-${kebabCaseCleanSummary}.feature`;
        logger.debug(`------>>newFilename:${newFilename}`);

        logger.debug(`------>>file:${file}`);
        await fs.rename(
          path.join(EXPORT_DIR, file),
          path.join(EXPORT_DIR, newFilename)
        );
        logger.info(`Renamed ${file} to ${newFilename}`);
      }
    }
  } catch (error) {
    logger.error(`Error processing feature files: ${error.message}`);
  }
};

export { renameFeatureFiles };
